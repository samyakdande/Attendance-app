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
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
    } & {
        id: string;
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    }>;
    findAll(user: any): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
        classes: ({
            _count: {
                students: number;
            };
        } & {
            academicYear: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            name: string;
            academicYearId: string | null;
            teacherId: string | null;
        })[];
    } & {
        id: string;
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    })[]>;
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
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
        classes: ({
            _count: {
                students: number;
            };
        } & {
            academicYear: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            name: string;
            academicYearId: string | null;
            teacherId: string | null;
        })[];
        sessions: ({
            class: {
                academicYear: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
                name: string;
                academicYearId: string | null;
                teacherId: string | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            academicYearId: string | null;
            teacherId: string;
            startTime: Date;
            classId: string;
            endTime: Date | null;
        })[];
    } & {
        id: string;
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    }>;
    update(user: any, id: string, updateTeacherDto: {
        firstName?: string;
        lastName?: string;
        department?: string;
        status?: string;
    }): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
    } & {
        id: string;
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    }>;
    assignClass(user: any, id: string, body: {
        classId: string;
    }): Promise<{
        academicYear: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    removeClass(user: any, id: string, classId: string): Promise<{
        academicYear: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        institutionId: string;
        name: string;
        academicYearId: string | null;
        teacherId: string | null;
    }>;
    remove(user: any, id: string): Promise<{
        id: string;
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    }>;
}
