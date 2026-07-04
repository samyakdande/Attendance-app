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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let HealthController = class HealthController {
    prisma;
    redis;
    version = '1.0.0';
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    formatResponse(service, status) {
        return {
            status,
            service,
            timestamp: new Date().toISOString(),
            version: this.version
        };
    }
    async checkAll() {
        const dbHealth = await this.checkDatabaseStatus();
        const redisHealth = await this.checkRedisStatus();
        let overallStatus = 'healthy';
        if (dbHealth === 'down') {
            overallStatus = 'down';
            throw new common_1.HttpException({
                status: overallStatus,
                timestamp: new Date().toISOString(),
                version: this.version,
                services: { database: dbHealth, redis: redisHealth }
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        else if (redisHealth !== 'healthy') {
            overallStatus = 'degraded';
        }
        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            version: this.version,
            services: { database: dbHealth, redis: redisHealth }
        };
    }
    async checkDatabase() {
        const status = await this.checkDatabaseStatus();
        if (status === 'down') {
            throw new common_1.HttpException(this.formatResponse('database', status), common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        return this.formatResponse('database', status);
    }
    async checkRedis() {
        const status = await this.checkRedisStatus();
        if (status === 'down') {
            throw new common_1.HttpException(this.formatResponse('redis', status), common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        return this.formatResponse('redis', status);
    }
    async checkSupabase() {
        const status = await this.checkDatabaseStatus();
        if (status === 'down') {
            throw new common_1.HttpException(this.formatResponse('supabase', status), common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        return this.formatResponse('supabase', status);
    }
    getVersion() {
        return {
            version: this.version,
            environment: process.env.NODE_ENV || 'development',
            status: 'healthy'
        };
    }
    async checkDatabaseStatus() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return 'healthy';
        }
        catch (error) {
            console.error("PRISMA CONNECTION ERROR DETAILS:", error);
            return 'down';
        }
    }
    async checkRedisStatus() {
        try {
            const result = await this.redis.ping();
            if (result === 'PONG') {
                return 'healthy';
            }
            return 'degraded';
        }
        catch (error) {
            return 'degraded';
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkAll", null);
__decorate([
    (0, common_1.Get)('database'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkDatabase", null);
__decorate([
    (0, common_1.Get)('redis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkRedis", null);
__decorate([
    (0, common_1.Get)('supabase'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkSupabase", null);
__decorate([
    (0, common_1.Get)('version'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getVersion", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('api/v1/health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], HealthController);
//# sourceMappingURL=health.controller.js.map