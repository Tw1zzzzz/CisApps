import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LikeAction,
  ModerationStatus,
  ProfileVisibility,
  Provider,
  UserRole
} from "@prisma/client";
import { toPublicDiscoveryProfile } from "@party-up/domain";
import {
  toDomainLikeAction,
  toDomainPlayerProfile,
  toDomainUser,
  toPrismaLikeAction,
  type PrismaPlayerProfileWithRelations
} from "./prismaMappers.js";

const createdAt = new Date("2026-05-17T12:00:00.000Z");
const updatedAt = new Date("2026-05-17T12:30:00.000Z");

test("maps Prisma enum casing and dates into domain DTOs", () => {
  const user = toDomainUser({
    id: "user_1",
    email: "demo@partyup.local",
    role: UserRole.ADMIN,
    createdAt,
    updatedAt
  });

  assert.deepEqual(user, {
    id: "user_1",
    email: "demo@partyup.local",
    role: "admin",
    createdAt: "2026-05-17T12:00:00.000Z"
  });
  assert.equal(toDomainLikeAction(LikeAction.SUPER_LIKE), "super-like");
  assert.equal(toPrismaLikeAction("pass"), LikeAction.PASS);
});

test("maps Prisma profile relations and keeps public discovery sanitized", () => {
  const profile = toDomainPlayerProfile({
    id: "profile_1",
    userId: "user_1",
    nickname: "crowley",
    displayName: "Виталий",
    age: 22,
    region: "EU West",
    bio: "Rifler с подбегом. Ищу команду почти каждый вечер.",
    languages: ["RU", "EN"],
    visibility: ProfileVisibility.VISIBLE,
    moderationStatus: ModerationStatus.APPROVED,
    isOnline: true,
    isVerified: true,
    avatarHue: 210,
    createdAt,
    updatedAt,
    gameProfile: {
      id: "game_1",
      profileId: "profile_1",
      game: "cs2",
      role: "Rifler",
      elo: 1880,
      peakElo: 2010,
      maps: ["Mirage", "Inferno"],
      availability: "Вечером",
      hasMic: true,
      hours: 1400
    },
    contacts: [
      {
        id: "contact_1",
        profileId: "profile_1",
        type: "telegram",
        value: "@crowley",
        isPrivate: true
      }
    ],
    providerAccounts: [
      {
        id: "provider_1",
        profileId: "profile_1",
        provider: Provider.FACEIT,
        providerUserId: "faceit_crowley",
        nickname: "crow1ey",
        profileUrl: "https://faceit.com/en/players/crow1ey",
        verified: true,
        linkedAt: createdAt
      }
    ]
  } satisfies PrismaPlayerProfileWithRelations);

  assert.equal(profile.visibility, "visible");
  assert.equal(profile.moderationStatus, "approved");
  assert.equal(profile.createdAt, "2026-05-17T12:00:00.000Z");
  assert.equal(profile.gameProfile.role, "Rifler");
  assert.equal(profile.providerAccounts[0]?.provider, "faceit");

  const publicDto = toPublicDiscoveryProfile(profile);
  assert.equal("contacts" in publicDto.profile, false);
  assert.deepEqual(publicDto.profile.faceit, {
    nickname: "crow1ey",
    profileUrl: "https://faceit.com/en/players/crow1ey",
    verified: true
  });
});

