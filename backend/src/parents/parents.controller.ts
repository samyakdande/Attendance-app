import { Controller, Get, UseGuards } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/parents')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  @Roles('admin', 'teacher')
  findAll(@CurrentUser() user: any) {
    return this.parentsService.findAll(user.institutionId);
  }
}
