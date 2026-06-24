import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AttendanceCorrectionsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditLogsService,
    private notifications: NotificationsService
  ) {}

  async requestCorrection(institutionId: string, requestedById: string, data: { attendanceRecordId: string; newStatus: string; reason: string }) {
    // 1. Fetch the original record
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id: data.attendanceRecordId },
      include: { student: true, session: { include: { class: true } } }
    });

    if (!record) throw new NotFoundException('Attendance record not found');

    // 2. Create the pending correction request
    const correction = await this.prisma.attendanceCorrection.create({
      data: {
        attendanceRecordId: record.id,
        requestedById,
        oldStatus: record.status,
        newStatus: data.newStatus,
        reason: data.reason,
        status: 'pending'
      }
    });

    // 3. Immutably log the request
    await this.audit.createLog({
      institutionId,
      actorId: requestedById,
      action: 'REQUESTED_ATTENDANCE_CORRECTION',
      entityType: 'AttendanceCorrection',
      entityId: correction.id,
      metadata: { oldStatus: record.status, newStatus: data.newStatus, reason: data.reason }
    });

    // 4. Notify Admins (For simplicity, finding the first admin in the institution)
    const admin = await this.prisma.profile.findFirst({
      where: { institutionId, role: 'admin' }
    });

    if (admin) {
      await this.notifications.createNotification({
        institutionId,
        userId: admin.id,
        title: 'New Attendance Correction Request',
        message: `Teacher requested to change ${record.student.firstName} ${record.student.lastName}'s attendance from ${record.status} to ${data.newStatus}.`,
        type: 'correction_request_pending',
        entityId: correction.id,
        entityType: 'attendance_correction'
      });
    }

    return correction;
  }

  async getInbox(institutionId: string) {
    return this.prisma.attendanceCorrection.findMany({
      where: {
        attendanceRecord: { session: { institutionId } } // Make sure we only get institution's corrections
      },
      include: {
        requestedBy: true,
        approvedBy: true,
        attendanceRecord: {
          include: { student: true, session: { include: { class: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async resolveCorrection(institutionId: string, approvedById: string, id: string, data: { status: 'approved' | 'rejected' | 'expired'; adminNote?: string }) {
    const correction = await this.prisma.attendanceCorrection.findUnique({
      where: { id },
      include: { attendanceRecord: { include: { student: true } } }
    });

    if (!correction) throw new NotFoundException('Correction not found');
    if (correction.status !== 'pending') throw new BadRequestException('Correction is already resolved');

    // Start a transaction: Update Correction, Update Record (if approved), Audit, Notify
    return this.prisma.$transaction(async (tx) => {
      // 1. Update Correction
      const updatedCorrection = await tx.attendanceCorrection.update({
        where: { id },
        data: {
          status: data.status,
          adminNote: data.adminNote,
          approvedById,
          resolvedAt: new Date()
        },
        include: { requestedBy: true, approvedBy: true }
      });

      // 2. Update Record if Approved
      if (data.status === 'approved') {
        await tx.attendanceRecord.update({
          where: { id: correction.attendanceRecordId },
          data: { status: correction.newStatus }
        });
      }

      // 3. Audit Log
      await this.audit.createLog({
        institutionId,
        actorId: approvedById,
        action: `RESOLVED_ATTENDANCE_CORRECTION_${data.status.toUpperCase()}`,
        entityType: 'AttendanceCorrection',
        entityId: id,
        metadata: { status: data.status, oldStatus: correction.oldStatus, newStatus: correction.newStatus }
      });

      // 4. Notify the Teacher
      await this.notifications.createNotification({
        institutionId,
        userId: correction.requestedById,
        title: `Correction Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
        message: `Your request to change ${correction.attendanceRecord.student.firstName}'s attendance to ${correction.newStatus} was ${data.status}.`,
        type: `correction_request_${data.status}`,
        entityId: id,
        entityType: 'attendance_correction'
      });

      return updatedCorrection;
    });
  }
}
