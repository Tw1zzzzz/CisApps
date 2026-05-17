import type { PlayerProfile, User } from "@party-up/domain";

const now = new Date("2026-05-17T12:00:00.000Z").toISOString();

export const seedUser: User = {
  id: "user_me",
  email: "demo@partyup.local",
  role: "player",
  createdAt: now
};

export const seedProfiles: PlayerProfile[] = [
  {
    id: "profile_me",
    userId: seedUser.id,
    nickname: "crowley",
    displayName: "Виталий",
    age: 22,
    region: "EU West",
    bio: "Rifler с подбегом. Ищу команду на ранги, играть могу почти каждый вечер.",
    languages: ["RU", "EN"],
    visibility: "visible",
    moderationStatus: "approved",
    isOnline: true,
    isVerified: true,
    avatarHue: 210,
    contacts: [
      { type: "telegram", value: "@crowley", isPrivate: true },
      { type: "steam", value: "crowley22", isPrivate: true },
      { type: "discord", value: "crowley#0099", isPrivate: true }
    ],
    providerAccounts: [
      {
        id: "provider_me_faceit",
        provider: "faceit",
        providerUserId: "faceit_crow1ey",
        nickname: "crow1ey",
        profileUrl: "https://faceit.com/en/players/crow1ey",
        verified: true,
        linkedAt: now
      }
    ],
    gameProfile: {
      id: "game_me",
      game: "cs2",
      role: "Rifler",
      elo: 1880,
      peakElo: 2010,
      maps: ["Mirage", "Inferno", "Anubis"],
      availability: "Вечером · 19-23",
      hasMic: true,
      hours: 1400
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile_shadowclap",
    userId: "user_shadowclap",
    nickname: "shadowclap",
    displayName: "Миша",
    age: 22,
    region: "EU West",
    bio: "Ищу пати в премьер. Калмовые коммсы, без рейджа. Тиммейт не психотерапевт.",
    languages: ["RU", "EN"],
    visibility: "visible",
    moderationStatus: "approved",
    isOnline: true,
    isVerified: true,
    avatarHue: 260,
    contacts: [{ type: "telegram", value: "@shadowclap", isPrivate: true }],
    providerAccounts: [
      {
        id: "provider_shadow_faceit",
        provider: "faceit",
        providerUserId: "faceit_sh4dowclap",
        nickname: "sh4dowclap",
        profileUrl: "https://faceit.com/en/players/sh4dowclap",
        verified: true,
        linkedAt: now
      }
    ],
    gameProfile: {
      id: "game_shadow",
      game: "cs2",
      role: "AWPer",
      elo: 2150,
      peakElo: 2280,
      maps: ["Mirage", "Inferno", "Ancient", "Anubis"],
      availability: "Вечером · 19-23",
      hasMic: true,
      hours: 1800
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile_mira",
    userId: "user_mira",
    nickname: "mira.exe",
    displayName: "Мира",
    age: 20,
    region: "EU East",
    bio: "Support-мейн. Дам флешку точно по времени. Ищу постоянное звено.",
    languages: ["RU"],
    visibility: "visible",
    moderationStatus: "approved",
    isOnline: true,
    isVerified: true,
    avatarHue: 320,
    contacts: [{ type: "telegram", value: "@mira_ex", isPrivate: true }],
    providerAccounts: [
      {
        id: "provider_mira_faceit",
        provider: "faceit",
        providerUserId: "faceit_miraex",
        nickname: "miraex",
        profileUrl: "https://faceit.com/en/players/miraex",
        verified: true,
        linkedAt: now
      }
    ],
    gameProfile: {
      id: "game_mira",
      game: "cs2",
      role: "Support",
      elo: 1450,
      peakElo: 1610,
      maps: ["Mirage", "Nuke", "Overpass"],
      availability: "Днем · 14-18",
      hasMic: true,
      hours: 1200
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile_hidden",
    userId: "user_hidden",
    nickname: "hidden",
    displayName: "Скрытый",
    age: 21,
    region: "CIS",
    bio: "This profile must not be returned in discovery.",
    languages: ["RU"],
    visibility: "hidden",
    moderationStatus: "approved",
    isOnline: true,
    isVerified: false,
    avatarHue: 0,
    contacts: [{ type: "telegram", value: "@hidden", isPrivate: true }],
    providerAccounts: [],
    gameProfile: {
      id: "game_hidden",
      game: "cs2",
      role: "Entry",
      elo: 1000,
      peakElo: null,
      maps: ["Dust2"],
      availability: "Ночью",
      hasMic: true,
      hours: null
    },
    createdAt: now,
    updatedAt: now
  }
];
