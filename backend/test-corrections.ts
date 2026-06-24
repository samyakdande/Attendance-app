import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '');
const pool = new Pool({ connectionString: cleanUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function runE2ETest() {
  console.log('--- STARTING CORRECTIONS E2E TEST ---');

  // 1. Setup Data
  const institution = await prisma.institution.findFirst();
  if (!institution) throw new Error('No institution found');
  
  const admin = await prisma.profile.findFirst({ where: { role: 'admin' } });
  const teacher = await prisma.profile.findFirst({ where: { role: 'teacher' } });
  if (!admin || !teacher) throw new Error('Need admin and teacher profiles');

  const student = await prisma.student.findFirst();
  const session = await prisma.attendanceSession.findFirst();
  
  if (!student || !session) throw new Error('Need student and session');

  // Create an attendance record to correct
  const record = await prisma.attendanceRecord.create({
    data: {
      sessionId: session.id,
      studentId: student.id,
      status: 'absent'
    }
  });
  console.log(`✅ Step 1: Created Attendance Record (ID: ${record.id}) for Student ${student.firstName} as 'absent'`);

  // 2. Teacher Submits Correction
  const correction = await prisma.attendanceCorrection.create({
    data: {
      attendanceRecordId: record.id,
      requestedById: teacher.id,
      oldStatus: 'absent',
      newStatus: 'present',
      reason: 'Student arrived late but was marked absent',
      status: 'pending'
    }
  });
  console.log(`✅ Step 2: Teacher submitted correction (ID: ${correction.id})`);

  // 3. Admin Approves Correction (Testing the Prisma Transaction logic)
  console.log('⏳ Step 3: Admin is approving the correction...');
  
  const updatedCorrection = await prisma.$transaction(async (tx) => {
    // A. Update Correction
    const updated = await tx.attendanceCorrection.update({
      where: { id: correction.id },
      data: {
        status: 'approved',
        adminNote: 'Verified with security camera',
        approvedById: admin.id,
        resolvedAt: new Date()
      }
    });

    // B. Update Record
    await tx.attendanceRecord.update({
      where: { id: correction.attendanceRecordId },
      data: { status: 'present' }
    });

    // C. Audit Log
    await tx.auditLog.create({
      data: {
        institutionId: institution.id,
        actorId: admin.id,
        action: 'RESOLVED_ATTENDANCE_CORRECTION_APPROVED',
        entityType: 'AttendanceCorrection',
        entityId: correction.id,
        metadata: { oldStatus: 'absent', newStatus: 'present', note: 'Verified with security camera' }
      }
    });

    // D. Notification
    await tx.notification.create({
      data: {
        institutionId: institution.id,
        userId: teacher.id,
        title: 'Correction Approved',
        message: 'Your request was approved.',
        type: 'correction_request_approved',
        entityId: correction.id,
        entityType: 'attendance_correction'
      }
    });

    return updated;
  });

  console.log(`✅ Step 4: Correction Approved successfully! Status is now ${updatedCorrection.status}`);

  // Verify final record state
  const finalRecord = await prisma.attendanceRecord.findUnique({ where: { id: record.id } });
  console.log(`✅ Step 5: Final Attendance Record status is: ${finalRecord?.status}`);
  
  if (finalRecord?.status === 'present') {
    console.log('🏆 E2E TEST PASSED!');
  } else {
    console.log('❌ E2E TEST FAILED! Record status did not update correctly.');
  }
}

runE2ETest()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
