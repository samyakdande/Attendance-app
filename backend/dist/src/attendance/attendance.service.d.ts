import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MetricsService } from '../metrics/metrics.service';
export declare class AttendanceService {
    private prisma;
    private redis;
    private auditLogs;
    private notifications;
    private metrics;
    constructor(prisma: PrismaService, redis: RedisService, auditLogs: AuditLogsService, notifications: NotificationsService, metrics: MetricsService);
    startSession(institutionId: string, profileId: string, classId: string): Promise<{
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
    }>;
    scanQr(institutionId: string, sessionId: string, qrIdentifier: string): Promise<{
        success: boolean;
        student: {
            id: string;
            firstName: string;
            lastName: string;
            enrollmentNumber: string;
        };
        sessionStats: {
            present: number;
            absent: number;
            pending: number;
            percentage: number;
        };
    }>;
    getSessionReport(institutionId: string, sessionId: string): Promise<{
        totalScanned: number;
        session_id: string;
        present_students: {
            rollNumber: string;
            status: string;
            scannedAt: string;
        }[];
    }>;
    getAllScans(): Promise<{
        totalScanned: number;
        present_students: {
            session_id: string;
            rollNumber: string;
            status: string;
            scannedAt: string;
        }[];
    }>;
    closeSession(institutionId: string, sessionId: string): Promise<{
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
    }>;
    private calculateAbsentees;
}
