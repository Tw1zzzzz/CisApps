import { PrismaClient } from "@prisma/client";
import { seedProfiles, seedUser } from "../store/fixtures.js";
import {
  toPrismaModerationStatus,
  toPrismaProfileVisibility,
  toPrismaProvider,
  toPrismaUserRole
} from "../store/prismaMappers.js";

const prisma = new PrismaClient();

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
          createdAt: new Date(profile.createdAt)
        },
        update: {
          email: emailForProfile(profile),
          role: toPrismaUserRole(profile.userId === seedUser.id ? seedUser.role : "player")
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
  });
} finally {
  await prisma.$disconnect();
}

