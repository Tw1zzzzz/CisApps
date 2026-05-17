import type { FastifyInstance } from "fastify";
import type { PartyUpStore } from "../store/inMemoryStore.js";

export async function registerMatchRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.get("/matches", { preHandler: app.authenticate }, async (request) => {
    return { matches: await store.listMatches(request.userId) };
  });

  app.get("/chats", { preHandler: app.authenticate }, async (request) => {
    return { chats: await store.listMatches(request.userId) };
  });
}

