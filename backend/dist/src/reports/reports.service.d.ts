import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(institutionId: string, user?: any): Promise<{
        totalStudents: number;
        todaySessions: number;
        recentSessions: {
            id: string;
            className: string;
            date: Date;
            present: number;
        }[];
    }>;
    getClassStats(institutionId: string, classId: string): Promise<{
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
    getStudentReport(institutionId: string, studentId: string): Promise<{
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
    exportInstitutionReport(institutionId: string, startDate?: string, endDate?: string): Promise<{
        sessionDate: string;
        className: string;
        teacherName: string;
        studentName: string;
        enrollmentNumber: string;
        status: string;
        scannedAt: string | null;
    }[]>;
}
