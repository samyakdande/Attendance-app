import { PrismaService } from '../prisma/prisma.service';
export declare enum MetricName {
    TOTAL_SESSIONS = "total_sessions",
    TOTAL_SCANS = "total_scans",
    OFFLINE_SYNCS = "offline_syncs",
    CORRECTIONS_SUBMITTED = "corrections_submitted",
    CORRECTIONS_APPROVED = "corrections_approved",
    ACTIVE_TEACHERS = "active_teachers",
    ACTIVE_CLASSES = "active_classes"
}
export declare class MetricsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    incrementMetric(institutionId: string, metricName: MetricName, incrementBy?: number): Promise<void>;
    getMetricsToday(institutionId: string): Promise<Record<string, number>>;
}
