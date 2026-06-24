import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(institutionId: string, userId: string, search?: string) {
    const whereClause: any = { institutionId, userId };
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(institutionId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { institutionId, userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(data: {
    institutionId: string;
    userId: string;
    title: string;
    message: string;
    type: string; // e.g. 'attendance_correction_approved'
    entityId?: string;
    entityType?: string;
  }) {
    return this.prisma.notification.create({
      data,
    });
  }
}
