import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(user: any, page?: number, limit?: number, entityType?: string, action?: string, days?: string, search?: string): Promise<import("../common/interfaces/pagination.interface").PaginatedResult<any>>;
}
