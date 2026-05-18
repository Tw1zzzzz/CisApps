import {
  discoveryFiltersSchema,
  toPrivateProfileDto,
  toPublicDiscoveryProfile,
  type CreateOrganizationInput,
  type CreateProfileInput,
  type CreateRecruiterProfileInput,
  type CreateTeamApplicationInput,
  type DiscoveryFilters,
  type OrganizationFeedItemDto,
  type OrganizationProfile,
  type LikeSummaryDto,
  type LikeAction,
  type Match,
  type MatchSummaryDto,
  type PlayerProfile,
  type PrivateProfileDto,
  type PublicOrganizationDto,
  type PublicDiscoveryProfileDto,
  type RecruiterProfile,
  type SetUserIntentInput,
  type TeamApplicationDto,
  type UpdateApplicationStatusInput,
  type UpdateOrganizationInput,
  type UpdateProfileInput,
  type User
} from "@party-up/domain";
import { HttpError } from "../http/errors.js";
import { seedProfiles, seedUser } from "./fixtures.js";

interface StoredOtp {
  email: string;
  otpHash: string;
  expiresAt: number;
}

interface StoredApplication {
  id: string;
  organizationId: string;
  playerProfileId: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
}

export interface PartyUpStore {
  requestOtp(email: string, otpHash: string): Promise<void>;
  verifyOtp(email: string, otpHash: string): Promise<User>;
  getUser(userId: string): Promise<User | null>;
  setUserIntent(userId: string, input: SetUserIntentInput): Promise<User>;
  getPrivateProfile(userId: string): Promise<PrivateProfileDto>;
  createProfile(userId: string, input: CreateProfileInput): Promise<PrivateProfileDto>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<PrivateProfileDto>;
  listDiscovery(userId: string, filters: DiscoveryFilters): Promise<PublicDiscoveryProfileDto[]>;
  recordLike(userId: string, targetProfileId: string, action: LikeAction): Promise<{ matched: boolean; match: Match | null }>;
  listLikes(userId: string, direction: "incoming" | "outgoing"): Promise<LikeSummaryDto[]>;
  listMatches(userId: string): Promise<MatchSummaryDto[]>;
  createRecruiterProfile(userId: string, input: CreateRecruiterProfileInput): Promise<RecruiterProfile>;
  getRecruiterProfile(userId: string): Promise<RecruiterProfile | null>;
  createOrganization(userId: string, input: CreateOrganizationInput): Promise<OrganizationProfile>;
  updateOrganization(userId: string, input: UpdateOrganizationInput): Promise<OrganizationProfile>;
  getMyOrganization(userId: string): Promise<OrganizationProfile | null>;
  listOrganizationFeed(userId: string): Promise<OrganizationFeedItemDto[]>;
  createTeamApplication(userId: string, organizationId: string, input: CreateTeamApplicationInput): Promise<TeamApplicationDto>;
  listMyApplications(userId: string): Promise<TeamApplicationDto[]>;
  listOrganizationApplications(userId: string): Promise<TeamApplicationDto[]>;
  updateApplicationStatus(userId: string, applicationId: string, input: UpdateApplicationStatusInput): Promise<TeamApplicationDto>;
}

export function createInMemoryStore(): PartyUpStore {
  const users = new Map<string, User>([[seedUser.id, seedUser]]);
  const profiles = new Map<string, PlayerProfile>(seedProfiles.map((profile) => [profile.id, structuredClone(profile)]));
  const profileByUser = new Map<string, PlayerProfile>(seedProfiles.map((profile) => [profile.userId, structuredClone(profile)]));
  const otps = new Map<string, StoredOtp>();
  const likes = new Map<string, { actorId: string; targetId: string; action: LikeAction }>();
  const matches = new Map<string, Match>();
  const recruiterProfiles = new Map<string, RecruiterProfile>();
  const organizations = new Map<string, OrganizationProfile>();
  const applications = new Map<string, StoredApplication>();

  return {
    async requestOtp(email, otpHash) {
      otps.set(email, {
        email,
        otpHash,
        expiresAt: Date.now() + 1000 * 60 * 10
      });
    },

    async verifyOtp(email, otpHash) {
      const stored = otps.get(email);
      if (!stored || stored.expiresAt < Date.now() || stored.otpHash !== otpHash) {
        throw new HttpError(401, "Invalid or expired OTP.");
      }
      otps.delete(email);

      const existing = [...users.values()].find((user) => user.email === email);
      if (existing) return existing;

      const user: User = {
        id: `user_${crypto.randomUUID()}`,
        email,
        role: "player",
        intent: null,
        createdAt: new Date().toISOString()
      };
      users.set(user.id, user);
      return user;
    },

    async getUser(userId) {
      return users.get(userId) ?? null;
    },

    async setUserIntent(userId, input) {
      const current = users.get(userId);
      if (!current) throw new HttpError(401, "Sign in to continue.");
      const updated = { ...current, intent: input.intent };
      users.set(userId, updated);
      return updated;
    },

    async getPrivateProfile(userId) {
      const user = users.get(userId);
      const profile = profileByUser.get(userId);
      if (!user || !profile) {
        throw new HttpError(404, "Profile not found.");
      }
      return toPrivateProfileDto(user, profile);
    },

    async createProfile(userId, input) {
      const user = users.get(userId);
      if (!user) {
        throw new HttpError(401, "Sign in to continue.");
      }
      if (profileByUser.has(userId)) {
        throw new HttpError(409, "Profile already exists.");
      }
      if ([...profiles.values()].some((profile) => profile.nickname === input.nickname)) {
        throw new HttpError(409, "Nickname is already taken.");
      }

      const now = new Date().toISOString();
      const profile: PlayerProfile = {
        id: `profile_${crypto.randomUUID()}`,
        userId,
        nickname: input.nickname,
        displayName: input.displayName,
        age: input.age,
        region: input.region,
        bio: input.bio,
        languages: input.languages,
        visibility: "visible",
        moderationStatus: "approved",
        isOnline: true,
        isVerified: false,
        openToOrganizations: input.openToOrganizations,
        avatarHue: hueFromString(input.nickname),
        contacts: input.contacts,
        providerAccounts: [],
        gameProfile: {
          id: `game_${crypto.randomUUID()}`,
          game: "cs2",
          ...input.gameProfile
        },
        createdAt: now,
        updatedAt: now
      };

      profiles.set(profile.id, profile);
      profileByUser.set(userId, profile);
      return toPrivateProfileDto(user, profile);
    },

    async updateProfile(userId, input) {
      const current = profileByUser.get(userId);
      const user = users.get(userId);
      if (!current || !user) {
        throw new HttpError(404, "Profile not found.");
      }

      const updatedGameProfile = { ...current.gameProfile };
      if (input.gameProfile?.role !== undefined) updatedGameProfile.role = input.gameProfile.role;
      if (input.gameProfile?.elo !== undefined) updatedGameProfile.elo = input.gameProfile.elo;
      if (input.gameProfile?.peakElo !== undefined) updatedGameProfile.peakElo = input.gameProfile.peakElo;
      if (input.gameProfile?.maps !== undefined) updatedGameProfile.maps = input.gameProfile.maps;
      if (input.gameProfile?.availability !== undefined) updatedGameProfile.availability = input.gameProfile.availability;
      if (input.gameProfile?.hasMic !== undefined) updatedGameProfile.hasMic = input.gameProfile.hasMic;
      if (input.gameProfile?.hours !== undefined) updatedGameProfile.hours = input.gameProfile.hours;

      const updated: PlayerProfile = {
        ...current,
        nickname: input.nickname ?? current.nickname,
        displayName: input.displayName ?? current.displayName,
        age: input.age ?? current.age,
        region: input.region ?? current.region,
        bio: input.bio ?? current.bio,
        contacts: input.contacts ?? current.contacts,
        languages: input.languages ?? current.languages,
        openToOrganizations: input.openToOrganizations ?? current.openToOrganizations,
        gameProfile: updatedGameProfile,
        updatedAt: new Date().toISOString()
      };

      profiles.set(updated.id, updated);
      profileByUser.set(userId, updated);
      return toPrivateProfileDto(user, updated);
    },

    async listDiscovery(userId, filters) {
      const parsed = discoveryFiltersSchema.parse(filters);
      return [...profiles.values()]
        .filter((profile) => profile.userId !== userId)
        .filter((profile) => profile.visibility === "visible")
        .filter((profile) => profile.moderationStatus === "approved")
        .filter((profile) => parsed.region === "EU+CIS" || profile.region === parsed.region)
        .filter((profile) => parsed.role === "all" || profile.gameProfile.role === parsed.role)
        .filter((profile) => profile.age >= parsed.ageMin && profile.age <= parsed.ageMax)
        .filter((profile) => profile.gameProfile.elo >= parsed.eloMin && profile.gameProfile.elo <= parsed.eloMax)
        .filter((profile) => !parsed.onlyOnline || profile.isOnline)
        .filter((profile) => !parsed.withMic || profile.gameProfile.hasMic)
        .filter((profile) => !parsed.verifiedOnly || profile.isVerified)
        .filter((profile) => parsed.maps.length === 0 || parsed.maps.some((map) => profile.gameProfile.maps.includes(map)))
        .map(toPublicDiscoveryProfile);
    },

    async recordLike(userId, targetProfileId, action) {
      const actorProfile = profileByUser.get(userId);
      const target = profiles.get(targetProfileId);
      if (!actorProfile || !target) {
        throw new HttpError(404, "Profile not found.");
      }
      if (target.visibility !== "visible" || target.moderationStatus !== "approved") {
        throw new HttpError(404, "Profile not found.");
      }

      likes.set(`${userId}:${target.userId}`, {
        actorId: userId,
        targetId: target.userId,
        action
      });

      const reciprocal = likes.get(`${target.userId}:${userId}`);
      const matched = action !== "pass" && reciprocal?.action !== "pass" && Boolean(reciprocal);
      if (!matched) {
        return { matched: false, match: null };
      }

      const sortedUserIds = [userId, target.userId].sort();
      const userAId = sortedUserIds[0]!;
      const userBId = sortedUserIds[1]!;
      const key = `${userAId}:${userBId}`;
      const existing = matches.get(key);
      if (existing) return { matched: true, match: existing };

      const match: Match = {
        id: `match_${crypto.randomUUID()}`,
        userAId,
        userBId,
        createdAt: new Date().toISOString()
      };
      matches.set(key, match);
      return { matched: true, match };
    },

    async listLikes(userId, direction) {
      const rows = [...likes.entries()]
        .map(([id, like]) => ({ id, ...like }))
        .filter((like) => like.action !== "pass")
        .filter((like) => direction === "incoming" ? like.targetId === userId : like.actorId === userId);

      return rows.flatMap((like) => {
        const otherUserId = direction === "incoming" ? like.actorId : like.targetId;
        const profile = profileByUser.get(otherUserId);
        if (!profile || profile.visibility !== "visible" || profile.moderationStatus !== "approved") return [];
        return [{
          id: like.id,
          action: like.action as Exclude<LikeAction, "pass">,
          createdAt: new Date().toISOString(),
          profile: toPublicDiscoveryProfile(profile).profile
        }];
      });
    },

    async listMatches(userId) {
      return [...matches.values()]
        .filter((match) => match.userAId === userId || match.userBId === userId)
        .flatMap((match) => {
          const otherUserId = match.userAId === userId ? match.userBId : match.userAId;
          const profile = profileByUser.get(otherUserId);
          if (!profile || profile.visibility !== "visible" || profile.moderationStatus !== "approved") return [];
          return [{
            id: match.id,
            createdAt: match.createdAt,
            profile: toPublicDiscoveryProfile(profile).profile,
            unreadCount: 0,
            lastMessage: null
          }];
        });
    },

    async createRecruiterProfile(userId, input) {
      const user = users.get(userId);
      if (!user) throw new HttpError(401, "Sign in to continue.");
      const existing = recruiterProfiles.get(userId);
      if (existing) throw new HttpError(409, "Recruiter profile already exists.");

      const now = new Date().toISOString();
      const profile: RecruiterProfile = {
        id: `recruiter_${crypto.randomUUID()}`,
        userId,
        role: input.role,
        displayName: input.displayName,
        contacts: input.contacts,
        createdAt: now,
        updatedAt: now
      };
      recruiterProfiles.set(userId, profile);
      users.set(userId, { ...user, intent: "recruiter" });
      return profile;
    },

    async getRecruiterProfile(userId) {
      const profile = recruiterProfiles.get(userId);
      return profile ?? null;
    },

    async createOrganization(userId, input) {
      if (!recruiterProfiles.has(userId)) throw new HttpError(404, "Recruiter profile not found.");
      if ([...organizations.values()].some((organization) => organization.ownerUserId === userId)) {
        throw new HttpError(409, "Organization already exists.");
      }

      const now = new Date().toISOString();
      const organization: OrganizationProfile = {
        id: `org_${crypto.randomUUID()}`,
        ownerUserId: userId,
        type: input.type,
        name: input.name,
        game: input.game,
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
        updatedAt: now
      };
      organizations.set(organization.id, organization);
      return organization;
    },

    async updateOrganization(userId, input) {
      const current = [...organizations.values()].find((organization) => organization.ownerUserId === userId);
      if (!current) throw new HttpError(404, "Organization not found.");
      const updated: OrganizationProfile = {
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
      organizations.set(updated.id, updated);
      return updated;
    },

    async getMyOrganization(userId) {
      const organization = [...organizations.values()].find((item) => item.ownerUserId === userId);
      return organization ?? null;
    },

    async listOrganizationFeed(userId) {
      const player = profileByUser.get(userId);
      return [...organizations.values()]
        .filter((organization) => organization.isRecruiting)
        .filter((organization) => organization.visibility === "visible")
        .filter((organization) => organization.moderationStatus === "approved")
        .map((organization) => ({
          organization: toPublicOrganization(organization),
          applied: player ? [...applications.values()].some((application) => application.organizationId === organization.id && application.playerProfileId === player.id) : false
        }));
    },

    async createTeamApplication(userId, organizationId, input) {
      const player = profileByUser.get(userId);
      if (!player || !player.openToOrganizations) throw new HttpError(404, "Profile not found.");
      const organization = organizations.get(organizationId);
      if (!organization || organization.visibility !== "visible" || organization.moderationStatus !== "approved") {
        throw new HttpError(404, "Organization not found.");
      }

      const existing = [...applications.values()].find((application) => application.organizationId === organizationId && application.playerProfileId === player.id);
      if (existing) return applicationDto(existing);

      const now = new Date().toISOString();
      const application: StoredApplication = {
        id: `application_${crypto.randomUUID()}`,
        organizationId,
        playerProfileId: player.id,
        message: input.message,
        status: "pending",
        createdAt: now,
        updatedAt: now
      };
      applications.set(application.id, application);
      return applicationDto(application);
    },

    async listMyApplications(userId) {
      const player = profileByUser.get(userId);
      if (!player) return [];
      return [...applications.values()]
        .filter((application) => application.playerProfileId === player.id)
        .map(applicationDto);
    },

    async listOrganizationApplications(userId) {
      const organization = [...organizations.values()].find((item) => item.ownerUserId === userId);
      if (!organization) return [];
      return [...applications.values()]
        .filter((application) => application.organizationId === organization.id)
        .filter((application) => {
          const player = [...profiles.values()].find((profile) => profile.id === application.playerProfileId);
          return player?.openToOrganizations === true;
        })
        .map(applicationDto);
    },

    async updateApplicationStatus(userId, applicationId, input) {
      const organization = [...organizations.values()].find((item) => item.ownerUserId === userId);
      if (!organization) throw new HttpError(404, "Organization not found.");
      const current = applications.get(applicationId);
      if (!current || current.organizationId !== organization.id) throw new HttpError(404, "Application not found.");
      const updated = {
        ...current,
        status: input.status,
        updatedAt: new Date().toISOString()
      };
      applications.set(updated.id, updated);
      return applicationDto(updated);
    }
  };

  function applicationDto(application: StoredApplication): TeamApplicationDto {
    const organization = organizations.get(application.organizationId);
    const player = [...profiles.values()].find((profile) => profile.id === application.playerProfileId);
    if (!organization || !player) throw new HttpError(404, "Application not found.");

    return {
      id: application.id,
      status: application.status,
      message: application.message,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      organization: toPublicOrganization(organization),
      player: toPublicDiscoveryProfile(player).profile
    };
  }
}

function toPublicOrganization(organization: OrganizationProfile): PublicOrganizationDto {
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

function hueFromString(value: string): number {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}
