import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; type?: string; settings?: any }) {
    return this.prisma.institution.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.institution.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id, deletedAt: null },
    });
    if (!institution) {
      throw new NotFoundException(`Institution with ID ${id} not found`);
    }
    return institution;
  }

  async update(id: string, data: { name?: string; type?: string; status?: string; settings?: any }) {
    await this.findOne(id); // Ensure exists
    return this.prisma.institution.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Soft delete
    return this.prisma.institution.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
