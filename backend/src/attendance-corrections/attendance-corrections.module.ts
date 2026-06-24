import { Module } from '@nestjs/common';
import { AttendanceCorrectionsService } from './attendance-corrections.service';
import { AttendanceCorrectionsController } from './attendance-corrections.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, AuditLogsModule, NotificationsModule],
  controllers: [AttendanceCorrectionsController],
  providers: [AttendanceCorrectionsService],
})
export class AttendanceCorrectionsModule {}
