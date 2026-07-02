import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { RedisModule } from './redis/redis.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ReportsModule } from './reports/reports.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { ParentsModule } from './parents/parents.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SeedController } from './seed.controller';
import { AttendanceCorrectionsModule } from './attendance-corrections/attendance-corrections.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { StorageModule } from './storage/storage.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // Strict: max 100 requests per minute per IP
    }]),
    PrismaModule,
    AuthModule,
    InstitutionsModule,
    TeachersModule,
    StudentsModule,
    ClassesModule,
    RedisModule,
    AttendanceModule,
    ReportsModule,
    AcademicYearsModule,
    ParentsModule,
    AuditLogsModule,
    NotificationsModule,
    AttendanceCorrectionsModule,
    HealthModule,
    MetricsModule,
    AdminModule,
    JobsModule,
    StorageModule,
    MonitoringModule,
  ],
  controllers: [AppController, SeedController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
