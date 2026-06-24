import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(user: any): Promise<{
        totalStudents: number;
        todaySessions: number;
        recentSessions: {
            id: string;
            className: string;
            date: Date;
            present: number;
        }[];
    }>;
    getClassStats(user: any, classId: string): Promise<{
        classId: string;
        className: string;
        totalStudents: number;
        recentSessions: {
            sessionId: string;
            date: Date;
            presentCount: number;
            totalStudents: number;
            attendancePercentage: number;
        }[];
    }>;
    getStudentReport(user: any, studentId: string): Promise<{
        studentId: string;
        name: string;
        enrollmentNumber: string;
        overallAttendance: number;
        history: {
            date: any;
            status: any;
            className: any;
        }[];
    }>;
    exportInstitutionReport(user: any, startDate?: string, endDate?: string): Promise<{
        sessionDate: string;
        className: string;
        teacherName: string;
        studentName: string;
        enrollmentNumber: string;
        status: string;
        scannedAt: string | null;
    }[]>;
}
