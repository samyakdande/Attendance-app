import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(user: any, entityType?: string, action?: string, days?: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        institutionId: string;
        entityId: string;
        entityType: string;
        actorId: string;
        action: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
