import "dotenv/config";
import { defineConfig } from "@prisma/config";

// No Vercel, as env vars podem não estar disponíveis no postinstall (prisma generate)
// Usamos um fallback apenas para que o generate não quebre.
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});
