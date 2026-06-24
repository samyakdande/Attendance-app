import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/students')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin')
  create(
    @CurrentUser() user: any,
    @Body() createStudentDto: { firstName: string; lastName: string; enrollmentNumber: string; classId?: string }
  ) {
    return this.studentsService.create(user.institutionId, createStudentDto);
  }

  @Get()
  @Roles('admin', 'teacher')
  findAll(@CurrentUser() user: any) {
    return this.studentsService.findAll(user.institutionId, user);
  }
  @Get('qr-export')
  @Roles('admin')
  exportQrData(@CurrentUser() user: any) {
    return this.studentsService.exportQrData(user.institutionId);
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studentsService.findOne(user.institutionId, id, user);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateStudentDto: { firstName?: string; lastName?: string; enrollmentNumber?: string; status?: string }
  ) {
    return this.studentsService.update(user.institutionId, id, updateStudentDto);
  }

  @Post(':id/qr')
  @Roles('admin')
  regenerateQr(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studentsService.regenerateQr(user.institutionId, id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studentsService.remove(user.institutionId, id);
  }
}
