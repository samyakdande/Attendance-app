import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(user: any, createStudentDto: {
        firstName: string;
        lastName: string;
        enrollmentNumber: string;
        classId?: string;
    }): Promise<{
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
    }>;
    findAll(user: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        enrollmentNumber: string;
        status: string;
        qrStatus: string;
        qrVersion: number;
        lastQrGeneratedAt: Date | null;
        scanCount: number;
        lastScannedAt: Date;
        className: string;
        attendancePercentage: number;
        qrIdentifier: string;
    }[]>;
    exportQrData(user: any): Promise<{
        qrPayload: string;
        id: string;
        firstName: string;
        lastName: string;
        enrollmentNumber: string;
        qrIdentifier: string;
    }[]>;
    findOne(user: any, id: string): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            enrollmentNumber: string;
            email: string | null;
            phone: string | null;
            status: string;
            qrStatus: string;
            qrVersion: number;
            className: string;
        };
        attendanceStats: {
            present: number;
            absent: number;
            percentage: number;
        };
        parents: {
            id: string;
            relation: string;
            name: string;
            email: string;
            phone: string;
        }[];
        timeline: {
            id: string;
            type: string;
            title: string;
            description: string;
            timestamp: Date;
            color: string;
        }[];
    }>;
    update(user: any, id: string, updateStudentDto: {
        firstName?: string;
        lastName?: string;
        enrollmentNumber?: string;
        status?: string;
    }): Promise<{
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
    }>;
    regenerateQr(user: any, id: string): Promise<{
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
    }>;
    remove(user: any, id: string): Promise<{
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
    }>;
}
