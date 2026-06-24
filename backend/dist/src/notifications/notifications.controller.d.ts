import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: any, search?: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        userId: string;
        title: string;
        message: string;
        entityId: string | null;
        entityType: string | null;
        isRead: boolean;
    }[]>;
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string, user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
