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

async function testQrMapping() {
  console.log('--- QR Mapping Test ---');
  
  // 1. Get a few students
  const students = await prisma.student.findMany({ 
    take: 5,
    orderBy: { lastName: 'asc' }
  });
  
  console.log('\nSample Students in DB:');
  students.forEach(s => {
    console.log(`- ${s.firstName} ${s.lastName} (ID: ${s.enrollmentNumber})`);
    console.log(`  QR: ${s.qrIdentifier}`);
  });

  if (students.length === 0) {
    console.log('No students found!');
    return;
  }

  // 2. Simulate a scan for the first student
  const targetQr = students[0].qrIdentifier;
  console.log(`\nSimulating scan for QR: ${targetQr}`);

  const matchedStudent = await prisma.student.findUnique({
    where: { qrIdentifier: targetQr }
  });

  if (matchedStudent) {
    console.log(`✅ MATCHED: ${matchedStudent.firstName} ${matchedStudent.lastName}`);
    if (matchedStudent.id === students[0].id) {
      console.log(`✅ IDs MATCH PERFECTLY`);
    } else {
      console.log(`❌ IDS DO NOT MATCH! Expected ${students[0].id}, got ${matchedStudent.id}`);
    }
  } else {
    console.log(`❌ NO MATCH FOUND IN DB`);
  }
}

testQrMapping()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
