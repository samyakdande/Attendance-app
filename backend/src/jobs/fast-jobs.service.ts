import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FastJobsService {
  private readonly logger = new Logger(FastJobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every 5 minutes
  @Cron('*/5 * * * *')
  async handleSessionCleanup() {
    this.logger.debug('Running session cleanup job (Fast Job)...');
    
    // Close sessions older than 12 hours that are still 'active'
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
    } catch (error) {
      this.logger.error('Failed to cleanup sessions', error);
    }
  }

  // Run every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async retryFailedNotifications() {
    // Stub for retrying failed notifications
    this.logger.verbose('Checking for failed notifications to retry...');
  }
}
