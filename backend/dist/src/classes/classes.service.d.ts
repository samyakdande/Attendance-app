import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, PaginatedResult } from '../common/interfaces/pagination.interface';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(institutionId: string, data: {
        name: string;
        academicYear: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        academicYear: string;
        teacherId: string | null;
    }>;
    findAll(institutionId: string, user?: any, params?: PaginationParams & {
        academicYear?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(institutionId: string, id: string, user?: any): Promise<{
        teacher: ({
            profile: {
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
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            profileId: string;
            department: string | null;
        }) | null;
        students: ({
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
        } & {
            createdAt: Date;
            classId: string;
            studentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        academicYear: string;
        teacherId: string | null;
    }>;
    update(institutionId: string, id: string, data: {
        name?: string;
        academicYear?: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        academicYear: string;
        teacherId: string | null;
    }>;
    remove(institutionId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        academicYear: string;
        teacherId: string | null;
    }>;
    addStudentsToClass(institutionId: string, classId: string, studentIds: string[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeStudentFromClass(institutionId: string, classId: string, studentId: string): Promise<{
        createdAt: Date;
        classId: string;
        studentId: string;
    }>;
}
