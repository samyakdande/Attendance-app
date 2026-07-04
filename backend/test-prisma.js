const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing Prisma connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Success:', result);
  } catch (e) {
    console.error('Prisma Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
