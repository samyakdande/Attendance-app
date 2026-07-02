import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { randomUUID } from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async getDashboardStats(institutionId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get live counts
    const [
      activeTeachers,
      activeStudents,
      activeClasses,
      pendingCorrections
    ] = await Promise.all([
      this.prisma.teacher.count({ where: { profile: { institutionId }, status: 'active' } }),
      this.prisma.student.count({ where: { institutionId, status: 'active' } }),
      this.prisma.class.count({ where: { institutionId } }),
      this.prisma.attendanceCorrection.count({ 
        where: { 
          attendanceRecord: { session: { institutionId } },
          status: 'pending' 
        } 
      })
    ]);

    // Get today's metrics from SystemMetric table
    const metricsToday = await this.prisma.systemMetric.findMany({
      where: {
        institutionId,
        date: today
      }
    });

    // Helper to safely extract metric value
    const getMetric = (name: string) => {
      const metric = metricsToday.find(m => m.metricName === name);
      return metric ? metric.metricValue : 0;
    };

    return {
      liveStats: {
        teachers: activeTeachers,
        students: activeStudents,
        classes: activeClasses,
        pendingCorrections
      },
      todayMetrics: {
        sessions: getMetric('total_sessions'),
        scans: getMetric('total_scans'),
        offlineSyncs: getMetric('offline_syncs')
      }
    };
  }

  async generateQrExportPdf(institutionId: string, options: { classId?: string; section?: string; selectedStudentIds?: string[] }): Promise<string> {
    const whereClause: any = {
      institutionId,
      status: 'active'
    };

    if (options.selectedStudentIds && options.selectedStudentIds.length > 0) {
      whereClause.id = { in: options.selectedStudentIds };
    } else if (options.classId) {
      whereClause.classes = { some: { classId: options.classId } };
    }

    const students = await this.prisma.student.findMany({
      where: whereClause,
      include: {
        classes: { include: { class: { select: { name: true } } } },
      },
      orderBy: { lastName: 'asc' }
    });

    if (students.length === 0) {
      throw new NotFoundException('No students found for export.');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        try {
          const pdfData = Buffer.concat(buffers);
          // Assuming StorageService has a method to upload PDF, or we can use Supabase directly.
          // Since we need to upload and get a signed URL:
          const fileName = `exports/qr-export-${randomUUID()}.pdf`;
          
          // Note: storageService.uploadFile expects (bucket, path, buffer, mimetype)
          const result = await this.storageService.uploadFile('exports', fileName, pdfData, 'application/pdf');
          
          // getDownloadUrl expects (bucket, path, expiresIn)
          const signedUrl = await this.storageService.getDownloadUrl('exports', fileName, 60 * 60); // 1 hour
          
          resolve(signedUrl);
        } catch (error) {
          reject(error);
        }
      });

      // Simple grid layout (2 columns, 4 rows per page)
      const colWidth = 260;
      const rowHeight = 180;
      const startX = 30;
      const startY = 30;
      let i = 0;

      const processStudents = async () => {
        for (const student of students) {
          if (i > 0 && i % 8 === 0) {
            doc.addPage();
          }

          const col = i % 2;
          const row = Math.floor((i % 8) / 2);
          const x = startX + col * (colWidth + 20);
          const y = startY + row * (rowHeight + 20);

          // Draw Card border
          doc.rect(x, y, colWidth, rowHeight).stroke('#E6E6E1');

          // Generate QR Code image
          const qrPayload = student.qrIdentifier;
          const qrBuffer = await QRCode.toBuffer(qrPayload, { margin: 1, width: 100, type: 'png' });

          // Draw QR Image
          doc.image(qrBuffer, x + 150, y + 40, { width: 90 });

          // Draw text
          doc.fontSize(16).fillColor('#111111').text(`${student.firstName} ${student.lastName}`, x + 15, y + 40, { width: 130 });
          
          doc.fontSize(10).fillColor('#666666').text(`ID: ${student.enrollmentNumber}`, x + 15, y + 65);
          
          const className = student.classes[0]?.class?.name || 'Unassigned';
          doc.fontSize(10).fillColor('#666666').text(`Class: ${className}`, x + 15, y + 80);

          doc.fontSize(8).fillColor('#A0A0A0').text('CampusFlow Enterprise', x + 15, y + 150);

          i++;
        }
        doc.end();
      };
      
      processStudents().catch(reject);
    });
  }
}
