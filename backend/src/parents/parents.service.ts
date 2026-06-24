import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(institutionId: string) {
    return this.prisma.parent.findMany({
      where: { institutionId },
      include: { profile: true, students: { include: { student: true } } },
    });
  }
}
