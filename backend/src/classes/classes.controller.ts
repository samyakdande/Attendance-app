import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/user.decorator';

@Controller('api/v1/classes')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles('admin')
  create(
    @CurrentUser() user: any,
    @Body() createClassDto: { name: string; academicYear: string; teacherId?: string }
  ) {
    return this.classesService.create(user.institutionId, createClassDto);
  }

  @Get()
  @Roles('admin', 'teacher')
  findAll(@CurrentUser() user: any) {
    return this.classesService.findAll(user.institutionId, user);
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.classesService.findOne(user.institutionId, id, user);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateClassDto: { name?: string; academicYear?: string; teacherId?: string }
  ) {
    return this.classesService.update(user.institutionId, id, updateClassDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.classesService.remove(user.institutionId, id);
  }

  @Post(':id/roster')
  @Roles('admin')
  addStudentsToClass(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { studentIds: string[] }
  ) {
    return this.classesService.addStudentsToClass(user.institutionId, id, body.studentIds);
  }

  @Delete(':id/roster/:studentId')
  @Roles('admin')
  removeStudentFromClass(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('studentId') studentId: string
  ) {
    return this.classesService.removeStudentFromClass(user.institutionId, id, studentId);
  }
}
