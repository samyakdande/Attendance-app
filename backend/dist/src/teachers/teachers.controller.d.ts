import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    create(user: any, createTeacherDto: {
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
    findAll(user: any, page?: number, limit?: number, search?: string, department?: string, status?: string): Promise<import("../common/interfaces/pagination.interface").PaginatedResult<any>>;
    getDashboardStats(user: any): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateTeacherDto: {
        firstName?: string;
        lastName?: string;
        department?: string;
        status?: string;
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
    assignClass(user: any, id: string, body: {
        classId: string;
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
    removeClass(user: any, id: string, classId: string): Promise<{
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
        department: string | null;
    }>;
}
