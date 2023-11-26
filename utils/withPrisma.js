import { PrismaClient } from "@prisma/client";


// Helper function to execute the callback with the Prisma instance

async function withPrisma(callback) {
  // Create a new Prisma client instance
  const prisma = new PrismaClient();

  try {
    // Run the callback with the Prisma instance
    await callback(prisma);
  } catch (error) {
    console.error('Error executing callback:', error);
  } finally {
    // Close the Prisma connection
    await prisma.$disconnect();
  }
}

export default withPrisma;

/*
Example usage:

withPrisma(async (prisma) => {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
});
*/