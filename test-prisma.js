import pkg from '@prisma/client';
console.log('Package keys:', Object.keys(pkg));
const { PrismaClient } = pkg;
console.log('PrismaClient type:', typeof PrismaClient);
try {
  const prisma = new PrismaClient();
  console.log('Successfully instantiated PrismaClient');
} catch (e) {
  console.log('Failed to instantiate PrismaClient:', e.message);
  console.log('Stack:', e.stack);
}
