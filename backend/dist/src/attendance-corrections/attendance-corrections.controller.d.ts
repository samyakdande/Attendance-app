import { AttendanceCorrectionsService } from './attendance-corrections.service';
export declare class AttendanceCorrectionsController {
    private readonly correctionsService;
    constructor(correctionsService: AttendanceCorrectionsService);
    requestCorrection(user: any, body: {
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
    getInbox(user: any): Promise<({
        attendanceRecord: {
            student: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                firstName: string;
                lastName: string;
                email: string | null;
                phone: string | null;
                institutionId: string;
                enrollmentNumber: string;
                qrIdentifier: string;
                qrStatus: string;
                qrVersion: number;
                lastQrGeneratedAt: Date | null;
            };
            session: {
                class: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    academicYear: string;
                    institutionId: string;
                    academicYearId: string | null;
                    teacherId: string | null;
                };
            } & {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                academicYearId: string | null;
                teacherId: string;
                classId: string;
                startTime: Date;
                endTime: Date | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            scannedAt: Date | null;
            sessionId: string;
            studentId: string;
        };
        requestedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
        approvedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
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
    resolveCorrection(user: any, id: string, body: {
        status: 'approved' | 'rejected' | 'expired';
        adminNote?: string;
    }): Promise<{
        requestedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
        approvedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
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
