import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/v1/institutions')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createInstitutionDto: { name: string; type?: string; settings?: any }) {
    return this.institutionsService.create(createInstitutionDto);
  }

  @Get()
  @Roles('admin') // System Admins can view all institutions
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateInstitutionDto: { name?: string; type?: string; status?: string; settings?: any }) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}
