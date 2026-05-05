import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // Adicionando {} para compatibilidade com Prisma 7
  return new PrismaClient({});
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
