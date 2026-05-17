import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./app.js";

async function signIn(email = "demo@partyup.local") {
  const app = await buildApp();
  const request = await app.inject({
    method: "POST",
    url: "/auth/request-otp",
    payload: { email }
  });
  const otpPayload = request.json<{ devOtp: string }>();
  const verify = await app.inject({
    method: "POST",
    url: "/auth/verify-otp",
    payload: { email, otp: otpPayload.devOtp }
  });
  return { app, token: verify.json<{ token: string }>().token };
}

test("GET /me returns private profile with contacts", async () => {
  const { app, token } = await signIn();
  const response = await app.inject({
    method: "GET",
    url: "/me",
    headers: { authorization: `Bearer ${token}` }
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.ok(body.profile.contacts.length > 0);
  await app.close();
});

test("GET /discovery returns sanitized public profiles only", async () => {
  const { app, token } = await signIn();
  const response = await app.inject({
    method: "GET",
    url: "/discovery?verifiedOnly=true&withMic=true",
    headers: { authorization: `Bearer ${token}` }
  });

  assert.equal(response.statusCode, 200);
  const body = response.json<{ profiles: Array<{ profile: Record<string, unknown> }> }>();
  assert.ok(body.profiles.length > 0);
  assert.equal("contacts" in body.profiles[0]!.profile, false);
  assert.equal(body.profiles.some((item) => item.profile.nickname === "hidden"), false);
  await app.close();
});

test("like action is idempotent and does not expose missing profiles", async () => {
  const { app, token } = await signIn();
  const first = await app.inject({
    method: "POST",
    url: "/profiles/profile_shadowclap/like",
    headers: { authorization: `Bearer ${token}` }
  });
  const second = await app.inject({
    method: "POST",
    url: "/profiles/profile_shadowclap/like",
    headers: { authorization: `Bearer ${token}` }
  });
  const hidden = await app.inject({
    method: "POST",
    url: "/profiles/profile_hidden/like",
    headers: { authorization: `Bearer ${token}` }
  });

  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.equal(hidden.statusCode, 404);
  await app.close();
});

test("new users can create a profile after OTP sign in", async () => {
  const { app, token } = await signIn("new-player@partyup.local");
  const created = await app.inject({
    method: "POST",
    url: "/me/profile",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      nickname: "fresh_player",
      displayName: "Fresh",
      age: 21,
      region: "EU West",
      bio: "Ищу стабильное пати для CS2, играю спокойно и с микрофоном.",
      languages: ["RU", "EN"],
      contacts: [],
      gameProfile: {
        role: "Rifler",
        elo: 1200,
        peakElo: null,
        maps: ["Mirage", "Inferno"],
        availability: "Вечером",
        hasMic: true,
        hours: null
      }
    }
  });
  const me = await app.inject({
    method: "GET",
    url: "/me",
    headers: { authorization: `Bearer ${token}` }
  });

  assert.equal(created.statusCode, 200);
  assert.equal(me.statusCode, 200);
  assert.equal(me.json<{ profile: { nickname: string } }>().profile.nickname, "fresh_player");
  await app.close();
});

test("likes and chats endpoints return sanitized summaries", async () => {
  const { app, token } = await signIn();
  await app.inject({
    method: "POST",
    url: "/profiles/profile_shadowclap/like",
    headers: { authorization: `Bearer ${token}` }
  });

  const outgoing = await app.inject({
    method: "GET",
    url: "/likes/outgoing",
    headers: { authorization: `Bearer ${token}` }
  });
  const chats = await app.inject({
    method: "GET",
    url: "/chats",
    headers: { authorization: `Bearer ${token}` }
  });

  assert.equal(outgoing.statusCode, 200);
  const body = outgoing.json<{ likes: Array<{ profile: Record<string, unknown> }> }>();
  assert.equal(body.likes.length, 1);
  assert.equal("contacts" in body.likes[0]!.profile, false);
  assert.equal(chats.statusCode, 200);
  await app.close();
});
