import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
