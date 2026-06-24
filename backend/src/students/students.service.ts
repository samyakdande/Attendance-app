import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(institutionId: string, data: { firstName: string; lastName: string; enrollmentNumber: string; classId?: string }) {
    const student = await this.prisma.student.create({
      data: {
        institutionId,
        firstName: data.firstName,
        lastName: data.lastName,
        enrollmentNumber: data.enrollmentNumber,
        // qrIdentifier is auto-generated via @default(uuid())
      },
    });

    if (data.classId) {
      await this.prisma.classStudent.create({
        data: {
          studentId: student.id,
          classId: data.classId
        }
      });
    }

    return student;
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
      if (!teacher) return []; // If no teacher profile exists, they have no students

      whereClause.classes = {
        some: { class: { teacherId: teacher.id } }
      };
    }

    const students = await this.prisma.student.findMany({
      where: whereClause,
      include: {
        classes: { include: { class: true } },
        attendance: { orderBy: { scannedAt: 'desc' } }, // Get all attendance, ordered by latest
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    return students.map(student => {
      const presentCount = student.attendance.filter(a => a.status === 'present').length;
      const totalCount = student.attendance.length || 1;
      const lastScan = student.attendance[0]?.scannedAt || student.attendance[0]?.createdAt || null;
      
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        enrollmentNumber: student.enrollmentNumber,
        status: student.status,
        qrStatus: student.qrStatus,
        qrVersion: student.qrVersion,
        lastQrGeneratedAt: student.lastQrGeneratedAt,
        scanCount: student.attendance.length,
        lastScannedAt: lastScan,
        className: student.classes[0]?.class?.name || 'Unassigned',
        attendancePercentage: Math.round((presentCount / totalCount) * 100),
        qrIdentifier: student.qrIdentifier,
      };
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
      if (!teacher) throw new NotFoundException(`Student with ID ${id} not found or you don't have access.`);
      
      whereClause.classes = {
        some: { class: { teacherId: teacher.id } }
      };
    }

    const student = await this.prisma.student.findFirst({
      where: whereClause,
      include: {
        classes: { include: { class: true } },
        parents: { include: { parent: { include: { profile: true } } } },
        attendance: {
          include: { session: { include: { class: true } }, correction: true },
          orderBy: { scannedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Calculate massive stats on the backend so frontend is dumb
    const allAttendance = await this.prisma.attendanceRecord.findMany({ where: { studentId: id } });
    const presentCount = allAttendance.filter(a => a.status === 'present').length;
    const absentCount = allAttendance.filter(a => a.status === 'absent').length;
    const totalCount = allAttendance.length || 1;
    
    // Also get recent corrections
    const corrections = await this.prisma.attendanceCorrection.findMany({
      where: { attendanceRecord: { studentId: id } },
      include: { requestedBy: true, approvedBy: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const auditLogs = await this.prisma.auditLog.findMany({
      where: { entityId: id, institutionId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const timeline = [
      ...student.attendance.map(a => ({
        id: a.id,
        type: 'attendance_scan',
        title: `Attendance Scanned: ${a.status}`,
        description: `Class: ${a.session?.class?.name || 'Unknown'}`,
        timestamp: a.scannedAt || a.createdAt,
        color: a.status === 'present' ? '#D6F32F' : '#FF5A5A'
      })),
      ...corrections.map(c => ({
        id: c.id,
        type: 'correction',
        title: `Correction ${c.status.toUpperCase()}`,
        description: `${c.oldStatus} → ${c.newStatus}`,
        timestamp: c.createdAt,
        color: c.status === 'approved' ? '#D6F32F' : (c.status === 'rejected' ? '#FF5A5A' : '#FFA500')
      })),
      ...auditLogs.map(a => ({
        id: a.id,
        type: 'audit',
        title: a.action,
        description: a.metadata ? JSON.stringify(a.metadata) : 'System Event',
        timestamp: a.createdAt,
        color: '#A0A0A0'
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);

    return {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        phone: student.phone,
        status: student.status,
        qrStatus: student.qrStatus,
        qrVersion: student.qrVersion,
        className: student.classes[0]?.class?.name || 'Unassigned',
      },
      attendanceStats: {
        present: presentCount,
        absent: absentCount,
        percentage: Math.round((presentCount / totalCount) * 100),
      },
      parents: student.parents.map(p => ({
        id: p.parentId,
        relation: p.relation,
        name: `${p.parent.profile.firstName} ${p.parent.profile.lastName}`,
        email: p.parent.profile.email,
        phone: 'N/A' // Placeholder until added to profile
      })),
      timeline
    };
  }

  async update(institutionId: string, id: string, data: { firstName?: string; lastName?: string; enrollmentNumber?: string; email?: string; phone?: string; status?: string }) {
    await this.findOne(institutionId, id); // Ensure exists and access is allowed

    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(institutionId: string, id: string) {
    await this.findOne(institutionId, id);

    // Soft delete
    return this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Phase 5: QR Export
  async exportQrData(institutionId: string, classId?: string) {
    const whereClause: any = {
      institutionId,
      deletedAt: null,
    };

    if (classId) {
      whereClause.classes = {
        some: { classId },
      };
    }

    const students = await this.prisma.student.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        enrollmentNumber: true,
        qrIdentifier: true,
      },
      orderBy: { lastName: 'asc' },
    });

    return students.map(student => ({
      ...student,
      qrPayload: JSON.stringify({ studentId: student.id, qr: student.qrIdentifier }) // or just return the raw identifier
    }));
  }

  async regenerateQr(institutionId: string, id: string) {
    // Ensure student exists and belongs to institution
    await this.findOne(institutionId, id);

    const res = await this.prisma.student.update({
      where: { id },
      data: {
        qrIdentifier: require('crypto').randomUUID(),
        qrVersion: { increment: 1 },
        lastQrGeneratedAt: new Date(),
        qrStatus: 'active'
      }
    });

    // Fire audit log in background asynchronously
    this.prisma.auditLog.create({
      data: {
        institutionId,
        actorId: id, // Should ideally be admin who pressed it, but using student id for now
        action: 'QR Regenerated',
        entityType: 'Student',
        entityId: id,
        metadata: { source: 'Admin Dashboard' }
      }
    }).catch(e => console.error(e));

    return res;
  }
}
