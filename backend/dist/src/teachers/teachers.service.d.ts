import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, PaginatedResult } from '../common/interfaces/pagination.interface';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(institutionId: string, data: {
        profileId: string;
        firstName: string;
        lastName: string;
        email: string;
        department?: string;
    }): Promise<{
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
    }>;
    findAll(institutionId: string, params?: PaginationParams & {
        department?: string;
        status?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(institutionId: string, id: string): Promise<{
        classes: ({
            _count: {
                students: number;
            };
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
        })[];
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
        sessions: ({
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                name: string;
                academicYearId: string | null;
                academicYear: string;
                teacherId: string | null;
            };
        } & {
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
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
        department: string | null;
    }>;
    update(institutionId: string, id: string, data: {
        firstName?: string;
        lastName?: string;
        department?: string;
        status?: string;
        phone?: string;
    }): Promise<{
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
    }>;
    assignClass(institutionId: string, id: string, classId: string): Promise<{
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
    removeClass(institutionId: string, id: string, classId: string): Promise<{
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
    getDashboardStats(institutionId: string, profileId: string): Promise<{
        teacher: {
            id: string;
            name: string;
        };
        stats: {
            classesToday: number;
            sessionsCompleted: number;
            attendanceToday: number;
        };
        classes: {
            id: string;
            name: string;
            time: string;
            status: string;
        }[];
        notifications: {
            id: string;
            title: string;
            details: string;
            time: Date;
            isRead: boolean;
        }[];
        unreadCount: number;
    }>;
    remove(institutionId: string, id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
        department: string | null;
    }>;
}
