import { ApplicationStatus as PrismaApplicationStatus, LikeAction as PrismaLikeAction, ModerationStatus, ProfileVisibility, type Prisma, type PrismaClient } from "@prisma/client";
import {
  discoveryFiltersSchema,
  toPrivateProfileDto,
  toPublicDiscoveryProfile,
  type CreateOrganizationInput,
  type CreateProfileInput,
  type CreateRecruiterProfileInput,
  type CreateTeamApplicationInput,
  type DiscoveryFilters,
  type LikeAction,
  type LikeSummaryDto,
  type Match,
  type MatchSummaryDto,
  type OrganizationFeedItemDto,
  type OrganizationProfile,
  type PrivateProfileDto,
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
import type { PartyUpStore } from "./inMemoryStore.js";
import {
  playerProfileInclude,
  toDomainApplicationStatus,
  toDomainOrganizationProfile,
  toDomainMatch,
  toDomainPlayerProfile,
  toDomainRecruiterProfile,
  toDomainUser,
  toPrismaApplicationStatus,
  toPrismaLikeAction,
  toPrismaModerationStatus,
  toPrismaOrganizationType,
  toPrismaRecruiterRole,
  toPrismaUserIntent,
  toPublicOrganizationDto
} from "./prismaMappers.js";

const OTP_TTL_MS = 1000 * 60 * 10;

export function createPrismaStore(prisma: PrismaClient): PartyUpStore {
  async function getPrivateProfile(userId: string): Promise<PrivateProfileDto> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
      include: playerProfileInclude
    });

    if (!user || !profile) {
      throw new HttpError(404, "Profile not found.");
    }

    return toPrivateProfileDto(toDomainUser(user), toDomainPlayerProfile(profile));
  }

  return {
    async requestOtp(email, otpHash) {
      await prisma.otpChallenge.upsert({
        where: { email },
        create: {
          email,
          otpHash,
          expiresAt: new Date(Date.now() + OTP_TTL_MS)
        },
        update: {
          otpHash,
          expiresAt: new Date(Date.now() + OTP_TTL_MS)
        }
      });
    },

    async verifyOtp(email, otpHash): Promise<User> {
      const stored = await prisma.otpChallenge.findUnique({ where: { email } });
      if (!stored || stored.expiresAt.getTime() < Date.now() || stored.otpHash !== otpHash) {
        throw new HttpError(401, "Invalid or expired OTP.");
      }

      await prisma.otpChallenge.delete({ where: { email } });

      const user = await prisma.user.upsert({
        where: { email },
        create: { email },
        update: {}
      });
      return toDomainUser(user);
    },

    async getUser(userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user ? toDomainUser(user) : null;
    },

    async setUserIntent(userId, input: SetUserIntentInput): Promise<User> {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { intent: toPrismaUserIntent(input.intent) }
      });
      return toDomainUser(user);
    },

    getPrivateProfile,

    async createProfile(userId, input: CreateProfileInput): Promise<PrivateProfileDto> {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new HttpError(401, "Sign in to continue.");
      }

      const existingForUser = await prisma.playerProfile.findUnique({ where: { userId } });
      if (existingForUser) {
        throw new HttpError(409, "Profile already exists.");
      }

      const existingNickname = await prisma.playerProfile.findUnique({ where: { nickname: input.nickname } });
      if (existingNickname) {
        throw new HttpError(409, "Nickname is already taken.");
      }

      const profile = await prisma.playerProfile.create({
        data: {
          userId,
          nickname: input.nickname,
          displayName: input.displayName,
          age: input.age,
          region: input.region,
          bio: input.bio,
          languages: input.languages,
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED,
          isOnline: true,
          isVerified: false,
          openToOrganizations: input.openToOrganizations,
          avatarHue: hueFromString(input.nickname),
          contacts: {
            create: input.contacts
          },
          gameProfile: {
            create: {
              game: "cs2",
              role: input.gameProfile.role,
              elo: input.gameProfile.elo,
              peakElo: input.gameProfile.peakElo,
              maps: input.gameProfile.maps,
              availability: input.gameProfile.availability,
              hasMic: input.gameProfile.hasMic,
              hours: input.gameProfile.hours
            }
          }
        },
        include: playerProfileInclude
      });

      return toPrivateProfileDto(toDomainUser(user), toDomainPlayerProfile(profile));
    },

    async updateProfile(userId, input: UpdateProfileInput): Promise<PrivateProfileDto> {
      const current = await prisma.playerProfile.findUnique({ where: { userId } });
      if (!current) {
        throw new HttpError(404, "Profile not found.");
      }

      await prisma.$transaction(async (tx) => {
        const profileData: Prisma.PlayerProfileUpdateInput = {};
        if (input.nickname !== undefined) profileData.nickname = input.nickname;
        if (input.displayName !== undefined) profileData.displayName = input.displayName;
        if (input.age !== undefined) profileData.age = input.age;
        if (input.region !== undefined) profileData.region = input.region;
        if (input.bio !== undefined) profileData.bio = input.bio;
        if (input.languages !== undefined) profileData.languages = input.languages;
        if (input.openToOrganizations !== undefined) profileData.openToOrganizations = input.openToOrganizations;
        if (input.contacts !== undefined) {
          profileData.contacts = {
            deleteMany: {},
            create: input.contacts
          };
        }

        await tx.playerProfile.update({
          where: { userId },
          data: profileData
        });

        if (input.gameProfile) {
          const gameProfileData: Prisma.GameProfileUpdateInput = {};
          if (input.gameProfile.role !== undefined) gameProfileData.role = input.gameProfile.role;
          if (input.gameProfile.elo !== undefined) gameProfileData.elo = input.gameProfile.elo;
          if (input.gameProfile.peakElo !== undefined) gameProfileData.peakElo = input.gameProfile.peakElo;
          if (input.gameProfile.maps !== undefined) gameProfileData.maps = input.gameProfile.maps;
          if (input.gameProfile.availability !== undefined) gameProfileData.availability = input.gameProfile.availability;
          if (input.gameProfile.hasMic !== undefined) gameProfileData.hasMic = input.gameProfile.hasMic;
          if (input.gameProfile.hours !== undefined) gameProfileData.hours = input.gameProfile.hours;

          await tx.gameProfile.update({
            where: { profileId: current.id },
            data: gameProfileData
          });
        }
      });

      return getPrivateProfile(userId);
    },

    async listDiscovery(userId, filters: DiscoveryFilters): Promise<PublicDiscoveryProfileDto[]> {
      const parsed = discoveryFiltersSchema.parse(filters);
      const gameProfileWhere: Prisma.GameProfileWhereInput = {
        elo: { gte: parsed.eloMin, lte: parsed.eloMax }
      };
      if (parsed.role !== "all") gameProfileWhere.role = parsed.role;
      if (parsed.withMic) gameProfileWhere.hasMic = true;
      if (parsed.maps.length > 0) gameProfileWhere.maps = { hasSome: parsed.maps };

      const where: Prisma.PlayerProfileWhereInput = {
        userId: { not: userId },
        visibility: ProfileVisibility.VISIBLE,
        moderationStatus: ModerationStatus.APPROVED,
        age: { gte: parsed.ageMin, lte: parsed.ageMax },
        gameProfile: gameProfileWhere
      };
      if (parsed.region !== "EU+CIS") where.region = parsed.region;
      if (parsed.onlyOnline) where.isOnline = true;
      if (parsed.verifiedOnly) where.isVerified = true;

      const profiles = await prisma.playerProfile.findMany({
        where,
        include: playerProfileInclude,
        orderBy: [{ isOnline: "desc" }, { updatedAt: "desc" }],
        take: 50
      });

      return profiles.map((profile) => toPublicDiscoveryProfile(toDomainPlayerProfile(profile)));
    },

    async recordLike(userId, targetProfileId, action: LikeAction): Promise<{ matched: boolean; match: Match | null }> {
      const actorProfile = await prisma.playerProfile.findUnique({ where: { userId } });
      const target = await prisma.playerProfile.findFirst({
        where: {
          id: targetProfileId,
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        }
      });

      if (!actorProfile || !target) {
        throw new HttpError(404, "Profile not found.");
      }

      const prismaAction = toPrismaLikeAction(action);

      await prisma.like.upsert({
        where: {
          actorId_targetId: {
            actorId: userId,
            targetId: target.userId
          }
        },
        create: {
          actorId: userId,
          targetId: target.userId,
          action: prismaAction
        },
        update: {
          action: prismaAction
        }
      });

      const reciprocal = await prisma.like.findUnique({
        where: {
          actorId_targetId: {
            actorId: target.userId,
            targetId: userId
          }
        }
      });
      const matched = action !== "pass" && reciprocal?.action !== PrismaLikeAction.PASS && Boolean(reciprocal);
      if (!matched) {
        return { matched: false, match: null };
      }

      const [userAId, userBId] = [userId, target.userId].sort() as [string, string];
      const match = await prisma.match.upsert({
        where: {
          userAId_userBId: {
            userAId,
            userBId
          }
        },
        create: {
          userAId,
          userBId
        },
        update: {}
      });

      return { matched: true, match: toDomainMatch(match) };
    },

    async listLikes(userId, direction): Promise<LikeSummaryDto[]> {
      const likes = await prisma.like.findMany({
        where: {
          action: { not: PrismaLikeAction.PASS },
          ...(direction === "incoming" ? { targetId: userId } : { actorId: userId })
        },
        orderBy: { createdAt: "desc" },
        take: 50
      });
      const otherUserIds = likes.map((like) => direction === "incoming" ? like.actorId : like.targetId);
      const profiles = await prisma.playerProfile.findMany({
        where: {
          userId: { in: otherUserIds },
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        },
        include: playerProfileInclude
      });
      const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

      return likes.flatMap((like) => {
        const profile = profileByUserId.get(direction === "incoming" ? like.actorId : like.targetId);
        if (!profile || like.action === PrismaLikeAction.PASS) return [];
        return [{
          id: like.id,
          action: like.action === PrismaLikeAction.SUPER_LIKE ? "super-like" : "like",
          createdAt: like.createdAt.toISOString(),
          profile: toPublicDiscoveryProfile(toDomainPlayerProfile(profile)).profile
        }];
      });
    },

    async listMatches(userId): Promise<MatchSummaryDto[]> {
      const matches = await prisma.match.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }]
        },
        orderBy: { createdAt: "desc" },
        take: 50
      });
      const otherUserIds = matches.map((match) => match.userAId === userId ? match.userBId : match.userAId);
      const profiles = await prisma.playerProfile.findMany({
        where: {
          userId: { in: otherUserIds },
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        },
        include: playerProfileInclude
      });
      const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

      return matches.flatMap((match) => {
        const otherUserId = match.userAId === userId ? match.userBId : match.userAId;
        const profile = profileByUserId.get(otherUserId);
        if (!profile) return [];
        return [{
          id: match.id,
          createdAt: match.createdAt.toISOString(),
          profile: toPublicDiscoveryProfile(toDomainPlayerProfile(profile)).profile,
          unreadCount: 0,
          lastMessage: null
        }];
      });
    },

    async createRecruiterProfile(userId, input: CreateRecruiterProfileInput): Promise<RecruiterProfile> {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new HttpError(401, "Sign in to continue.");

      const profile = await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { intent: toPrismaUserIntent("recruiter") }
        });

        return tx.recruiterProfile.create({
          data: {
            userId,
            role: toPrismaRecruiterRole(input.role),
            displayName: input.displayName,
            contacts: input.contacts
          }
        });
      });

      return toDomainRecruiterProfile(profile);
    },

    async getRecruiterProfile(userId): Promise<RecruiterProfile | null> {
      const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
      return profile ? toDomainRecruiterProfile(profile) : null;
    },

    async createOrganization(userId, input: CreateOrganizationInput): Promise<OrganizationProfile> {
      const recruiter = await prisma.recruiterProfile.findUnique({ where: { userId } });
      if (!recruiter) throw new HttpError(404, "Recruiter profile not found.");

      const organization = await prisma.organizationProfile.create({
        data: {
          ownerUserId: userId,
          type: toPrismaOrganizationType(input.type),
          name: input.name,
          game: input.game,
          region: input.region,
          targetEloMin: input.targetEloMin,
          targetEloMax: input.targetEloMax,
          neededRoles: input.neededRoles,
          languages: input.languages,
          description: input.description,
          isRecruiting: input.isRecruiting,
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        }
      });

      return toDomainOrganizationProfile(organization);
    },

    async updateOrganization(userId, input: UpdateOrganizationInput): Promise<OrganizationProfile> {
      const data: Prisma.OrganizationProfileUpdateInput = {};
      if (input.type !== undefined) data.type = toPrismaOrganizationType(input.type);
      if (input.name !== undefined) data.name = input.name;
      if (input.game !== undefined) data.game = input.game;
      if (input.region !== undefined) data.region = input.region;
      if (input.targetEloMin !== undefined) data.targetEloMin = input.targetEloMin;
      if (input.targetEloMax !== undefined) data.targetEloMax = input.targetEloMax;
      if (input.neededRoles !== undefined) data.neededRoles = input.neededRoles;
      if (input.languages !== undefined) data.languages = input.languages;
      if (input.description !== undefined) data.description = input.description;
      if (input.isRecruiting !== undefined) data.isRecruiting = input.isRecruiting;

      const organization = await prisma.organizationProfile.update({
        where: { ownerUserId: userId },
        data
      });

      return toDomainOrganizationProfile(organization);
    },

    async getMyOrganization(userId): Promise<OrganizationProfile | null> {
      const organization = await prisma.organizationProfile.findUnique({ where: { ownerUserId: userId } });
      return organization ? toDomainOrganizationProfile(organization) : null;
    },

    async listOrganizationFeed(userId): Promise<OrganizationFeedItemDto[]> {
      const player = await prisma.playerProfile.findUnique({ where: { userId } });
      const applications = player
        ? await prisma.teamApplication.findMany({ where: { playerProfileId: player.id } })
        : [];
      const appliedOrganizationIds = new Set(applications.map((application) => application.organizationId));
      const organizations = await prisma.organizationProfile.findMany({
        where: {
          isRecruiting: true,
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        },
        orderBy: { updatedAt: "desc" },
        take: 50
      });

      return organizations.map((organization) => ({
        organization: toPublicOrganizationDto(toDomainOrganizationProfile(organization)),
        applied: appliedOrganizationIds.has(organization.id)
      }));
    },

    async createTeamApplication(userId, organizationId, input: CreateTeamApplicationInput): Promise<TeamApplicationDto> {
      const player = await prisma.playerProfile.findUnique({
        where: { userId },
        include: playerProfileInclude
      });
      if (!player || !player.openToOrganizations) throw new HttpError(404, "Profile not found.");

      const organization = await prisma.organizationProfile.findFirst({
        where: {
          id: organizationId,
          visibility: ProfileVisibility.VISIBLE,
          moderationStatus: ModerationStatus.APPROVED
        }
      });
      if (!organization) throw new HttpError(404, "Organization not found.");

      const application = await prisma.teamApplication.upsert({
        where: {
          organizationId_playerProfileId: {
            organizationId,
            playerProfileId: player.id
          }
        },
        create: {
          organizationId,
          playerProfileId: player.id,
          message: input.message
        },
        update: {}
      });

      return teamApplicationDto(application.id);
    },

    async listMyApplications(userId): Promise<TeamApplicationDto[]> {
      const player = await prisma.playerProfile.findUnique({ where: { userId } });
      if (!player) return [];
      const applications = await prisma.teamApplication.findMany({
        where: { playerProfileId: player.id },
        orderBy: { createdAt: "desc" }
      });
      return Promise.all(applications.map((application) => teamApplicationDto(application.id)));
    },

    async listOrganizationApplications(userId): Promise<TeamApplicationDto[]> {
      const organization = await prisma.organizationProfile.findUnique({ where: { ownerUserId: userId } });
      if (!organization) return [];
      const applications = await prisma.teamApplication.findMany({
        where: {
          organizationId: organization.id,
          playerProfile: {
            openToOrganizations: true
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return Promise.all(applications.map((application) => teamApplicationDto(application.id)));
    },

    async updateApplicationStatus(userId, applicationId, input: UpdateApplicationStatusInput): Promise<TeamApplicationDto> {
      const organization = await prisma.organizationProfile.findUnique({ where: { ownerUserId: userId } });
      if (!organization) throw new HttpError(404, "Organization not found.");

      const existing = await prisma.teamApplication.findFirst({
        where: {
          id: applicationId,
          organizationId: organization.id
        }
      });
      if (!existing) throw new HttpError(404, "Application not found.");

      await prisma.teamApplication.update({
        where: { id: applicationId },
        data: { status: toPrismaApplicationStatus(input.status) }
      });

      return teamApplicationDto(applicationId);
    }
  };

  async function teamApplicationDto(applicationId: string): Promise<TeamApplicationDto> {
    const application = await prisma.teamApplication.findUnique({
      where: { id: applicationId },
      include: {
        organization: true,
        playerProfile: {
          include: playerProfileInclude
        }
      }
    });
    if (!application) throw new HttpError(404, "Application not found.");

    return {
      id: application.id,
      status: toDomainApplicationStatus(application.status),
      message: application.message,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      organization: toPublicOrganizationDto(toDomainOrganizationProfile(application.organization)),
      player: toPublicDiscoveryProfile(toDomainPlayerProfile(application.playerProfile)).profile
    };
  }
}

function hueFromString(value: string): number {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}
