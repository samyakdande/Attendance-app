import { Controller, Get, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/notifications')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('admin', 'teacher')
  findAll(@CurrentUser() user: any, @Query('search') search?: string) {
    return this.notificationsService.findAllForUser(user.institutionId, user.sub, search); // sub is the Supabase User ID
  }

  @Patch('read-all')
  @Roles('admin', 'teacher')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.institutionId, user.sub);
  }

  @Patch(':id/read')
  @Roles('admin', 'teacher')
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.sub);
  }
}
