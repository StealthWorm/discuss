import { defineConfig } from "prisma/config";

const datasourceUrl =
  process.env.DIRECT_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
} as any);
