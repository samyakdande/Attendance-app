import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
export declare class DailyJobsService {
    private readonly prisma;
    private readonly metrics;
    private readonly logger;
    constructor(prisma: PrismaService, metrics: MetricsService);
    generateDailySummaries(): Promise<void>;
}
