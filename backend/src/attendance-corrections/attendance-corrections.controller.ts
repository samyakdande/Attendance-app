import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AttendanceCorrectionsService } from './attendance-corrections.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/attendance-corrections')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AttendanceCorrectionsController {
  constructor(private readonly correctionsService: AttendanceCorrectionsService) {}

  @Post()
  @Roles('admin', 'teacher')
  requestCorrection(
    @CurrentUser() user: any,
    @Body() body: { attendanceRecordId: string; newStatus: string; reason: string }
  ) {
    return this.correctionsService.requestCorrection(user.institutionId, user.id, body);
  }

  @Get()
  @Roles('admin')
  getInbox(@CurrentUser() user: any) {
    return this.correctionsService.getInbox(user.institutionId);
  }

  @Patch(':id')
  @Roles('admin')
  resolveCorrection(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { status: 'approved' | 'rejected' | 'expired'; adminNote?: string }
  ) {
    return this.correctionsService.resolveCorrection(user.institutionId, user.id, id, body);
  }
}
