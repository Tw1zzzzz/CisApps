import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "../env.js";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14;

export function createOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(email: string, otp: string): string {
  return createHmac("sha256", env.OTP_SECRET).update(`${email}:${otp}`).digest("hex");
}

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({
    userId,
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: randomBytes(8).toString("hex")
  })).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): string | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return null;
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    userId?: unknown;
    exp?: unknown;
  };

  if (typeof parsed.userId !== "string" || typeof parsed.exp !== "number" || parsed.exp < Date.now()) {
    return null;
  }

  return parsed.userId;
}

function sign(payload: string): string {
  return createHmac("sha256", env.OTP_SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
