import "dotenv/config";
import { defineConfig } from "@prisma/config"; // Adicionado o @

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Se não houver .env, ele usará o caminho padrão do SQLite
    url: process.env["DATABASE_URL"] ?? "file:./sima.db",
  },
});