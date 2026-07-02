import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/teachers')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles('admin')
  create(
    @CurrentUser() user: any,
    @Body() createTeacherDto: { profileId: string; firstName: string; lastName: string; email: string; department?: string }
  ) {
    return this.teachersService.create(user.institutionId, createTeacherDto);
  }

  @Get()
  @Roles('admin')
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('status') status?: string
  ) {
    return this.teachersService.findAll(user.institutionId, { page, limit, search, department, status });
  }

  @Get('dashboard-stats')
  @Roles('teacher')
  getDashboardStats(@CurrentUser() user: any) {
    // user.id is the profileId from Supabase JWT
    return this.teachersService.getDashboardStats(user.institutionId, user.id);
  }

  @Get(':id')
  @Roles('admin', 'teacher') // Teachers might need to view other teachers or themselves
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.teachersService.findOne(user.institutionId, id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTeacherDto: { firstName?: string; lastName?: string; department?: string; status?: string }
  ) {
    return this.teachersService.update(user.institutionId, id, updateTeacherDto);
  }

  @Post(':id/classes')
  @Roles('admin')
  assignClass(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { classId: string }
  ) {
    return this.teachersService.assignClass(user.institutionId, id, body.classId);
  }

  @Delete(':id/classes/:classId')
  @Roles('admin')
  removeClass(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('classId') classId: string
  ) {
    return this.teachersService.removeClass(user.institutionId, id, classId);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.teachersService.remove(user.institutionId, id);
  }
}
