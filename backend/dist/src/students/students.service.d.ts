import { PrismaService } from '../prisma/prisma.service';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(institutionId: string, data: {
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
    findAll(institutionId: string, user?: any): Promise<{
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
    findOne(institutionId: string, id: string, user?: any): Promise<{
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
    update(institutionId: string, id: string, data: {
        firstName?: string;
        lastName?: string;
        enrollmentNumber?: string;
        email?: string;
        phone?: string;
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
    remove(institutionId: string, id: string): Promise<{
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
    exportQrData(institutionId: string, classId?: string): Promise<{
        qrPayload: string;
        id: string;
        firstName: string;
        lastName: string;
        enrollmentNumber: string;
        qrIdentifier: string;
    }[]>;
    regenerateQr(institutionId: string, id: string): Promise<{
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
