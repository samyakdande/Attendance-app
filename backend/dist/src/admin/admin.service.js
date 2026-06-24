"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(institutionId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const [activeTeachers, activeStudents, activeClasses, pendingCorrections] = await Promise.all([
            this.prisma.teacher.count({ where: { profile: { institutionId }, status: 'active' } }),
            this.prisma.student.count({ where: { institutionId, status: 'active' } }),
            this.prisma.class.count({ where: { institutionId } }),
            this.prisma.attendanceCorrection.count({
                where: {
                    attendanceRecord: { session: { institutionId } },
                    status: 'pending'
                }
            })
        ]);
        const metricsToday = await this.prisma.systemMetric.findMany({
            where: {
                institutionId,
                date: today
            }
        });
        const getMetric = (name) => {
            const metric = metricsToday.find(m => m.metricName === name);
            return metric ? metric.metricValue : 0;
        };
        return {
            liveStats: {
                teachers: activeTeachers,
                students: activeStudents,
                classes: activeClasses,
                pendingCorrections
            },
            todayMetrics: {
                sessions: getMetric('total_sessions'),
                scans: getMetric('total_scans'),
                offlineSyncs: getMetric('offline_syncs')
            }
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map