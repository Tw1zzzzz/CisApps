import {
  type ApplicationStatus,
  type DiscoveryFilters,
  type LikeSummaryDto,
  type LikeAction,
  type MatchSummaryDto,
  type OrganizationFeedItemDto,
  type OrganizationProfile,
  type PlayerProfile,
  type PrivateProfileDto,
  type RecruiterProfile,
  type TeamApplicationDto,
  type PublicDiscoveryProfileDto,
  type User,
  discoveryFiltersSchema,
  toPrivateProfileDto,
  toPublicDiscoveryProfile
} from "@party-up/domain";
import type { PartyUpApi, PartyUpAuthApi } from "./types";

const now = new Date("2026-05-17T12:00:00.000Z").toISOString();

let user: User = {
  id: "user_me",
  email: "demo@partyup.local",
  role: "admin",
  intent: "player",
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
  openToOrganizations: true,
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
    openToOrganizations: true,
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
    openToOrganizations: true,
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

let recruiterProfile: RecruiterProfile | null = null;
let myOrganization: OrganizationProfile | null = null;

const organizations: OrganizationProfile[] = [
  {
    id: "org_evening_mix",
    ownerUserId: "user_recruiter_mix",
    type: "mix",
    name: "Evening Mix",
    game: "cs2",
    region: "EU West",
    targetEloMin: 1200,
    targetEloMax: 2100,
    neededRoles: ["Rifler", "Support"],
    languages: ["RU", "EN"],
    description: "Микс на вечерние праки и премьер без токсичности.",
    isRecruiting: true,
    visibility: "visible",
    moderationStatus: "approved",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "org_anchor_stack",
    ownerUserId: "user_recruiter_stack",
    type: "stack",
    name: "Anchor Stack",
    game: "cs2",
    region: "EU East",
    targetEloMin: 1500,
    targetEloMax: 2600,
    neededRoles: ["AWPer", "Entry"],
    languages: ["RU"],
    description: "Стак ищет стабильных игроков под регулярные игры и разбор демо.",
    isRecruiting: true,
    visibility: "visible",
    moderationStatus: "approved",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "org_nova_team",
    ownerUserId: "user_recruiter_team",
    type: "team",
    name: "Nova Team",
    game: "cs2",
    region: "EU West",
    targetEloMin: 2000,
    targetEloMax: 3200,
    neededRoles: ["IGL", "Support"],
    languages: ["EN"],
    description: "Команда собирает основной ростер для лиг и тренировочного цикла.",
    isRecruiting: true,
    visibility: "visible",
    moderationStatus: "approved",
    createdAt: now,
    updatedAt: now
  }
];

let applications: TeamApplicationDto[] = [];

export const mockApi: PartyUpApi = {
  async getMe(): Promise<PrivateProfileDto> {
    return delay(toPrivateProfileDto(user, me));
  },
  async setUserIntent(input): Promise<User> {
    user = { ...user, intent: input.intent };
    return delay(user);
  },
  async createProfile(input): Promise<PrivateProfileDto> {
    me = {
      ...me,
      nickname: input.nickname ?? me.nickname,
      displayName: input.displayName ?? me.displayName,
      age: input.age ?? me.age,
      region: input.region ?? me.region,
      bio: input.bio ?? me.bio,
      languages: input.languages ?? me.languages,
      contacts: input.contacts ?? me.contacts,
      openToOrganizations: input.openToOrganizations ?? me.openToOrganizations,
      id: me.id,
      userId: me.userId,
      visibility: "visible",
      moderationStatus: "approved",
      isOnline: true,
      isVerified: false,
      providerAccounts: [],
      gameProfile: {
        ...me.gameProfile,
        role: input.gameProfile?.role ?? me.gameProfile.role,
        elo: input.gameProfile?.elo ?? me.gameProfile.elo,
        peakElo: input.gameProfile?.peakElo ?? me.gameProfile.peakElo,
        maps: input.gameProfile?.maps ?? me.gameProfile.maps,
        availability: input.gameProfile?.availability ?? me.gameProfile.availability,
        hasMic: input.gameProfile?.hasMic ?? me.gameProfile.hasMic,
        hours: input.gameProfile?.hours ?? me.gameProfile.hours,
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
      nickname: input.nickname ?? me.nickname,
      displayName: input.displayName ?? me.displayName,
      age: input.age ?? me.age,
      region: input.region ?? me.region,
      bio: input.bio ?? me.bio,
      languages: input.languages ?? me.languages,
      contacts: input.contacts ?? me.contacts,
      openToOrganizations: input.openToOrganizations ?? me.openToOrganizations,
      gameProfile: input.gameProfile
        ? {
            ...me.gameProfile,
            role: input.gameProfile.role ?? me.gameProfile.role,
            elo: input.gameProfile.elo ?? me.gameProfile.elo,
            peakElo: input.gameProfile.peakElo ?? me.gameProfile.peakElo,
            maps: input.gameProfile.maps ?? me.gameProfile.maps,
            availability: input.gameProfile.availability ?? me.gameProfile.availability,
            hasMic: input.gameProfile.hasMic ?? me.gameProfile.hasMic,
            hours: input.gameProfile.hours ?? me.gameProfile.hours,
            id: me.gameProfile.id,
            game: "cs2"
          }
        : me.gameProfile,
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
  },
  async createRecruiterProfile(input): Promise<RecruiterProfile> {
    recruiterProfile = {
      id: "recruiter_me",
      userId: user.id,
      role: input.role,
      displayName: input.displayName,
      contacts: input.contacts ?? [],
      createdAt: now,
      updatedAt: new Date().toISOString()
    };
    return delay(recruiterProfile);
  },
  async getRecruiterProfile(): Promise<RecruiterProfile | null> {
    return delay(recruiterProfile);
  },
  async createOrganization(input): Promise<OrganizationProfile> {
    myOrganization = {
      id: "org_me",
      ownerUserId: user.id,
      type: input.type,
      name: input.name,
      game: "cs2",
      region: input.region,
      targetEloMin: input.targetEloMin,
      targetEloMax: input.targetEloMax,
      neededRoles: input.neededRoles,
      languages: input.languages,
      description: input.description,
      isRecruiting: input.isRecruiting,
      visibility: "visible",
      moderationStatus: "approved",
      createdAt: now,
      updatedAt: new Date().toISOString()
    };
    organizations.unshift(myOrganization);
    return delay(myOrganization);
  },
  async updateOrganization(input): Promise<OrganizationProfile> {
    const current = myOrganization ?? organizations[0]!;
    myOrganization = {
      ...current,
      type: input.type ?? current.type,
      name: input.name ?? current.name,
      game: input.game ?? current.game,
      region: input.region ?? current.region,
      targetEloMin: input.targetEloMin ?? current.targetEloMin,
      targetEloMax: input.targetEloMax ?? current.targetEloMax,
      neededRoles: input.neededRoles ?? current.neededRoles,
      languages: input.languages ?? current.languages,
      description: input.description ?? current.description,
      isRecruiting: input.isRecruiting ?? current.isRecruiting,
      updatedAt: new Date().toISOString()
    };
    const index = organizations.findIndex((organization) => organization.id === myOrganization?.id);
    if (index >= 0 && myOrganization) organizations[index] = myOrganization;
    return delay(myOrganization);
  },
  async getMyOrganization(): Promise<OrganizationProfile | null> {
    return delay(myOrganization);
  },
  async getOrganizationFeed(): Promise<OrganizationFeedItemDto[]> {
    return delay(organizations
      .filter((organization) => organization.isRecruiting && organization.visibility === "visible" && organization.moderationStatus === "approved")
      .map((organization) => ({
        organization: toPublicOrganization(organization),
        applied: applications.some((application) => application.organization.id === organization.id)
      })));
  },
  async applyToOrganization(organizationId: string, message: string): Promise<TeamApplicationDto> {
    const existing = applications.find((application) => application.organization.id === organizationId && application.player.id === me.id);
    if (existing) return delay(existing);

    const organization = organizations.find((item) => item.id === organizationId);
    if (!organization) throw new Error("Organization not found.");
    const application = {
      id: `application_${organizationId}_${me.id}`,
      status: "pending" as ApplicationStatus,
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organization: toPublicOrganization(organization),
      player: toPublicDiscoveryProfile(me).profile
    };
    applications = [application, ...applications];
    return delay(application);
  },
  async getMyApplications(): Promise<TeamApplicationDto[]> {
    return delay(applications.filter((application) => application.player.id === me.id));
  },
  async getOrganizationApplications(): Promise<TeamApplicationDto[]> {
    const organizationId = myOrganization?.id;
    return delay(organizationId ? applications.filter((application) => application.organization.id === organizationId) : []);
  },
  async updateApplicationStatus(applicationId, status): Promise<TeamApplicationDto> {
    applications = applications.map((application) =>
      application.id === applicationId ? { ...application, status, updatedAt: new Date().toISOString() } : application
    );
    const application = applications.find((item) => item.id === applicationId);
    if (!application) throw new Error("Application not found.");
    return delay(application);
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

function toPublicOrganization(organization: OrganizationProfile) {
  return {
    id: organization.id,
    type: organization.type,
    name: organization.name,
    game: organization.game,
    region: organization.region,
    targetEloMin: organization.targetEloMin,
    targetEloMax: organization.targetEloMax,
    neededRoles: organization.neededRoles,
    languages: organization.languages,
    description: organization.description,
    isRecruiting: organization.isRecruiting
  };
}
