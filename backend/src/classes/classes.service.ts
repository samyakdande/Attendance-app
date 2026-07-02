import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, getPaginationOptions, PaginatedResult } from '../common/interfaces/pagination.interface';

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

  async findAll(institutionId: string, user?: any, params?: PaginationParams & { academicYear?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = getPaginationOptions(params || {});
    
    let whereClause: any = {
      institutionId,
      deletedAt: null,
    };

    if (params?.academicYear) whereClause.academicYear = params.academicYear;

    if (params?.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { academicYear: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (user?.role === 'teacher') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { profileId: user.id }
      });
      if (!teacher) return { data: [], meta: { total: 0, page, limit, totalPages: 0, hasNext: false, hasPrevious: false } }; 
      whereClause.teacherId = teacher.id;
    }

    const [total, classes] = await this.prisma.$transaction([
      this.prisma.class.count({ where: whereClause }),
      this.prisma.class.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          teacher: {
            include: { profile: { select: { firstName: true, lastName: true } } },
          },
          _count: {
            select: { students: true },
          },
        },
        orderBy: { name: 'asc' }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    const data = classes.map(c => ({
      id: c.id,
      name: c.name,
      academicYear: c.academicYear,
      teacherName: c.teacher ? `${c.teacher.profile.firstName} ${c.teacher.profile.lastName}` : 'Unassigned',
      studentCount: c._count.students,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
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
