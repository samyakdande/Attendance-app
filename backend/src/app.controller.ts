import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  @Get('api/v1/health/database')
  async checkDatabase() {
    console.log('[HEALTH] Checking database connection...');
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      console.log(`[HEALTH] Database connection SUCCESS`);
      return { status: 'ok', database: 'connected' };
    } catch (error) {
      console.error(`[HEALTH] Database connection FAILED`, error);
      throw error;
    }
  }

  @Get('seed-test')
  async seedTest() {
    // 1. Create a dummy institution
    const institution = await this.prisma.institution.create({
      data: { name: 'Test University', type: 'university' }
    });

    // 2. Create or Update the exact profile for teacher@campusflow.test
    const profileId = '0121cb24-c11f-410d-bc2e-0cd0533d056a';
    
    const profile = await this.prisma.profile.upsert({
      where: { id: profileId },
      update: { institutionId: institution.id, role: 'teacher' },
      create: {
        id: profileId,
        institutionId: institution.id,
        role: 'teacher',
        firstName: 'Live',
        lastName: 'Teacher',
        email: 'live-teacher@campusflow.test'
      }
    });

    const teacher = await this.prisma.teacher.upsert({
      where: { profileId: profile.id },
      update: { department: 'CS' },
      create: { profileId: profile.id, department: 'CS' }
    });

    // 3. Create a class
    const cls = await this.prisma.class.create({
      data: {
        institutionId: institution.id,
        name: 'React Native 101',
        academicYear: '2026',
        teacherId: teacher.id
      }
    });

    // 4. Create or update students
    const s1 = await this.prisma.student.upsert({
      where: { qrIdentifier: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac' }, // Jane's existing UUID
      update: {},
      create: {
        id: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac', // reuse as ID
        institutionId: institution.id,
        firstName: 'Jane',
        lastName: 'Smith',
        enrollmentNumber: 'JS1001',
        qrIdentifier: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac'
      }
    });

    const s2 = await this.prisma.student.upsert({
      where: { qrIdentifier: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' },
      update: {},
      create: {
        institutionId: institution.id,
        firstName: 'Alice',
        lastName: 'Johnson',
        enrollmentNumber: 'AJ1002',
        qrIdentifier: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'
      }
    });

    const s3 = await this.prisma.student.upsert({
      where: { qrIdentifier: 'f1e2d3c4-b5a6-4f1e-8d2c-3b4a5f6e7d8c' },
      update: {},
      create: {
        institutionId: institution.id,
        firstName: 'Bob',
        lastName: 'Williams',
        enrollmentNumber: 'BW1003',
        qrIdentifier: 'f1e2d3c4-b5a6-4f1e-8d2c-3b4a5f6e7d8c'
      }
    });

    // Link students to class safely (ignore unique constraint errors if already linked)
    try { await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s1.id } }); } catch (e) {}
    try { await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s2.id } }); } catch (e) {}
    try { await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s3.id } }); } catch (e) {}

    // We no longer manually create an attendance session here because the teacher will start it from their Dashboard UI!

    return {
      message: 'Test students generated! You can now open your Expo app, tap Start Session, and scan the QR codes I provided.',
      students: [
        { name: 'Jane Smith', qr: s1.qrIdentifier },
        { name: 'Alice Johnson', qr: s2.qrIdentifier },
        { name: 'Bob Williams', qr: s3.qrIdentifier }
      ]
    };
  }
}
