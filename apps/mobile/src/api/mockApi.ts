import {
  type DiscoveryFilters,
  type LikeSummaryDto,
  type LikeAction,
  type MatchSummaryDto,
  type PlayerProfile,
  type PrivateProfileDto,
  type PublicDiscoveryProfileDto,
  type User,
  discoveryFiltersSchema,
  toPrivateProfileDto,
  toPublicDiscoveryProfile
} from "@party-up/domain";
import type { PartyUpApi, PartyUpAuthApi } from "./types";

const now = new Date("2026-05-17T12:00:00.000Z").toISOString();

const user: User = {
  id: "user_me",
  email: "demo@partyup.local",
  role: "admin",
  createdAt: now
};

let me: PlayerProfile = {
  id: "profile_me",
  userId: user.id,
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
};

const discoveryProfiles: PlayerProfile[] = [
  {
    id: "profile_shadowclap",
    userId: "user_shadowclap",
    nickname: "shadowclap",
    displayName: "Миша",
    age: 22,
    region: "EU West",
    bio: "Ищу пати в премьер. Калмовые коммсы, без рейджа.",
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
    providerAccounts: [],
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
  }
];

export const mockApi: PartyUpApi = {
  async getMe(): Promise<PrivateProfileDto> {
    return delay(toPrivateProfileDto(user, me));
  },
  async createProfile(input): Promise<PrivateProfileDto> {
    const data = typeof input === "object" && input ? input as Partial<PlayerProfile> : {};
    const gameProfile = typeof data.gameProfile === "object" && data.gameProfile ? data.gameProfile : {};
    me = {
      ...me,
      ...data,
      id: me.id,
      userId: me.userId,
      visibility: "visible",
      moderationStatus: "approved",
      isOnline: true,
      isVerified: false,
      providerAccounts: [],
      gameProfile: {
        ...me.gameProfile,
        ...gameProfile,
        id: me.gameProfile.id,
        game: "cs2"
      },
      updatedAt: new Date().toISOString()
    };
    return delay(toPrivateProfileDto(user, me));
  },
  async updateProfile(input): Promise<PrivateProfileDto> {
    me = {
      ...me,
      ...(typeof input === "object" && input ? input : {}),
      updatedAt: new Date().toISOString()
    };
    return delay(toPrivateProfileDto(user, me));
  },
  async getDiscovery(filters: DiscoveryFilters): Promise<PublicDiscoveryProfileDto[]> {
    const parsed = discoveryFiltersSchema.parse(filters);
    const filtered = discoveryProfiles
      .filter((profile) => parsed.region === "EU+CIS" || profile.region === parsed.region)
      .filter((profile) => parsed.role === "all" || profile.gameProfile.role === parsed.role)
      .filter((profile) => profile.gameProfile.elo >= parsed.eloMin && profile.gameProfile.elo <= parsed.eloMax)
      .filter((profile) => !parsed.onlyOnline || profile.isOnline)
      .filter((profile) => !parsed.withMic || profile.gameProfile.hasMic)
      .filter((profile) => !parsed.verifiedOnly || profile.isVerified)
      .map(toPublicDiscoveryProfile);

    return delay(filtered);
  },
  async sendLike(_profileId: string, action: LikeAction): Promise<{ matched: boolean }> {
    return delay({ matched: action !== "pass" && Math.random() > 0.45 });
  },
  async getLikes(direction: "incoming" | "outgoing"): Promise<LikeSummaryDto[]> {
    return delay(discoveryProfiles.map((profile, index) => ({
      id: `${direction}_${profile.id}`,
      action: index === 0 ? "super-like" : "like",
      createdAt: now,
      profile: toPublicDiscoveryProfile(profile).profile
    })));
  },
  async getChats(): Promise<MatchSummaryDto[]> {
    return delay(discoveryProfiles.slice(0, 2).map((profile, index) => ({
      id: `match_${profile.id}`,
      createdAt: now,
      profile: toPublicDiscoveryProfile(profile).profile,
      unreadCount: index === 0 ? 1 : 0,
      lastMessage: index === 0 ? "Новый мэтч" : null
    })));
  }
};

export const mockAuthApi: PartyUpAuthApi = {
  async requestOtp(): Promise<{ ok: true; devOtp: string }> {
    return delay({ ok: true, devOtp: "000000" });
  },
  async verifyOtp(_email: string, otp: string): Promise<{ token: string; user: User }> {
    if (otp !== "000000") {
      throw new Error("Invalid mock OTP.");
    }
    return delay({ token: "mock-token", user });
  }
};

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 250));
}
