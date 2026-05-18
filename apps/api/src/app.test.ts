import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./app.js";

type TestApp = Awaited<ReturnType<typeof buildApp>>;

async function signIn(email = "demo@partyup.local", existingApp?: TestApp) {
  const app = existingApp ?? await buildApp();
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

test("user can choose recruiter intent and create organization", async () => {
  const { app, token } = await signIn("recruiter-flow@partyup.local");
  const intent = await app.inject({
    method: "PATCH",
    url: "/me/intent",
    headers: { authorization: `Bearer ${token}` },
    payload: { intent: "recruiter" }
  });
  const recruiter = await app.inject({
    method: "POST",
    url: "/me/recruiter-profile",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      role: "manager",
      displayName: "Recruiter",
      contacts: []
    }
  });
  const organization = await app.inject({
    method: "POST",
    url: "/me/organization",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      type: "team",
      name: "Flow Team",
      region: "EU West",
      targetEloMin: 1200,
      targetEloMax: 2200,
      neededRoles: ["Rifler", "Support"],
      languages: ["RU", "EN"],
      description: "Ищем игроков в основной состав для регулярных тренировок.",
      isRecruiting: true
    }
  });

  assert.equal(intent.statusCode, 200);
  assert.equal(intent.json<{ user: { intent: string } }>().user.intent, "recruiter");
  assert.equal(recruiter.statusCode, 200);
  assert.equal(organization.statusCode, 200);
  assert.equal(organization.json<{ organization: { name: string } }>().organization.name, "Flow Team");
  await app.close();
});

test("players can see organization feed and apply once", async () => {
  const app = await buildApp();
  const recruiterSession = await signIn("recruiter-apps@partyup.local", app);
  await app.inject({
    method: "POST",
    url: "/me/recruiter-profile",
    headers: { authorization: `Bearer ${recruiterSession.token}` },
    payload: { role: "coach", displayName: "Coach", contacts: [] }
  });
  const createdOrg = await app.inject({
    method: "POST",
    url: "/me/organization",
    headers: { authorization: `Bearer ${recruiterSession.token}` },
    payload: {
      type: "stack",
      name: "Apply Stack",
      region: "EU West",
      targetEloMin: 1000,
      targetEloMax: 2400,
      neededRoles: ["AWPer"],
      languages: ["RU"],
      description: "Стак ищет AWP для вечерних игр и праков.",
      isRecruiting: true
    }
  });
  const orgId = createdOrg.json<{ organization: { id: string } }>().organization.id;

  const { token } = await signIn(undefined, app);
  const feed = await app.inject({
    method: "GET",
    url: "/organizations/feed",
    headers: { authorization: `Bearer ${token}` }
  });
  const firstApplication = await app.inject({
    method: "POST",
    url: `/organizations/${orgId}/apply`,
    headers: { authorization: `Bearer ${token}` },
    payload: { message: "Готов сыграть тестовую." }
  });
  const secondApplication = await app.inject({
    method: "POST",
    url: `/organizations/${orgId}/apply`,
    headers: { authorization: `Bearer ${token}` },
    payload: { message: "Повтор." }
  });

  assert.equal(feed.statusCode, 200);
  assert.equal(feed.json<{ organizations: Array<{ organization: Record<string, unknown> }> }>().organizations.length > 0, true);
  assert.equal(firstApplication.statusCode, 200);
  assert.equal(secondApplication.statusCode, 200);
  assert.equal(firstApplication.json<{ application: { id: string } }>().application.id, secondApplication.json<{ application: { id: string } }>().application.id);
  await app.close();
});

test("recruiter can review and update incoming application status", async () => {
  const app = await buildApp();
  const recruiterSession = await signIn("reviewer@partyup.local", app);
  await app.inject({
    method: "POST",
    url: "/me/recruiter-profile",
    headers: { authorization: `Bearer ${recruiterSession.token}` },
    payload: { role: "analyst", displayName: "Reviewer", contacts: [] }
  });
  const createdOrg = await app.inject({
    method: "POST",
    url: "/me/organization",
    headers: { authorization: `Bearer ${recruiterSession.token}` },
    payload: {
      type: "mix",
      name: "Review Mix",
      region: "EU West",
      targetEloMin: 1000,
      targetEloMax: 2000,
      neededRoles: ["Entry"],
      languages: ["RU"],
      description: "Микс проверяет заявки игроков без раскрытия приватных контактов.",
      isRecruiting: true
    }
  });
  const orgId = createdOrg.json<{ organization: { id: string } }>().organization.id;

  const playerSession = await signIn(undefined, app);
  await app.inject({
    method: "POST",
    url: `/organizations/${orgId}/apply`,
    headers: { authorization: `Bearer ${playerSession.token}` },
    payload: { message: "Могу entry." }
  });

  const incoming = await app.inject({
    method: "GET",
    url: "/organization/applications",
    headers: { authorization: `Bearer ${recruiterSession.token}` }
  });
  const application = incoming.json<{ applications: Array<{ id: string; player: Record<string, unknown> }> }>().applications[0]!;
  const updated = await app.inject({
    method: "PATCH",
    url: `/organization/applications/${application.id}/status`,
    headers: { authorization: `Bearer ${recruiterSession.token}` },
    payload: { status: "accepted" }
  });

  assert.equal(incoming.statusCode, 200);
  assert.equal("contacts" in application.player, false);
  assert.equal(updated.statusCode, 200);
  assert.equal(updated.json<{ application: { status: string } }>().application.status, "accepted");
  await app.close();
});
