import { Module } from '@nestjs/common';
import { FastJobsService } from './fast-jobs.service';
import { DailyJobsService } from './daily-jobs.service';
import { WeeklyJobsService } from './weekly-jobs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [PrismaModule, RedisModule, MetricsModule],
  providers: [FastJobsService, DailyJobsService, WeeklyJobsService],
})
export class JobsModule {}
