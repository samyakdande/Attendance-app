import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(institutionId: string, filters?: { entityType?: string; action?: string; days?: number; search?: string }) {
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

    // search could be against action or entityId, but since it's an audit log, maybe search action
    if (filters?.search) {
      whereClause.OR = [
        { action: { contains: filters.search, mode: 'insensitive' } },
        { entityType: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 200, // increased for better filtering
    });
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
