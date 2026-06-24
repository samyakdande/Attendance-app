import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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
}
