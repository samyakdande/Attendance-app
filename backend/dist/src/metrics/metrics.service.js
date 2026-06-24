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
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = exports.MetricName = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var MetricName;
(function (MetricName) {
    MetricName["TOTAL_SESSIONS"] = "total_sessions";
    MetricName["TOTAL_SCANS"] = "total_scans";
    MetricName["OFFLINE_SYNCS"] = "offline_syncs";
    MetricName["CORRECTIONS_SUBMITTED"] = "corrections_submitted";
    MetricName["CORRECTIONS_APPROVED"] = "corrections_approved";
    MetricName["ACTIVE_TEACHERS"] = "active_teachers";
    MetricName["ACTIVE_CLASSES"] = "active_classes";
})(MetricName || (exports.MetricName = MetricName = {}));
let MetricsService = MetricsService_1 = class MetricsService {
    prisma;
    logger = new common_1.Logger(MetricsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async incrementMetric(institutionId, metricName, incrementBy = 1) {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            await this.prisma.systemMetric.upsert({
                where: {
                    institutionId_date_metricName: {
                        institutionId,
                        date: today,
                        metricName
                    }
                },
                update: {
                    metricValue: { increment: incrementBy }
                },
                create: {
                    institutionId,
                    date: today,
                    metricName,
                    metricValue: incrementBy
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to record metric ${metricName} for institution ${institutionId}`, error);
        }
    }
    async getMetricsToday(institutionId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const metrics = await this.prisma.systemMetric.findMany({
            where: {
                institutionId,
                date: today
            }
        });
        const result = {};
        Object.values(MetricName).forEach(name => {
            result[name] = 0;
        });
        metrics.forEach(m => {
            result[m.metricName] = m.metricValue;
        });
        return result;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map