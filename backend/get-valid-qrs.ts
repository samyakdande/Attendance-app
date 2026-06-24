import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching valid QR codes from your database...');

  // Find the most recently created class that has students in it
  const classWithStudents = await prisma.class.findFirst({
    where: {
      students: {
        some: {} // Must have at least one student
      }
    },
    include: {
      students: {
        include: {
          student: true
        },
        take: 3 // Get up to 3 students from this class
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!classWithStudents || classWithStudents.students.length === 0) {
    console.log('❌ Could not find any classes with mapped students. Did you run the seed script?');
    return;
  }

  console.log(`\n✅ Found Class: ${classWithStudents.name}`);
  console.log('Use these exact UUIDs to test the scanner:\n');

  classWithStudents.students.forEach((cs, i) => {
    console.log(`Student ${i + 1}: ${cs.student.firstName} ${cs.student.lastName}`);
    console.log(`QR UUID: ${cs.student.qrIdentifier}`);
    console.log(`Generate QR: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${cs.student.qrIdentifier}\n`);
  });

}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
