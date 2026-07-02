import { PrismaService } from '../prisma/prisma.service';
export declare class FastJobsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleSessionCleanup(): Promise<void>;
    retryFailedNotifications(): Promise<void>;
}
