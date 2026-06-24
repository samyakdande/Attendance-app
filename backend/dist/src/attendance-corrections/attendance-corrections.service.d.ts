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
        createdAt: Date;
        status: string;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
    }>;
    getInbox(institutionId: string): Promise<({
        attendanceRecord: {
            student: {
                id: string;
                institutionId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
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
            };
            session: {
                class: {
                    id: string;
                    institutionId: string;
                    academicYearId: string | null;
                    academicYear: string;
                    name: string;
                    teacherId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                };
            } & {
                id: string;
                institutionId: string;
                academicYearId: string | null;
                teacherId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                classId: string;
                status: string;
                startTime: Date;
                endTime: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            status: string;
            scannedAt: Date | null;
            sessionId: string;
        };
        requestedBy: {
            id: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string;
        };
        approvedBy: {
            id: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: string;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
    })[]>;
    resolveCorrection(institutionId: string, approvedById: string, id: string, data: {
        status: 'approved' | 'rejected' | 'expired';
        adminNote?: string;
    }): Promise<{
        requestedBy: {
            id: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string;
        };
        approvedBy: {
            id: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: string;
        oldStatus: string;
        newStatus: string;
        reason: string;
        adminNote: string | null;
        resolvedAt: Date | null;
        attendanceRecordId: string;
        requestedById: string;
        approvedById: string | null;
    }>;
}
