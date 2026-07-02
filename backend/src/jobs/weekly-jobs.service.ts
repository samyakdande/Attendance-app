import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WeeklyJobsService {
  private readonly logger = new Logger(WeeklyJobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run at midnight every Sunday
  @Cron(CronExpression.EVERY_WEEK)
  async archiveOldAuditLogs() {
    this.logger.log('Starting audit log archival (Weekly Job)...');
    
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    try {
      // In a real production environment, you would export these to Supabase Storage/S3 first
      // before deleting them. For now, we'll just soft-delete or prune.
      const result = await this.prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: ninetyDaysAgo
          }
        }
      });

      this.logger.log(`Archived/Deleted ${result.count} audit logs older than 90 days.`);
    } catch (error) {
      this.logger.error('Failed to archive audit logs', error);
    }
  }

}
