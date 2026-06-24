const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    // Update all profiles to have the 'admin' role
    const update = await prisma.profile.updateMany({
      data: {
        role: 'admin'
      }
    });
    console.log(`Successfully updated ${update.count} profiles to ADMIN role.`);
  } catch (err) {
    console.error('Error updating profiles:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
