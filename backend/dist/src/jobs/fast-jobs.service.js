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
var FastJobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastJobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let FastJobsService = FastJobsService_1 = class FastJobsService {
    prisma;
    logger = new common_1.Logger(FastJobsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleSessionCleanup() {
        this.logger.debug('Running session cleanup job (Fast Job)...');
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
        try {
            const result = await this.prisma.attendanceSession.updateMany({
                where: {
                    status: 'active',
                    createdAt: {
                        lt: twelveHoursAgo
                    }
                },
                data: {
                    status: 'completed'
                }
            });
            if (result.count > 0) {
                this.logger.log(`Closed ${result.count} expired attendance sessions.`);
            }
        }
        catch (error) {
            this.logger.error('Failed to cleanup sessions', error);
        }
    }
    async retryFailedNotifications() {
        this.logger.verbose('Checking for failed notifications to retry...');
    }
};
exports.FastJobsService = FastJobsService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FastJobsService.prototype, "handleSessionCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FastJobsService.prototype, "retryFailedNotifications", null);
exports.FastJobsService = FastJobsService = FastJobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FastJobsService);
//# sourceMappingURL=fast-jobs.service.js.map