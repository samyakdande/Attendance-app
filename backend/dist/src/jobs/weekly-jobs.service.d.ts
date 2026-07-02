import { PrismaService } from '../prisma/prisma.service';
export declare class WeeklyJobsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    archiveOldAuditLogs(): Promise<void>;
}
