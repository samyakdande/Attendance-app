import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(user: any, createClassDto: {
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
    findAll(user: any, page?: number, limit?: number, search?: string, academicYear?: string): Promise<import("../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateClassDto: {
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
    remove(user: any, id: string): Promise<{
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
    addStudentsToClass(user: any, id: string, body: {
        studentIds: string[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeStudentFromClass(user: any, id: string, studentId: string): Promise<{
        createdAt: Date;
        classId: string;
        studentId: string;
    }>;
}
