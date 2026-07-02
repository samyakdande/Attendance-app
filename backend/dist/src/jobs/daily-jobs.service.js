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
var DailyJobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyJobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const metrics_service_1 = require("../metrics/metrics.service");
let DailyJobsService = DailyJobsService_1 = class DailyJobsService {
    prisma;
    metrics;
    logger = new common_1.Logger(DailyJobsService_1.name);
    constructor(prisma, metrics) {
        this.prisma = prisma;
        this.metrics = metrics;
    }
    async generateDailySummaries() {
        this.logger.log('Starting daily summary generation (Daily Job)...');
        try {
            const institutions = await this.prisma.institution.findMany({
                select: { id: true }
            });
            for (const inst of institutions) {
                this.logger.debug(`Aggregating metrics for institution: ${inst.id}`);
            }
            this.logger.log('Daily summaries completed successfully.');
        }
        catch (error) {
            this.logger.error('Failed to generate daily summaries', error);
        }
    }
};
exports.DailyJobsService = DailyJobsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyJobsService.prototype, "generateDailySummaries", null);
exports.DailyJobsService = DailyJobsService = DailyJobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        metrics_service_1.MetricsService])
], DailyJobsService);
//# sourceMappingURL=daily-jobs.service.js.map