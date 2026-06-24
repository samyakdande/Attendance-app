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
        academicYear: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    findAll(user: any): Promise<({
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateClassDto: {
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
    remove(user: any, id: string): Promise<{
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
    addStudentsToClass(user: any, id: string, body: {
        studentIds: string[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeStudentFromClass(user: any, id: string, studentId: string): Promise<{
        createdAt: Date;
        classId: string;
        studentId: string;
    }>;
}
