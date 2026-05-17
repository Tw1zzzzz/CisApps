import {
  LikeAction as PrismaLikeAction,
  ModerationStatus as PrismaModerationStatus,
  ProfileVisibility as PrismaProfileVisibility,
  Provider as PrismaProvider,
  UserRole as PrismaUserRole,
  type Prisma,
  type User as PrismaUser
} from "@prisma/client";
import {
  CONTACT_TYPES,
  CS2_MAPS,
  CS2_ROLES,
  GAME_CODES,
  LANGUAGES,
  REGIONS,
  type ContactType,
  type Cs2Map,
  type Cs2Role,
  type GameCode,
  type GameProfile,
  type Language,
  type LikeAction,
  type Match,
  type ModerationStatus,
  type PlayerProfile,
  type ProfileContact,
  type ProfileVisibility,
  type Provider,
  type ProviderAccount,
  type Region,
  type User,
  type UserRole
} from "@party-up/domain";

export const playerProfileInclude = {
  gameProfile: true,
  contacts: true,
  providerAccounts: true
} as const satisfies Prisma.PlayerProfileInclude;

export type PrismaPlayerProfileWithRelations = Prisma.PlayerProfileGetPayload<{
  include: typeof playerProfileInclude;
}>;

export function toDomainUser(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    role: toDomainUserRole(user.role),
    createdAt: user.createdAt.toISOString()
  };
}

export function toDomainPlayerProfile(profile: PrismaPlayerProfileWithRelations): PlayerProfile {
  if (!profile.gameProfile) {
    throw new Error(`Profile ${profile.id} is missing game profile.`);
  }

  return {
    id: profile.id,
    userId: profile.userId,
    nickname: profile.nickname,
    displayName: profile.displayName,
    age: profile.age,
    region: oneOf(profile.region, REGIONS, "region"),
    bio: profile.bio,
    languages: profile.languages.map((language) => oneOf(language, LANGUAGES, "language")),
    visibility: toDomainProfileVisibility(profile.visibility),
    moderationStatus: toDomainModerationStatus(profile.moderationStatus),
    isOnline: profile.isOnline,
    isVerified: profile.isVerified,
    avatarHue: profile.avatarHue,
    contacts: profile.contacts.map(toDomainProfileContact),
    providerAccounts: profile.providerAccounts.map(toDomainProviderAccount),
    gameProfile: toDomainGameProfile(profile.gameProfile),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

export function toDomainLikeAction(action: PrismaLikeAction): LikeAction {
  switch (action) {
    case PrismaLikeAction.LIKE:
      return "like";
    case PrismaLikeAction.PASS:
      return "pass";
    case PrismaLikeAction.SUPER_LIKE:
      return "super-like";
  }
}

export function toPrismaLikeAction(action: LikeAction): PrismaLikeAction {
  switch (action) {
    case "like":
      return PrismaLikeAction.LIKE;
    case "pass":
      return PrismaLikeAction.PASS;
    case "super-like":
      return PrismaLikeAction.SUPER_LIKE;
  }
}

export function toPrismaUserRole(role: UserRole): PrismaUserRole {
  switch (role) {
    case "player":
      return PrismaUserRole.PLAYER;
    case "admin":
      return PrismaUserRole.ADMIN;
  }
}

export function toPrismaProfileVisibility(visibility: ProfileVisibility): PrismaProfileVisibility {
  switch (visibility) {
    case "visible":
      return PrismaProfileVisibility.VISIBLE;
    case "hidden":
      return PrismaProfileVisibility.HIDDEN;
  }
}

export function toPrismaModerationStatus(status: ModerationStatus): PrismaModerationStatus {
  switch (status) {
    case "pending":
      return PrismaModerationStatus.PENDING;
    case "approved":
      return PrismaModerationStatus.APPROVED;
    case "rejected":
      return PrismaModerationStatus.REJECTED;
    case "restricted":
      return PrismaModerationStatus.RESTRICTED;
  }
}

export function toPrismaProvider(provider: Provider): PrismaProvider {
  switch (provider) {
    case "faceit":
      return PrismaProvider.FACEIT;
    case "steam":
      return PrismaProvider.STEAM;
  }
}

export function toDomainMatch(match: { id: string; userAId: string; userBId: string; createdAt: Date }): Match {
  return {
    id: match.id,
    userAId: match.userAId,
    userBId: match.userBId,
    createdAt: match.createdAt.toISOString()
  };
}

function toDomainUserRole(role: PrismaUserRole): UserRole {
  switch (role) {
    case PrismaUserRole.PLAYER:
      return "player";
    case PrismaUserRole.ADMIN:
      return "admin";
  }
}

function toDomainProfileVisibility(visibility: PrismaProfileVisibility): ProfileVisibility {
  switch (visibility) {
    case PrismaProfileVisibility.VISIBLE:
      return "visible";
    case PrismaProfileVisibility.HIDDEN:
      return "hidden";
  }
}

function toDomainModerationStatus(status: PrismaModerationStatus): ModerationStatus {
  switch (status) {
    case PrismaModerationStatus.PENDING:
      return "pending";
    case PrismaModerationStatus.APPROVED:
      return "approved";
    case PrismaModerationStatus.REJECTED:
      return "rejected";
    case PrismaModerationStatus.RESTRICTED:
      return "restricted";
  }
}

function toDomainProvider(provider: PrismaProvider): Provider {
  switch (provider) {
    case PrismaProvider.FACEIT:
      return "faceit";
    case PrismaProvider.STEAM:
      return "steam";
  }
}

function toDomainProfileContact(contact: {
  type: string;
  value: string;
  isPrivate: boolean;
}): ProfileContact {
  return {
    type: oneOf(contact.type, CONTACT_TYPES, "contact type"),
    value: contact.value,
    isPrivate: contact.isPrivate
  };
}

function toDomainProviderAccount(account: {
  id: string;
  provider: PrismaProvider;
  providerUserId: string | null;
  nickname: string;
  profileUrl: string | null;
  verified: boolean;
  linkedAt: Date;
}): ProviderAccount {
  return {
    id: account.id,
    provider: toDomainProvider(account.provider),
    providerUserId: account.providerUserId,
    nickname: account.nickname,
    profileUrl: account.profileUrl,
    verified: account.verified,
    linkedAt: account.linkedAt.toISOString()
  };
}

function toDomainGameProfile(gameProfile: {
  id: string;
  game: string;
  role: string;
  elo: number;
  peakElo: number | null;
  maps: string[];
  availability: string;
  hasMic: boolean;
  hours: number | null;
}): GameProfile {
  return {
    id: gameProfile.id,
    game: oneOf(gameProfile.game, GAME_CODES, "game"),
    role: oneOf(gameProfile.role, CS2_ROLES, "role"),
    elo: gameProfile.elo,
    peakElo: gameProfile.peakElo,
    maps: gameProfile.maps.map((map) => oneOf(map, CS2_MAPS, "map")),
    availability: gameProfile.availability,
    hasMic: gameProfile.hasMic,
    hours: gameProfile.hours
  };
}

function oneOf<const T extends readonly string[]>(value: string, values: T, field: string): T[number] {
  if ((values as readonly string[]).includes(value)) {
    return value as T[number];
  }

  throw new Error(`Invalid ${field}: ${value}`);
}

