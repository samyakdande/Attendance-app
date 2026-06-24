"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const notifications_service_1 = require("../notifications/notifications.service");
const metrics_service_1 = require("../metrics/metrics.service");
const events_enum_1 = require("../common/enums/events.enum");
let AttendanceService = class AttendanceService {
    prisma;
    redis;
    auditLogs;
    notifications;
    metrics;
    constructor(prisma, redis, auditLogs, notifications, metrics) {
        this.prisma = prisma;
        this.redis = redis;
        this.auditLogs = auditLogs;
        this.notifications = notifications;
        this.metrics = metrics;
    }
    async startSession(institutionId, profileId, classId) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { profileId }
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher profile not found for this user.');
        }
        const session = await this.prisma.attendanceSession.create({
            data: {
                institutionId,
                classId,
                teacherId: teacher.id,
                status: 'active',
            }
        });
        const roster = await this.prisma.classStudent.findMany({
            where: { classId },
            include: { student: true }
        });
        if (roster.length === 0) {
            return session;
        }
        const rosterKey = `tenant:${institutionId}:session:${session.id}:roster`;
        const statsKey = `tenant:${institutionId}:session:${session.id}:stats`;
        const studentIdMappingKey = `tenant:${institutionId}:session:${session.id}:studentIds`;
        try {
            const pipeline = this.redis.pipeline();
            roster.forEach(({ student }) => {
                pipeline.hset(rosterKey, student.qrIdentifier, `${student.id}_${student.enrollmentNumber}_${student.firstName}_${student.lastName}`);
                pipeline.hset(studentIdMappingKey, student.qrIdentifier, student.id);
            });
            pipeline.hset(statsKey, 'present', 0);
            pipeline.hset(statsKey, 'absent', 0);
            pipeline.hset(statsKey, 'pending', roster.length);
            pipeline.hset(statsKey, 'total', roster.length);
            pipeline.expire(rosterKey, 60 * 60 * 12);
            pipeline.expire(statsKey, 60 * 60 * 12);
            pipeline.expire(studentIdMappingKey, 60 * 60 * 12);
            await pipeline.exec();
        }
        catch (err) {
            console.warn('Redis unavailable. Proceeding with PostgreSQL only for session start.');
        }
        this.auditLogs.createLog({
            institutionId,
            actorId: profileId,
            action: events_enum_1.AuditAction.ATTENDANCE_CREATED,
            entityType: 'AttendanceSession',
            entityId: session.id,
        });
        this.metrics.incrementMetric(institutionId, metrics_service_1.MetricName.TOTAL_SESSIONS);
        return session;
    }
    async scanQr(institutionId, sessionId, qrIdentifier) {
        let studentId = '';
        let rollNumber = '';
        let firstName = '';
        let lastName = '';
        const rosterKey = `tenant:${institutionId}:session:${sessionId}:roster`;
        const statsKey = `tenant:${institutionId}:session:${sessionId}:stats`;
        const scanKey = `tenant:${institutionId}:scan:${sessionId}:`;
        try {
            const studentData = await this.redis.hget(rosterKey, qrIdentifier);
            if (studentData) {
                const parts = studentData.split('_');
                studentId = parts[0];
                rollNumber = parts[1];
                firstName = parts[2];
                lastName = parts[3];
                const alreadyScanned = await this.redis.get(`${scanKey}${studentId}`);
                if (alreadyScanned) {
                    throw new common_1.ConflictException('Already Marked');
                }
            }
        }
        catch (err) {
        }
        if (!studentId) {
            const session = await this.prisma.attendanceSession.findUnique({
                where: { id: sessionId },
            });
            if (!session)
                throw new common_1.NotFoundException('Session not found');
            const student = await this.prisma.student.findUnique({
                where: { qrIdentifier }
            });
            if (!student) {
                throw new common_1.NotFoundException('Invalid QR: Student not found.');
            }
            studentId = student.id;
            rollNumber = student.enrollmentNumber;
            firstName = student.firstName;
            lastName = student.lastName;
            const existingRecord = await this.prisma.attendanceRecord.findFirst({
                where: { sessionId, studentId }
            });
            if (existingRecord) {
                throw new common_1.ConflictException('Already Marked');
            }
        }
        await this.prisma.attendanceRecord.create({
            data: {
                sessionId,
                studentId,
                status: 'present',
                scannedAt: new Date(),
            }
        });
        let presentCount = 0;
        let pendingCount = 0;
        let totalCount = 1;
        try {
            const pipeline = this.redis.pipeline();
            pipeline.set(`${scanKey}${studentId}`, '1', 'EX', 60 * 60 * 12);
            pipeline.hincrby(statsKey, 'present', 1);
            pipeline.hincrby(statsKey, 'pending', -1);
            await pipeline.exec();
            const updatedStats = await this.redis.hgetall(statsKey);
            presentCount = parseInt(updatedStats.present || '0');
            pendingCount = parseInt(updatedStats.pending || '0');
            totalCount = parseInt(updatedStats.total || '1');
        }
        catch (err) {
            const allRecords = await this.prisma.attendanceRecord.count({
                where: { sessionId, status: 'present' }
            });
            const classInfo = await this.prisma.attendanceSession.findUnique({
                where: { id: sessionId },
                include: { class: { include: { _count: { select: { students: true } } } } }
            });
            presentCount = allRecords;
            totalCount = classInfo?.class._count.students || 1;
            pendingCount = totalCount - presentCount;
        }
        this.metrics.incrementMetric(institutionId, metrics_service_1.MetricName.TOTAL_SCANS);
        return {
            success: true,
            student: {
                id: studentId,
                firstName,
                lastName,
                enrollmentNumber: rollNumber,
            },
            sessionStats: {
                present: presentCount,
                absent: 0,
                pending: pendingCount,
                percentage: Math.round((presentCount / totalCount) * 100)
            }
        };
    }
    async getSessionReport(institutionId, sessionId) {
        const keys = await this.redis.keys(`tenant:${institutionId}:scan:${sessionId}:student_*`);
        const presentStudents = keys.map(key => {
            const parts = key.split(':');
            const studentId = parts[parts.length - 1];
            const rollNumber = studentId.replace('student_', '');
            return {
                rollNumber,
                status: 'PRESENT',
                scannedAt: 'Just Now',
            };
        });
        presentStudents.sort((a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber));
        return {
            totalScanned: presentStudents.length,
            session_id: sessionId,
            present_students: presentStudents,
        };
    }
    async getAllScans() {
        const keys = await this.redis.keys(`tenant:*:scan:*:student_*`);
        const presentStudents = keys.map(key => {
            const parts = key.split(':');
            const studentId = parts[parts.length - 1];
            const sessionId = parts[3];
            const rollNumber = studentId.replace('student_', '');
            return {
                session_id: sessionId,
                rollNumber,
                status: 'PRESENT',
                scannedAt: 'Just Now'
            };
        });
        presentStudents.sort((a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber));
        return {
            totalScanned: presentStudents.length,
            present_students: presentStudents,
        };
    }
    async closeSession(institutionId, sessionId) {
        const session = await this.prisma.attendanceSession.findFirst({
            where: { id: sessionId, institutionId },
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        const updatedSession = await this.prisma.attendanceSession.update({
            where: { id: sessionId },
            data: {
                status: 'closed',
                endTime: new Date(),
            },
        });
        this.calculateAbsentees(sessionId, session.classId);
        const rosterKey = `tenant:${institutionId}:session:${sessionId}:roster`;
        await this.redis.del(rosterKey);
        this.auditLogs.createLog({
            institutionId,
            actorId: session.teacherId,
            action: events_enum_1.AuditAction.SESSION_CLOSED,
            entityType: 'AttendanceSession',
            entityId: sessionId,
        });
        const teacher = await this.prisma.teacher.findUnique({ where: { id: session.teacherId } });
        if (teacher) {
            this.notifications.createNotification({
                institutionId,
                userId: teacher.profileId,
                title: 'Session Closed',
                message: 'Your attendance session has been successfully closed and absentees calculated.',
                type: events_enum_1.NotificationEvent.ATTENDANCE_SESSION_CLOSED,
                entityId: sessionId,
                entityType: 'AttendanceSession'
            });
        }
        return updatedSession;
    }
    async calculateAbsentees(sessionId, classId) {
        const classStudents = await this.prisma.classStudent.findMany({
            where: { classId },
        });
        const presentRecords = await this.prisma.attendanceRecord.findMany({
            where: { sessionId },
            select: { studentId: true },
        });
        const presentIds = new Set(presentRecords.map((r) => r.studentId));
        const absentData = classStudents
            .filter((cs) => !presentIds.has(cs.studentId))
            .map((cs) => ({
            sessionId,
            studentId: cs.studentId,
            status: 'absent',
        }));
        if (absentData.length > 0) {
            await this.prisma.attendanceRecord.createMany({
                data: absentData,
                skipDuplicates: true,
            });
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_logs_service_1.AuditLogsService,
        notifications_service_1.NotificationsService,
        metrics_service_1.MetricsService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map