import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const counts = await prisma.question.groupBy({
    by: ['category'],
    _count: { _all: true }
  });
  console.log('CONTAGEM POR CATEGORIA NO BANCO:');
  console.log(JSON.stringify(counts, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
