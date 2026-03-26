import { defineConfig } from "prisma/config";

const datasourceUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("Missing DIRECT_DATABASE_URL or DATABASE_URL environment variable.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
} as any);
