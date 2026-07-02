import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationParams, getPaginationOptions, PaginatedResult } from '../common/interfaces/pagination.interface';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(institutionId: string, data: { profileId: string; firstName: string; lastName: string; email: string; department?: string }) {
    // Check if profile exists by ID or Email
    const existingProfile = await this.prisma.profile.findFirst({
      where: { 
        OR: [
          { id: data.profileId },
          { email: data.email }
        ]
      },
    });

    if (existingProfile) {
      if (existingProfile.email === data.email) {
        throw new ConflictException('A profile with this email address already exists.');
      }
      throw new ConflictException('Profile ID already exists.');
    }

    // Since profile doesn't exist, create it along with the teacher
    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.create({
        data: {
          id: data.profileId, // From Supabase Auth
          institutionId,
          role: 'teacher',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      });

      const teacher = await prisma.teacher.create({
        data: {
          profileId: profile.id,
          department: data.department,
        },
        include: {
          profile: true,
        },
      });

      return teacher;
    });
  }

  async findAll(institutionId: string, params?: PaginationParams & { department?: string, status?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = getPaginationOptions(params || {});

    let whereClause: any = {
      profile: { institutionId },
      deletedAt: null,
    };

    if (params?.department) whereClause.department = params.department;
    if (params?.status) whereClause.status = params.status;

    if (params?.search) {
      whereClause.profile = {
        ...whereClause.profile,
        OR: [
          { firstName: { contains: params.search, mode: 'insensitive' } },
          { lastName: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } }
        ]
      };
    }

    const [total, teachers] = await this.prisma.$transaction([
      this.prisma.teacher.count({ where: whereClause }),
      this.prisma.teacher.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          profile: true,
          _count: {
            select: { classes: true }
          }
        },
        orderBy: {
          profile: { lastName: 'asc' }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    const data = teachers.map(t => ({
      id: t.id,
      name: `${t.profile.firstName} ${t.profile.lastName}`,
      email: t.profile.email,
      department: t.department || 'Unassigned',
      status: t.status,
      assignedClasses: t._count.classes
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

  async findOne(institutionId: string, id: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        id,
        profile: { institutionId },
        deletedAt: null,
      },
      include: {
        profile: true,
        classes: {
          include: {
            _count: {
              select: { students: true }
            }
          }
        },
        sessions: {
          orderBy: { startTime: 'desc' },
          take: 10,
          include: { class: true }
        }
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(institutionId: string, id: string, data: { firstName?: string; lastName?: string; department?: string; status?: string; phone?: string }) {
    const teacher = await this.findOne(institutionId, id);

    return this.prisma.$transaction(async (prisma) => {
      if (data.firstName || data.lastName || data.phone !== undefined) {
        await prisma.profile.update({
          where: { id: teacher.profileId },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        });
      }

      return prisma.teacher.update({
        where: { id },
        data: {
          department: data.department,
          status: data.status,
        },
        include: {
          profile: true,
        },
      });
    });
  }

  async assignClass(institutionId: string, id: string, classId: string) {
    const teacher = await this.findOne(institutionId, id);
    const cls = await this.prisma.class.findFirst({ where: { id: classId, institutionId } });

    if (!cls) throw new NotFoundException('Class not found');

    return this.prisma.class.update({
      where: { id: classId },
      data: { teacherId: teacher.id }
    });
  }

  async removeClass(institutionId: string, id: string, classId: string) {
    const teacher = await this.findOne(institutionId, id);
    const cls = await this.prisma.class.findFirst({ where: { id: classId, institutionId, teacherId: teacher.id } });

    if (!cls) throw new NotFoundException('Class not found or not assigned to this teacher');

    return this.prisma.class.update({
      where: { id: classId },
      data: { teacherId: null }
    });
  }

  async getDashboardStats(institutionId: string, profileId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { profileId, profile: { institutionId }, deletedAt: null },
      include: { profile: true },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');

    const classes = await this.prisma.class.findMany({
      where: { teacherId: teacher.id, institutionId },
    });

    const sessions = await this.prisma.attendanceSession.findMany({
      where: { teacherId: teacher.id, institutionId },
    });

    // Mock live attendance for today (until we build robust Redis-to-Postgres aggregation)
    const stats = {
      classesToday: classes.length,
      sessionsCompleted: sessions.length,
      attendanceToday: 92 // Hardcoded safe fallback for the field test percentage for now
    };

    // Fetch real notifications for the user
    const notifications = await this.prisma.notification.findMany({
      where: { institutionId, userId: profileId },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    const unreadCount = await this.prisma.notification.count({
      where: { institutionId, userId: profileId, isRead: false }
    });

    return {
      teacher: {
        id: teacher.id,
        name: `${teacher.profile.firstName} ${teacher.profile.lastName}`
      },
      stats,
      classes: classes.map(c => ({
        id: c.id,
        name: c.name,
        time: '08:00 AM', // Mock time as schedule is not fully modeled yet
        status: 'UPCOMING'
      })),
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        details: n.message,
        time: n.createdAt,
        isRead: n.isRead
      })),
      unreadCount
    };
  }

  async remove(institutionId: string, id: string) {
    const teacher = await this.findOne(institutionId, id);

    // Soft delete teacher and profile
    return this.prisma.$transaction(async (prisma) => {
      await prisma.profile.update({
        where: { id: teacher.profileId },
        data: { deletedAt: new Date() },
      });

      return prisma.teacher.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}
