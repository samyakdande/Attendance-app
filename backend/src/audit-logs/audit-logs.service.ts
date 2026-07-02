import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, getPaginationOptions, PaginatedResult } from '../common/interfaces/pagination.interface';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(institutionId: string, filters?: PaginationParams & { entityType?: string; action?: string; days?: number; search?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = getPaginationOptions(filters || {});
    
    const whereClause: any = { institutionId };

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

  async createLog(data: {
    institutionId: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
        metadata: data.metadata || {},
      },
    });
  }
}
