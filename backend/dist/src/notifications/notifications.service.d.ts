import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForUser(institutionId: string, userId: string, search?: string): Promise<{
        id: string;
        institutionId: string;
        createdAt: Date;
        type: string;
        entityType: string | null;
        entityId: string | null;
        title: string;
        message: string;
        isRead: boolean;
        userId: string;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(institutionId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(data: {
        institutionId: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        entityId?: string;
        entityType?: string;
    }): Promise<{
        id: string;
        institutionId: string;
        createdAt: Date;
        type: string;
        entityType: string | null;
        entityId: string | null;
        title: string;
        message: string;
        isRead: boolean;
        userId: string;
    }>;
}
