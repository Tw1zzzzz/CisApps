import type { FastifyReply } from "fastify";
import type { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export function sendZodError(reply: FastifyReply, error: ZodError): void {
  void reply.status(400).send({
    error: "validation_error",
    message: "Invalid request input.",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  });
}
