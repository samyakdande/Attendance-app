import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(institutionId: string): Promise<{
        liveStats: {
            teachers: number;
            students: number;
            classes: number;
            pendingCorrections: number;
        };
        todayMetrics: {
            sessions: number;
            scans: number;
            offlineSyncs: number;
        };
    }>;
}
