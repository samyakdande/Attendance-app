import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(institutionId: string, user?: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sessionWhere: any = { institutionId };
    let studentWhere: any = { institutionId, deletedAt: null };

    if (user?.role === 'teacher') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { profileId: user.id }
      });
      if (teacher) {
        sessionWhere.class = { teacherId: teacher.id };
        studentWhere.classes = { some: { class: { teacherId: teacher.id } } };
      } else {
        // Teacher profile not found, return zeroes
        return { totalStudents: 0, todaySessions: 0, recentSessions: [] };
      }
    }

    const recentSessions = await this.prisma.attendanceSession.findMany({
      where: sessionWhere,
      include: { class: true, _count: { select: { records: { where: { status: 'present' } } } } },
      orderBy: { startTime: 'desc' },
      take: 5
    });

    const totalStudents = await this.prisma.student.count({ where: studentWhere });

    return {
      totalStudents,
      todaySessions: recentSessions.filter(s => s.startTime >= today).length,
      recentSessions: recentSessions.map(s => ({
        id: s.id,
        className: s.class.name,
        date: s.startTime,
        present: s._count.records
      }))
    };
  }

  async getClassStats(institutionId: string, classId: string) {
    // Ensure class belongs to institution
    const cls = await this.prisma.class.findFirst({
      where: { id: classId, institutionId },
    });
    if (!cls) throw new NotFoundException('Class not found');

    const totalStudents = await this.prisma.classStudent.count({
      where: { classId },
    });

    const sessions = await this.prisma.attendanceSession.findMany({
      where: { classId, institutionId, status: 'closed' },
      orderBy: { startTime: 'desc' },
      take: 30, // Last 30 sessions
      include: {
        _count: {
          select: {
            records: {
              where: { status: 'present' },
            },
          },
        },
      },
    });

    const sessionStats = sessions.map((s) => ({
      sessionId: s.id,
      date: s.startTime,
      presentCount: s._count.records,
      totalStudents,
      attendancePercentage: totalStudents > 0 ? (s._count.records / totalStudents) * 100 : 0,
    }));

    return {
      classId,
      className: cls.name,
      totalStudents,
      recentSessions: sessionStats,
    };
  }

  async getStudentReport(institutionId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, institutionId },
      include: {
        attendance: {
          include: {
            session: {
              include: { class: true },
            },
          },
          orderBy: { scannedAt: 'desc' },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    const totalClasses = student.attendance.length;
    const presentCount = student.attendance.filter((r: any) => r.status === 'present').length;

    return {
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      enrollmentNumber: student.enrollmentNumber,
      overallAttendance: totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0,
      history: student.attendance.map((r: any) => ({
        date: r.scannedAt || r.session.startTime,
        status: r.status,
        className: r.session.class.name,
      })),
    };
  }

  async exportInstitutionReport(institutionId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const sessions = await this.prisma.attendanceSession.findMany({
      where: {
        institutionId,
        startTime: Object.keys(dateFilter).length ? dateFilter : undefined,
      },
      include: {
        class: true,
        teacher: { include: { profile: true } },
        records: { include: { student: true } },
      },
    });

    // Format for easy CSV conversion on frontend
    const reportData = [];
    for (const session of sessions) {
      for (const record of session.records) {
        reportData.push({
          sessionDate: session.startTime.toISOString(),
          className: session.class.name,
          teacherName: `${session.teacher.profile.firstName} ${session.teacher.profile.lastName}`,
          studentName: `${record.student.firstName} ${record.student.lastName}`,
          enrollmentNumber: record.student.enrollmentNumber,
          status: record.status,
          scannedAt: record.scannedAt ? record.scannedAt.toISOString() : null,
        });
      }
    }

    return reportData;
  }
}
