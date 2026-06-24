import { Controller, Post, Body, Param, Put, Get, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/attendance')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  @Roles('admin', 'teacher')
  startSession(
    @CurrentUser() user: any,
    @Body() body: { classId: string }
  ) {
    return this.attendanceService.startSession(user.institutionId, user.id, body.classId);
  }

  @Post('sessions/:id/scan')
  @Roles('admin', 'teacher')
  scanQr(
    @CurrentUser() user: any,
    @Param('id') sessionId: string,
    @Body() body: { qrIdentifier: string }
  ) {
    return this.attendanceService.scanQr(user.institutionId, sessionId, body.qrIdentifier);
  }

  @Get('report/all')
  getAllScans() {
    return this.attendanceService.getAllScans();
  }

  @Get('sessions/:id/report')
  getSessionReport(
    @Param('id') sessionId: string,
    @Query('institutionId') institutionId: string = 'b7fb51be-b661-49a3-b10c-52c3a618aab6' // default to demo school
  ) {
    return this.attendanceService.getSessionReport(institutionId, sessionId);
  }

  @Put('sessions/:id/close')
  @Roles('admin', 'teacher')
  closeSession(
    @CurrentUser() user: any,
    @Param('id') sessionId: string
  ) {
    return this.attendanceService.closeSession(user.institutionId, sessionId);
  }
}
