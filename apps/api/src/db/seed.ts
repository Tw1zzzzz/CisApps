import { PrismaClient } from "@prisma/client";
import { seedProfiles, seedUser } from "../store/fixtures.js";
import {
  toPrismaModerationStatus,
  toPrismaOrganizationType,
  toPrismaProfileVisibility,
  toPrismaProvider,
  toPrismaRecruiterRole,
  toPrismaUserIntent,
  toPrismaUserRole
} from "../store/prismaMappers.js";

const prisma = new PrismaClient();

const seedRecruiters = [
  {
    id: "user_recruiter_mix",
    email: "mix-manager@partyup.local",
    role: "manager" as const,
    displayName: "Mix Manager",
    organization: {
      id: "org_evening_mix",
      type: "mix" as const,
      name: "Evening Mix",
      region: "EU West" as const,
      targetEloMin: 1200,
      targetEloMax: 1900,
      neededRoles: ["IGL", "Support"] as const,
      languages: ["RU", "EN"] as const,
      description: "Вечерний микс для Premier. Ищем спокойных игроков с микрофоном и стабильным онлайном."
    }
  },
  {
    id: "user_recruiter_stack",
    email: "stack-coach@partyup.local",
    role: "coach" as const,
    displayName: "Stack Coach",
    organization: {
      id: "org_anchor_stack",
      type: "stack" as const,
      name: "Anchor Stack",
      region: "EU East" as const,
      targetEloMin: 1600,
      targetEloMax: 2400,
      neededRoles: ["AWPer", "Entry"] as const,
      languages: ["RU"] as const,
      description: "Собираем стак под регулярные праки и турниры выходного дня. Нужны дисциплина и коммуникация."
    }
  },
  {
    id: "user_recruiter_team",
    email: "team-analyst@partyup.local",
    role: "analyst" as const,
    displayName: "Team Analyst",
    organization: {
      id: "org_nova_team",
      type: "team" as const,
      name: "Nova Team",
      region: "CIS" as const,
      targetEloMin: 2100,
      targetEloMax: 3200,
      neededRoles: ["Lurker", "Rifler"] as const,
      languages: ["RU", "EN"] as const,
      description: "Команда ищет rifler/lurker под structured CS2. Важны демо-ревью, расписание и долгосрочный рост."
    }
  }
];

function emailForProfile(profile: { userId: string; nickname: string }) {
  if (profile.userId === seedUser.id) return seedUser.email;
  return `${profile.nickname.replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")}@partyup.local`;
}

try {
  await prisma.$transaction(async (tx) => {
    for (const profile of seedProfiles) {
      await tx.user.upsert({
        where: { id: profile.userId },
        create: {
          id: profile.userId,
          email: emailForProfile(profile),
          role: toPrismaUserRole(profile.userId === seedUser.id ? seedUser.role : "player"),
          intent: toPrismaUserIntent("player"),
          createdAt: new Date(profile.createdAt)
        },
        update: {
          email: emailForProfile(profile),
          role: toPrismaUserRole(profile.userId === seedUser.id ? seedUser.role : "player"),
          intent: toPrismaUserIntent("player")
        }
      });

      await tx.playerProfile.upsert({
        where: { id: profile.id },
        create: {
          id: profile.id,
          userId: profile.userId,
          nickname: profile.nickname,
          displayName: profile.displayName,
          age: profile.age,
          region: profile.region,
          bio: profile.bio,
          languages: profile.languages,
          visibility: toPrismaProfileVisibility(profile.visibility),
          moderationStatus: toPrismaModerationStatus(profile.moderationStatus),
          isOnline: profile.isOnline,
          isVerified: profile.isVerified,
          openToOrganizations: profile.openToOrganizations,
          avatarHue: profile.avatarHue,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        },
        update: {
          nickname: profile.nickname,
          displayName: profile.displayName,
          age: profile.age,
          region: profile.region,
          bio: profile.bio,
          languages: profile.languages,
          visibility: toPrismaProfileVisibility(profile.visibility),
          moderationStatus: toPrismaModerationStatus(profile.moderationStatus),
          isOnline: profile.isOnline,
          isVerified: profile.isVerified,
          openToOrganizations: profile.openToOrganizations,
          avatarHue: profile.avatarHue
        }
      });

      await tx.gameProfile.upsert({
        where: { profileId: profile.id },
        create: {
          id: profile.gameProfile.id,
          profileId: profile.id,
          game: profile.gameProfile.game,
          role: profile.gameProfile.role,
          elo: profile.gameProfile.elo,
          peakElo: profile.gameProfile.peakElo,
          maps: profile.gameProfile.maps,
          availability: profile.gameProfile.availability,
          hasMic: profile.gameProfile.hasMic,
          hours: profile.gameProfile.hours
        },
        update: {
          game: profile.gameProfile.game,
          role: profile.gameProfile.role,
          elo: profile.gameProfile.elo,
          peakElo: profile.gameProfile.peakElo,
          maps: profile.gameProfile.maps,
          availability: profile.gameProfile.availability,
          hasMic: profile.gameProfile.hasMic,
          hours: profile.gameProfile.hours
        }
      });

      await tx.profileContact.deleteMany({ where: { profileId: profile.id } });
      if (profile.contacts.length > 0) {
        await tx.profileContact.createMany({
          data: profile.contacts.map((contact) => ({
            profileId: profile.id,
            type: contact.type,
            value: contact.value,
            isPrivate: contact.isPrivate
          }))
        });
      }

      await tx.providerAccount.deleteMany({ where: { profileId: profile.id } });
      if (profile.providerAccounts.length > 0) {
        await tx.providerAccount.createMany({
          data: profile.providerAccounts.map((account) => ({
            id: account.id,
            profileId: profile.id,
            provider: toPrismaProvider(account.provider),
            providerUserId: account.providerUserId,
            nickname: account.nickname,
            profileUrl: account.profileUrl,
            verified: account.verified,
            linkedAt: new Date(account.linkedAt)
          }))
        });
      }
    }

    for (const recruiter of seedRecruiters) {
      await tx.user.upsert({
        where: { id: recruiter.id },
        create: {
          id: recruiter.id,
          email: recruiter.email,
          role: toPrismaUserRole("player"),
          intent: toPrismaUserIntent("recruiter")
        },
        update: {
          email: recruiter.email,
          intent: toPrismaUserIntent("recruiter")
        }
      });

      await tx.recruiterProfile.upsert({
        where: { userId: recruiter.id },
        create: {
          userId: recruiter.id,
          role: toPrismaRecruiterRole(recruiter.role),
          displayName: recruiter.displayName,
          contacts: []
        },
        update: {
          role: toPrismaRecruiterRole(recruiter.role),
          displayName: recruiter.displayName,
          contacts: []
        }
      });

      await tx.organizationProfile.upsert({
        where: { id: recruiter.organization.id },
        create: {
          id: recruiter.organization.id,
          ownerUserId: recruiter.id,
          type: toPrismaOrganizationType(recruiter.organization.type),
          name: recruiter.organization.name,
          game: "cs2",
          region: recruiter.organization.region,
          targetEloMin: recruiter.organization.targetEloMin,
          targetEloMax: recruiter.organization.targetEloMax,
          neededRoles: [...recruiter.organization.neededRoles],
          languages: [...recruiter.organization.languages],
          description: recruiter.organization.description,
          isRecruiting: true,
          visibility: toPrismaProfileVisibility("visible"),
          moderationStatus: toPrismaModerationStatus("approved")
        },
        update: {
          type: toPrismaOrganizationType(recruiter.organization.type),
          name: recruiter.organization.name,
          region: recruiter.organization.region,
          targetEloMin: recruiter.organization.targetEloMin,
          targetEloMax: recruiter.organization.targetEloMax,
          neededRoles: [...recruiter.organization.neededRoles],
          languages: [...recruiter.organization.languages],
          description: recruiter.organization.description,
          isRecruiting: true,
          visibility: toPrismaProfileVisibility("visible"),
          moderationStatus: toPrismaModerationStatus("approved")
        }
      });
    }
  });
} finally {
  await prisma.$disconnect();
}
