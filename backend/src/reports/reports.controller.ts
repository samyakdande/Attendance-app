import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/reports')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles('admin', 'teacher')
  getDashboard(@CurrentUser() user: any) {
    return this.reportsService.getDashboard(user.institutionId, user);
  }

  @Get('class/:classId')
  @Roles('admin', 'teacher')
  getClassStats(@CurrentUser() user: any, @Param('classId') classId: string) {
    return this.reportsService.getClassStats(user.institutionId, classId);
  }

  @Get('student/:studentId')
  @Roles('admin', 'teacher')
  getStudentReport(@CurrentUser() user: any, @Param('studentId') studentId: string) {
    return this.reportsService.getStudentReport(user.institutionId, studentId);
  }

  @Get('export')
  @Roles('admin')
  exportInstitutionReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.reportsService.exportInstitutionReport(user.institutionId, startDate, endDate);
  }
}
