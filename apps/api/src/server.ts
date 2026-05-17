import { buildApp } from "./app.js";
import { getPrismaClient } from "./db/prisma.js";
import { env } from "./env.js";
import { createPrismaStore } from "./store/prismaStore.js";

const app = await buildApp(createPrismaStore(getPrismaClient()));

try {
  await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
