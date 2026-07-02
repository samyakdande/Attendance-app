import { Controller, Get, UseGuards, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles('admin')
  getDashboardStats(@CurrentUser() user: any) {
    return this.adminService.getDashboardStats(user.institutionId);
  }

  @Get('qr/export')
  @Roles('admin')
  async exportQrPdf(
    @CurrentUser() user: any,
    @Query('classId') classId?: string,
    @Query('section') section?: string,
    @Query('studentIds') studentIds?: string
  ) {
    try {
      const selectedIds = studentIds ? studentIds.split(',') : undefined;
      const url = await this.adminService.generateQrExportPdf(user.institutionId, {
        classId,
        section,
        selectedStudentIds: selectedIds
      });
      return { url };
    } catch (err) {
      throw new HttpException('Failed to generate PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
