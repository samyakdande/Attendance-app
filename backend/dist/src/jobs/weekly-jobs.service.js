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
var WeeklyJobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyJobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let WeeklyJobsService = WeeklyJobsService_1 = class WeeklyJobsService {
    prisma;
    logger = new common_1.Logger(WeeklyJobsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async archiveOldAuditLogs() {
        this.logger.log('Starting audit log archival (Weekly Job)...');
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        try {
            const result = await this.prisma.auditLog.deleteMany({
                where: {
                    createdAt: {
                        lt: ninetyDaysAgo
                    }
                }
            });
            this.logger.log(`Archived/Deleted ${result.count} audit logs older than 90 days.`);
        }
        catch (error) {
            this.logger.error('Failed to archive audit logs', error);
        }
    }
};
exports.WeeklyJobsService = WeeklyJobsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_WEEK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeeklyJobsService.prototype, "archiveOldAuditLogs", null);
exports.WeeklyJobsService = WeeklyJobsService = WeeklyJobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WeeklyJobsService);
//# sourceMappingURL=weekly-jobs.service.js.map