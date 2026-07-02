import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService, MetricName } from '../metrics/metrics.service';

@Injectable()
export class DailyJobsService {
  private readonly logger = new Logger(DailyJobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  // Run at midnight every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailySummaries() {
    this.logger.log('Starting daily summary generation (Daily Job)...');
    
    try {
      const institutions = await this.prisma.institution.findMany({
        select: { id: true }
      });

      for (const inst of institutions) {
        // Here we would run heavy aggregate queries and save to a daily snapshot table
        // For now, we just record a metric that this ran
        this.logger.debug(`Aggregating metrics for institution: ${inst.id}`);
        // this.metrics.incrementMetric(inst.id, MetricName.TOTAL_SCANS, 0); // Refresh cache
      }

      this.logger.log('Daily summaries completed successfully.');
    } catch (error) {
      this.logger.error('Failed to generate daily summaries', error);
    }
  }
}
