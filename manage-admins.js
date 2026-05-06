import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Gerenciando usuários administradores...');

  // 1. Limpar usuários existentes (Opcional, mas solicitado pelo usuário para "apagar o dele")
  // Se quiser manter outros usuários, pode usar deleteMany({ where: { username: 'admin' } })
  await prisma.user.deleteMany({});
  console.log('Usuários antigos removidos.');

  const admins = [
    { username: 'admin1', password: 'senha_aqui_1' },
    { username: 'admin2', password: 'senha_aqui_2' },
    { username: 'admin3', password: 'senha_aqui_3' },
    { username: 'admin4', password: 'senha_aqui_4' },
  ];

  for (const admin of admins) {
    await prisma.user.create({
      data: admin
    });
    console.log(`Usuário criado: ${admin.username}`);
  }

  console.log('✅ 4 novos administradores configurados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
