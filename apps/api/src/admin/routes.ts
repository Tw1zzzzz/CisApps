import { organizationModerationQuerySchema, organizationParamsSchema, updateOrganizationModerationSchema } from "@party-up/domain";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";

export async function registerAdminRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
    await app.authenticate(request, reply);
    if (reply.sent) return;

    const user = await store.getUser(request.userId);
    if (user?.role !== "admin") {
      void reply.status(403).send({ error: "forbidden", message: "Admin access required." });
    }
  }

  app.get("/admin/moderation/organizations", { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = organizationModerationQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return { organizations: await store.listOrganizationModerationQueue(parsed.data.status) };
  });

  app.patch("/admin/moderation/organizations/:id", { preHandler: requireAdmin }, async (request, reply) => {
    const params = organizationParamsSchema.safeParse(request.params);
    const body = updateOrganizationModerationSchema.safeParse(request.body);
    if (!params.success) {
      sendZodError(reply, params.error);
      return;
    }
    if (!body.success) {
      sendZodError(reply, body.error);
      return;
    }

    return { organization: await store.updateOrganizationModeration(params.data.id, body.data) };
  });
}
