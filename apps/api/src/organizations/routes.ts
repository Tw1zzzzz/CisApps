import {
  applicationParamsSchema,
  createOrganizationSchema,
  createRecruiterProfileSchema,
  createTeamApplicationSchema,
  organizationParamsSchema,
  updateApplicationStatusSchema,
  updateOrganizationSchema
} from "@party-up/domain";
import type { FastifyInstance } from "fastify";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";

export async function registerOrganizationRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.post("/me/recruiter-profile", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = createRecruiterProfileSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return { recruiterProfile: await store.createRecruiterProfile(request.userId, parsed.data) };
  });

  app.get("/me/recruiter-profile", { preHandler: app.authenticate }, async (request) => {
    return { recruiterProfile: await store.getRecruiterProfile(request.userId) };
  });

  app.post("/me/organization", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = createOrganizationSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return { organization: await store.createOrganization(request.userId, parsed.data) };
  });

  app.patch("/me/organization", { preHandler: app.authenticate }, async (request, reply) => {
    const parsed = updateOrganizationSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    return { organization: await store.updateOrganization(request.userId, parsed.data) };
  });

  app.get("/me/organization", { preHandler: app.authenticate }, async (request) => {
    return { organization: await store.getMyOrganization(request.userId) };
  });

  app.get("/organizations/feed", { preHandler: app.authenticate }, async (request) => {
    return { organizations: await store.listOrganizationFeed(request.userId) };
  });

  app.post("/organizations/:id/apply", { preHandler: app.authenticate }, async (request, reply) => {
    const params = organizationParamsSchema.safeParse(request.params);
    const body = createTeamApplicationSchema.safeParse(request.body);
    if (!params.success) {
      sendZodError(reply, params.error);
      return;
    }
    if (!body.success) {
      sendZodError(reply, body.error);
      return;
    }

    return { application: await store.createTeamApplication(request.userId, params.data.id, body.data) };
  });

  app.get("/me/applications", { preHandler: app.authenticate }, async (request) => {
    return { applications: await store.listMyApplications(request.userId) };
  });

  app.get("/organization/applications", { preHandler: app.authenticate }, async (request) => {
    return { applications: await store.listOrganizationApplications(request.userId) };
  });

  app.patch("/organization/applications/:id/status", { preHandler: app.authenticate }, async (request, reply) => {
    const params = applicationParamsSchema.safeParse(request.params);
    const body = updateApplicationStatusSchema.safeParse(request.body);
    if (!params.success) {
      sendZodError(reply, params.error);
      return;
    }
    if (!body.success) {
      sendZodError(reply, body.error);
      return;
    }

    return { application: await store.updateApplicationStatus(request.userId, params.data.id, body.data) };
  });
}

