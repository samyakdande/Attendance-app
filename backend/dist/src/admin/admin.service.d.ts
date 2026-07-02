import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class AdminService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
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
    generateQrExportPdf(institutionId: string, options: {
        classId?: string;
        section?: string;
        selectedStudentIds?: string[];
    }): Promise<string>;
}
