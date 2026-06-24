import { PrismaService } from '../prisma/prisma.service';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(institutionId: string, data: {
        name: string;
        academicYear: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    findAll(institutionId: string, user?: any): Promise<({
        teacher: ({
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                role: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            profileId: string;
            department: string | null;
            status: string;
        }) | null;
        _count: {
            students: number;
        };
    } & {
        id: string;
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    })[]>;
    findOne(institutionId: string, id: string, user?: any): Promise<{
        teacher: ({
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                role: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            profileId: string;
            department: string | null;
            status: string;
        }) | null;
        students: ({
            student: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                status: string;
                firstName: string;
                lastName: string;
                email: string | null;
                phone: string | null;
                enrollmentNumber: string;
                qrIdentifier: string;
                qrStatus: string;
                qrVersion: number;
                lastQrGeneratedAt: Date | null;
            };
        } & {
            createdAt: Date;
            classId: string;
            studentId: string;
        })[];
    } & {
        id: string;
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    update(institutionId: string, id: string, data: {
        name?: string;
        academicYear?: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    remove(institutionId: string, id: string): Promise<{
        id: string;
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    addStudentsToClass(institutionId: string, classId: string, studentIds: string[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeStudentFromClass(institutionId: string, classId: string, studentId: string): Promise<{
        createdAt: Date;
        classId: string;
        studentId: string;
    }>;
}
