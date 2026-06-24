import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum MetricName {
  TOTAL_SESSIONS = 'total_sessions',
  TOTAL_SCANS = 'total_scans',
  OFFLINE_SYNCS = 'offline_syncs',
  CORRECTIONS_SUBMITTED = 'corrections_submitted',
  CORRECTIONS_APPROVED = 'corrections_approved',
  ACTIVE_TEACHERS = 'active_teachers',
  ACTIVE_CLASSES = 'active_classes'
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Increments a daily metric value. Creates it if it doesn't exist.
   */
  async incrementMetric(institutionId: string, metricName: MetricName, incrementBy: number = 1) {
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
    } catch (error) {
      this.logger.error(`Failed to record metric ${metricName} for institution ${institutionId}`, error);
    }
  }

  async getMetricsToday(institutionId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const metrics = await this.prisma.systemMetric.findMany({
      where: {
        institutionId,
        date: today
      }
    });

    const result: Record<string, number> = {};
    Object.values(MetricName).forEach(name => {
      result[name] = 0;
    });

    metrics.forEach(m => {
      result[m.metricName] = m.metricValue;
    });

    return result;
  }
}
