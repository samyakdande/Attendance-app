import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(institutionId: string, data: { name: string; startDate: string; endDate: string }) {
    return this.prisma.academicYear.create({
      data: {
        institutionId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async findAll(institutionId: string) {
    return this.prisma.academicYear.findMany({
      where: { institutionId },
      orderBy: { startDate: 'desc' },
    });
  }
}
