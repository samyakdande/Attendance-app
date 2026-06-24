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

async function testAssign() {
  const cls = await prisma.class.findFirst();
  const profile = await prisma.profile.findUnique({
    where: { email: 'teacher@campusflow.test' },
  });
  
  if (!cls || !profile) {
    console.log('Missing class or teacher profile');
    return;
  }

  const teacher = await prisma.teacher.findUnique({
    where: { profileId: profile.id }
  });

  if (!teacher) {
    console.log('Profile exists but no Teacher record found');
    return;
  }
  
  console.log(`Assigning Teacher ${teacher.id} (email: teacher@campusflow.test) to Class ${cls.id}`);
  
  try {
    const res = await prisma.class.update({
      where: { id: cls.id },
      data: { 
        teacherId: teacher.id,
        institutionId: profile.institutionId // Fix cross-tenant bug
      }
    });
    console.log('Success!', res);
  } catch(e) {
    console.error('Error assigning:', e);
  }
}

testAssign().finally(() => prisma.$disconnect());
