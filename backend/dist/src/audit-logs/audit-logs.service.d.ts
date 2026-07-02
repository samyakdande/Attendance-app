import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, PaginatedResult } from '../common/interfaces/pagination.interface';
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(institutionId: string, filters?: PaginationParams & {
        entityType?: string;
        action?: string;
        days?: number;
        search?: string;
    }): Promise<PaginatedResult<any>>;
    createLog(data: {
        institutionId: string;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        institutionId: string;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
