import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(institutionId: string, data: { name: string; academicYear: string; teacherId?: string }) {
    return this.prisma.class.create({
      data: {
        institutionId,
        name: data.name,
        academicYear: data.academicYear,
        teacherId: data.teacherId,
      },
    });
  }

  async findAll(institutionId: string, user?: any) {
    let whereClause: any = {
      institutionId,
      deletedAt: null,
    };

    if (user?.role === 'teacher') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { profileId: user.id }
      });
      if (!teacher) return []; // If no teacher profile exists, they have no classes
      whereClause.teacherId = teacher.id;
    }

    return this.prisma.class.findMany({
      where: whereClause,
      include: {
        teacher: {
          include: { profile: true },
        },
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async findOne(institutionId: string, id: string, user?: any) {
    let whereClause: any = {
      id,
      institutionId,
      deletedAt: null,
    };

    if (user?.role === 'teacher') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { profileId: user.id }
      });
      if (!teacher) throw new NotFoundException(`Class with ID ${id} not found or you don't have access.`);
      whereClause.teacherId = teacher.id;
    }

    const cls = await this.prisma.class.findFirst({
      where: whereClause,
      include: {
        teacher: {
          include: { profile: true },
        },
        students: {
          include: { student: true },
        },
      },
    });

    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return cls;
  }

  async update(institutionId: string, id: string, data: { name?: string; academicYear?: string; teacherId?: string }) {
    await this.findOne(institutionId, id); // Ensure exists and access is allowed

    return this.prisma.class.update({
      where: { id },
      data,
    });
  }

  async remove(institutionId: string, id: string) {
    await this.findOne(institutionId, id);

    // Soft delete
    return this.prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Phase 4: Roster Management
  async addStudentsToClass(institutionId: string, classId: string, studentIds: string[]) {
    await this.findOne(institutionId, classId); // Verify class exists

    // Create many class_students links
    const data = studentIds.map((studentId) => ({
      classId,
      studentId,
    }));

    return this.prisma.classStudent.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async removeStudentFromClass(institutionId: string, classId: string, studentId: string) {
    await this.findOne(institutionId, classId);

    return this.prisma.classStudent.delete({
      where: {
        classId_studentId: {
          classId,
          studentId
        }
      }
    });
  }
}
