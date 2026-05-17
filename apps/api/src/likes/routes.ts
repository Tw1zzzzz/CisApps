import { likeTargetParamsSchema, type LikeAction } from "@party-up/domain";
import type { FastifyInstance } from "fastify";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";

const routeActions: Array<{ path: string; action: LikeAction }> = [
  { path: "/profiles/:id/like", action: "like" },
  { path: "/profiles/:id/pass", action: "pass" },
  { path: "/profiles/:id/super-like", action: "super-like" }
];

export async function registerLikeRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.get("/likes/incoming", { preHandler: app.authenticate }, async (request) => {
    return { likes: await store.listLikes(request.userId, "incoming") };
  });

  app.get("/likes/outgoing", { preHandler: app.authenticate }, async (request) => {
    return { likes: await store.listLikes(request.userId, "outgoing") };
  });

  for (const route of routeActions) {
    app.post(route.path, { preHandler: app.authenticate }, async (request, reply) => {
      const parsed = likeTargetParamsSchema.safeParse(request.params);
      if (!parsed.success) {
        sendZodError(reply, parsed.error);
        return;
      }

      return store.recordLike(request.userId, parsed.data.id, route.action);
    });
  }
}
