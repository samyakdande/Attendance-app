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

async function flush() {
  console.log('Flushing ClassStudents...');
  await prisma.classStudent.deleteMany();
  
  console.log('Flushing Attendance...');
  await prisma.attendanceCorrection.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  
  console.log('Flushing Students...');
  await prisma.parentStudent.deleteMany();
  await prisma.student.deleteMany();
  
  console.log('Flushing Classes...');
  await prisma.class.deleteMany();
  
  console.log('Flushing Profile Dependencies (Notifications, Devices, etc)...');
  await prisma.notification.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.device.deleteMany();
  
  console.log('Flushing Teachers & Profiles...');
  await prisma.teacher.deleteMany();
  await prisma.profile.deleteMany({
    where: { role: 'teacher' }
  });

  console.log('Successfully flushed all Students, Teachers, and Classes!');
}

flush()
  .catch(e => {
    console.error('Error during flush:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
