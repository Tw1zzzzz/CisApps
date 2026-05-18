import cors from "@fastify/cors";
import fastify from "fastify";
import { HttpError } from "./http/errors.js";
import { registerAuthDecorator } from "./auth/middleware.js";
import { registerAuthRoutes } from "./auth/routes.js";
import { registerDiscoveryRoutes } from "./discovery/routes.js";
import { registerLikeRoutes } from "./likes/routes.js";
import { registerMatchRoutes } from "./matches/routes.js";
import { registerOrganizationRoutes } from "./organizations/routes.js";
import { registerProfileRoutes } from "./profiles/routes.js";
import { createInMemoryStore, type PartyUpStore } from "./store/inMemoryStore.js";

export async function buildApp(store: PartyUpStore = createInMemoryStore()) {
  const app = fastify({
    logger: {
      level: process.env.APP_ENV === "test" ? "silent" : "info",
      redact: ["req.headers.authorization"]
    }
  });

  await app.register(cors, { origin: true });

  registerAuthDecorator(app, store);
  await registerAuthRoutes(app, store);
  await registerProfileRoutes(app, store);
  await registerDiscoveryRoutes(app, store);
  await registerLikeRoutes(app, store);
  await registerMatchRoutes(app, store);
  await registerOrganizationRoutes(app, store);

  app.get("/health", async () => ({ ok: true }));

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      void reply.status(error.statusCode).send({
        error: "request_failed",
        message: error.message
      });
      return;
    }

    app.log.error(error);
    void reply.status(500).send({
      error: "internal_error",
      message: "Something went wrong."
    });
  });

  return app;
}
