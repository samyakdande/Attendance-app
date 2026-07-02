import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    startSession(user: any, body: {
        classId: string;
    }): Promise<{
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
    scanQr(user: any, sessionId: string, body: {
        qrIdentifier: string;
    }): Promise<{
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
    getAllScans(): Promise<{
        totalScanned: number;
        present_students: {
            session_id: string;
            rollNumber: string;
            status: string;
            scannedAt: string;
        }[];
    }>;
    getSessionReport(sessionId: string, institutionId?: string): Promise<{
        totalScanned: number;
        session_id: string;
        present_students: {
            rollNumber: string;
            status: string;
            scannedAt: string;
        }[];
    }>;
    closeSession(user: any, sessionId: string): Promise<{
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
}
