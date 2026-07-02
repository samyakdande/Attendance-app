import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: any, search?: string): Promise<{
        id: string;
        createdAt: Date;
        institutionId: string;
        entityType: string | null;
        entityId: string | null;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        userId: string;
    }[]>;
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string, user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
