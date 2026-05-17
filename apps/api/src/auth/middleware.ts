import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { PartyUpStore } from "../store/inMemoryStore.js";
import { verifySessionToken } from "./tokens.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export function registerAuthDecorator(app: FastifyInstance, store: PartyUpStore): void {
  app.decorateRequest("userId", "");
  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    const userId = token ? verifySessionToken(token) : null;

    if (!userId || !(await store.getUser(userId))) {
      void reply.status(401).send({ error: "unauthorized", message: "Sign in to continue." });
      return;
    }

    request.userId = userId;
  });
}
