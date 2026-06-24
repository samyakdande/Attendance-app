import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(institutionId: string, filters?: {
        entityType?: string;
        action?: string;
        days?: number;
        search?: string;
    }): Promise<{
        id: string;
        institutionId: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    createLog(data: {
        institutionId: string;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata?: any;
    }): Promise<{
        id: string;
        institutionId: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
