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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_interface_1 = require("../common/interfaces/pagination.interface");
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(institutionId, filters) {
        const { page, limit, skip } = (0, pagination_interface_1.getPaginationOptions)(filters || {});
        const whereClause = { institutionId };
        if (filters?.entityType) {
            whereClause.entityType = filters.entityType;
        }
        if (filters?.action) {
            whereClause.action = { contains: filters.action, mode: 'insensitive' };
        }
        if (filters?.days) {
            const date = new Date();
            date.setDate(date.getDate() - filters.days);
            whereClause.createdAt = { gte: date };
        }
        if (filters?.search) {
            whereClause.OR = [
                { action: { contains: filters.search, mode: 'insensitive' } },
                { entityType: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const [total, data] = await this.prisma.$transaction([
            this.prisma.auditLog.count({ where: whereClause }),
            this.prisma.auditLog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            })
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        };
    }
    async createLog(data) {
        return this.prisma.auditLog.create({
            data: {
                ...data,
                metadata: data.metadata || {},
            },
        });
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map