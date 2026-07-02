import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AttendanceCorrectionsService {
    private prisma;
    private audit;
    private notifications;
    constructor(prisma: PrismaService, audit: AuditLogsService, notifications: NotificationsService);
    requestCorrection(institutionId: string, requestedById: string, data: {
        attendanceRecordId: string;
        newStatus: string;
        reason: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
    }>;
    getInbox(institutionId: string): Promise<({
        attendanceRecord: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                enrollmentNumber: string;
                email: string | null;
                phone: string | null;
                qrIdentifier: string;
                status: string;
                qrStatus: string;
                qrVersion: number;
                lastQrGeneratedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
            };
            session: {
                class: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    institutionId: string;
                    name: string;
                    academicYearId: string | null;
                    academicYear: string;
                    teacherId: string | null;
                };
            } & {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                classId: string;
                academicYearId: string | null;
                teacherId: string;
                startTime: Date;
                endTime: Date | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            scannedAt: Date | null;
            studentId: string;
            sessionId: string;
        };
        requestedBy: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            role: string;
        };
        approvedBy: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            role: string;
        } | null;
    } & {
        id: string;
        status: string;
        createdAt: Date;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
    })[]>;
    resolveCorrection(institutionId: string, approvedById: string, id: string, data: {
        status: 'approved' | 'rejected' | 'expired';
        adminNote?: string;
    }): Promise<{
        requestedBy: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            role: string;
        };
        approvedBy: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            role: string;
        } | null;
    } & {
        id: string;
        status: string;
        createdAt: Date;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
    }>;
}
