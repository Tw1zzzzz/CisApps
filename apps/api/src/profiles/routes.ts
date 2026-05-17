import { createProfileSchema, updateProfileSchema } from "@party-up/domain";
import type { FastifyInstance } from "fastify";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";

export async function registerProfileRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.get("/me", { preHandler: app.authenticate }, async (request) => {
    return store.getPrivateProfile(request.userId);
  });

  app.post("/me/profile", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = createProfileSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return store.createProfile(request.userId, parsed.data);
  });

  app.patch("/me/profile", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = updateProfileSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return store.updateProfile(request.userId, parsed.data);
  });
}
