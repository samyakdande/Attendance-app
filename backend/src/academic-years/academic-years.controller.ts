import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/academic-years')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Post()
  @Roles('admin')
  create(@CurrentUser() user: any, @Body() data: any) {
    return this.academicYearsService.create(user.institutionId, data);
  }

  @Get()
  @Roles('admin', 'teacher')
  findAll(@CurrentUser() user: any) {
    return this.academicYearsService.findAll(user.institutionId);
  }
}
