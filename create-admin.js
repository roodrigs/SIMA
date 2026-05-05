import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "sima.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '123', // Senha simples conforme solicitado
    },
  });
  console.log("Usuário Admin criado:", admin.username);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
