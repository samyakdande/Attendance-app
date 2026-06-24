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
exports.AttendanceCorrectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AttendanceCorrectionsService = class AttendanceCorrectionsService {
    prisma;
    audit;
    notifications;
    constructor(prisma, audit, notifications) {
        this.prisma = prisma;
        this.audit = audit;
        this.notifications = notifications;
    }
    async requestCorrection(institutionId, requestedById, data) {
        const record = await this.prisma.attendanceRecord.findUnique({
            where: { id: data.attendanceRecordId },
            include: { student: true, session: { include: { class: true } } }
        });
        if (!record)
            throw new common_1.NotFoundException('Attendance record not found');
        const correction = await this.prisma.attendanceCorrection.create({
            data: {
                attendanceRecordId: record.id,
                requestedById,
                oldStatus: record.status,
                newStatus: data.newStatus,
                reason: data.reason,
                status: 'pending'
            }
        });
        await this.audit.createLog({
            institutionId,
            actorId: requestedById,
            action: 'REQUESTED_ATTENDANCE_CORRECTION',
            entityType: 'AttendanceCorrection',
            entityId: correction.id,
            metadata: { oldStatus: record.status, newStatus: data.newStatus, reason: data.reason }
        });
        const admin = await this.prisma.profile.findFirst({
            where: { institutionId, role: 'admin' }
        });
        if (admin) {
            await this.notifications.createNotification({
                institutionId,
                userId: admin.id,
                title: 'New Attendance Correction Request',
                message: `Teacher requested to change ${record.student.firstName} ${record.student.lastName}'s attendance from ${record.status} to ${data.newStatus}.`,
                type: 'correction_request_pending',
                entityId: correction.id,
                entityType: 'attendance_correction'
            });
        }
        return correction;
    }
    async getInbox(institutionId) {
        return this.prisma.attendanceCorrection.findMany({
            where: {
                attendanceRecord: { session: { institutionId } }
            },
            include: {
                requestedBy: true,
                approvedBy: true,
                attendanceRecord: {
                    include: { student: true, session: { include: { class: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async resolveCorrection(institutionId, approvedById, id, data) {
        const correction = await this.prisma.attendanceCorrection.findUnique({
            where: { id },
            include: { attendanceRecord: { include: { student: true } } }
        });
        if (!correction)
            throw new common_1.NotFoundException('Correction not found');
        if (correction.status !== 'pending')
            throw new common_1.BadRequestException('Correction is already resolved');
        return this.prisma.$transaction(async (tx) => {
            const updatedCorrection = await tx.attendanceCorrection.update({
                where: { id },
                data: {
                    status: data.status,
                    adminNote: data.adminNote,
                    approvedById,
                    resolvedAt: new Date()
                },
                include: { requestedBy: true, approvedBy: true }
            });
            if (data.status === 'approved') {
                await tx.attendanceRecord.update({
                    where: { id: correction.attendanceRecordId },
                    data: { status: correction.newStatus }
                });
            }
            await this.audit.createLog({
                institutionId,
                actorId: approvedById,
                action: `RESOLVED_ATTENDANCE_CORRECTION_${data.status.toUpperCase()}`,
                entityType: 'AttendanceCorrection',
                entityId: id,
                metadata: { status: data.status, oldStatus: correction.oldStatus, newStatus: correction.newStatus }
            });
            await this.notifications.createNotification({
                institutionId,
                userId: correction.requestedById,
                title: `Correction Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
                message: `Your request to change ${correction.attendanceRecord.student.firstName}'s attendance to ${correction.newStatus} was ${data.status}.`,
                type: `correction_request_${data.status}`,
                entityId: id,
                entityType: 'attendance_correction'
            });
            return updatedCorrection;
        });
    }
};
exports.AttendanceCorrectionsService = AttendanceCorrectionsService;
exports.AttendanceCorrectionsService = AttendanceCorrectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService,
        notifications_service_1.NotificationsService])
], AttendanceCorrectionsService);
//# sourceMappingURL=attendance-corrections.service.js.map