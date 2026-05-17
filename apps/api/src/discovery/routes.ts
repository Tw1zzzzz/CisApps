import { discoveryFiltersSchema } from "@party-up/domain";
import type { FastifyInstance } from "fastify";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";

export async function registerDiscoveryRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.get("/discovery", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = discoveryFiltersSchema.safeParse(request.query);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return {
      profiles: await store.listDiscovery(request.userId, parsed.data)
    };
  });
}
