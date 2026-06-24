import { PrismaService } from '../prisma/prisma.service';
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
    findAll(institutionId: string): Promise<({
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
    findOne(institutionId: string, id: string): Promise<{
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
    update(institutionId: string, id: string, data: {
        firstName?: string;
        lastName?: string;
        department?: string;
        status?: string;
        phone?: string;
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
    assignClass(institutionId: string, id: string, classId: string): Promise<{
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
    removeClass(institutionId: string, id: string, classId: string): Promise<{
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
        department: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profileId: string;
    }>;
}
