import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(user: any): Promise<{
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
