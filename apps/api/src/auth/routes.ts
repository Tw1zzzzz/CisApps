import { emailSchema } from "@party-up/domain";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../env.js";
import { sendZodError } from "../http/errors.js";
import type { PartyUpStore } from "../store/inMemoryStore.js";
import { createOtp, createSessionToken, hashOtp } from "./tokens.js";

const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/)
});

export async function registerAuthRoutes(app: FastifyInstance, store: PartyUpStore): Promise<void> {
  app.post("/auth/request-otp", async (request, reply) => {
    const parsed = z.object({ email: emailSchema }).safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    const otp = createOtp();
    await store.requestOtp(parsed.data.email, hashOtp(parsed.data.email, otp));

    void reply.send({
      ok: true,
      devOtp: env.APP_ENV === "production" ? undefined : otp
    });
  });

  app.post("/auth/verify-otp", async (request, reply) => {
    const parsed = verifyOtpSchema.safeParse(request.body);
    if (!parsed.success) {
      sendZodError(reply, parsed.error);
      return;
    }

    const user = await store.verifyOtp(parsed.data.email, hashOtp(parsed.data.email, parsed.data.otp));
    void reply.send({
      token: createSessionToken(user.id),
      user
    });
  });
}
