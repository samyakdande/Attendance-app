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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(institutionId, user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let sessionWhere = { institutionId };
        let studentWhere = { institutionId, deletedAt: null };
        if (user?.role === 'teacher') {
            const teacher = await this.prisma.teacher.findUnique({
                where: { profileId: user.id }
            });
            if (teacher) {
                sessionWhere.class = { teacherId: teacher.id };
                studentWhere.classes = { some: { class: { teacherId: teacher.id } } };
            }
            else {
                return { totalStudents: 0, todaySessions: 0, recentSessions: [] };
            }
        }
        const recentSessions = await this.prisma.attendanceSession.findMany({
            where: sessionWhere,
            include: { class: true, _count: { select: { records: { where: { status: 'present' } } } } },
            orderBy: { startTime: 'desc' },
            take: 5
        });
        const totalStudents = await this.prisma.student.count({ where: studentWhere });
        return {
            totalStudents,
            todaySessions: recentSessions.filter(s => s.startTime >= today).length,
            recentSessions: recentSessions.map(s => ({
                id: s.id,
                className: s.class.name,
                date: s.startTime,
                present: s._count.records
            }))
        };
    }
    async getClassStats(institutionId, classId) {
        const cls = await this.prisma.class.findFirst({
            where: { id: classId, institutionId },
        });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        const totalStudents = await this.prisma.classStudent.count({
            where: { classId },
        });
        const sessions = await this.prisma.attendanceSession.findMany({
            where: { classId, institutionId, status: 'closed' },
            orderBy: { startTime: 'desc' },
            take: 30,
            include: {
                _count: {
                    select: {
                        records: {
                            where: { status: 'present' },
                        },
                    },
                },
            },
        });
        const sessionStats = sessions.map((s) => ({
            sessionId: s.id,
            date: s.startTime,
            presentCount: s._count.records,
            totalStudents,
            attendancePercentage: totalStudents > 0 ? (s._count.records / totalStudents) * 100 : 0,
        }));
        return {
            classId,
            className: cls.name,
            totalStudents,
            recentSessions: sessionStats,
        };
    }
    async getStudentReport(institutionId, studentId) {
        const student = await this.prisma.student.findFirst({
            where: { id: studentId, institutionId },
            include: {
                attendance: {
                    include: {
                        session: {
                            include: { class: true },
                        },
                    },
                    orderBy: { scannedAt: 'desc' },
                },
            },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const aggregation = await this.prisma.attendanceRecord.groupBy({
            by: ['status'],
            where: { studentId },
            _count: { status: true },
        });
        const presentCount = aggregation.find(a => a.status === 'present')?._count.status || 0;
        const totalClasses = aggregation.reduce((acc, curr) => acc + curr._count.status, 0);
        return {
            studentId: student.id,
            name: `${student.firstName} ${student.lastName}`,
            enrollmentNumber: student.enrollmentNumber,
            overallAttendance: totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0,
            history: student.attendance.map((r) => ({
                date: r.scannedAt || r.session.startTime,
                status: r.status,
                className: r.session.class.name,
            })),
        };
    }
    async exportInstitutionReport(institutionId, startDate, endDate) {
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate)
            dateFilter.lte = new Date(endDate);
        const sessions = await this.prisma.attendanceSession.findMany({
            where: {
                institutionId,
                startTime: Object.keys(dateFilter).length ? dateFilter : undefined,
            },
            include: {
                class: true,
                teacher: { include: { profile: true } },
                records: { include: { student: true } },
            },
        });
        const reportData = [];
        for (const session of sessions) {
            for (const record of session.records) {
                reportData.push({
                    sessionDate: session.startTime.toISOString(),
                    className: session.class.name,
                    teacherName: `${session.teacher.profile.firstName} ${session.teacher.profile.lastName}`,
                    studentName: `${record.student.firstName} ${record.student.lastName}`,
                    enrollmentNumber: record.student.enrollmentNumber,
                    status: record.status,
                    scannedAt: record.scannedAt ? record.scannedAt.toISOString() : null,
                });
            }
        }
        return reportData;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map