import {
  ApplicationStatus as PrismaApplicationStatus,
  LikeAction as PrismaLikeAction,
  ModerationStatus as PrismaModerationStatus,
  OrganizationType as PrismaOrganizationType,
  ProfileVisibility as PrismaProfileVisibility,
  Provider as PrismaProvider,
  RecruiterRole as PrismaRecruiterRole,
  UserIntent as PrismaUserIntent,
  UserRole as PrismaUserRole,
  type Prisma,
  type User as PrismaUser
} from "@prisma/client";
import {
  APPLICATION_STATUSES,
  CONTACT_TYPES,
  CS2_MAPS,
  CS2_ROLES,
  GAME_CODES,
  LANGUAGES,
  ORGANIZATION_TYPES,
  RECRUITER_ROLES,
  REGIONS,
  USER_INTENTS,
  type ApplicationStatus,
  type ContactType,
  type Cs2Map,
  type Cs2Role,
  type GameCode,
  type GameProfile,
  type Language,
  type LikeAction,
  type Match,
  type ModerationStatus,
  type OrganizationProfile,
  type OrganizationType,
  type PlayerProfile,
  type ProfileContact,
  type ProfileVisibility,
  type Provider,
  type ProviderAccount,
  type PublicOrganizationDto,
  type RecruiterProfile,
  type RecruiterRole,
  type Region,
  type User,
  type UserIntent,
  type UserRole
} from "@party-up/domain";
import { profileContactSchema } from "@party-up/domain";

export const playerProfileInclude = {
  gameProfile: true,
  contacts: true,
  providerAccounts: true
} as const satisfies Prisma.PlayerProfileInclude;

export type PrismaPlayerProfileWithRelations = Prisma.PlayerProfileGetPayload<{
  include: typeof playerProfileInclude;
}>;

export type PrismaRecruiterProfile = Prisma.RecruiterProfileGetPayload<Record<string, never>>;
export type PrismaOrganizationProfile = Prisma.OrganizationProfileGetPayload<Record<string, never>>;

export function toDomainUser(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    role: toDomainUserRole(user.role),
    intent: user.intent ? toDomainUserIntent(user.intent) : null,
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
    openToOrganizations: profile.openToOrganizations,
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

export function toPrismaUserIntent(intent: UserIntent): PrismaUserIntent {
  switch (intent) {
    case "player":
      return PrismaUserIntent.PLAYER;
    case "recruiter":
      return PrismaUserIntent.RECRUITER;
  }
}

export function toPrismaRecruiterRole(role: RecruiterRole): PrismaRecruiterRole {
  switch (role) {
    case "manager":
      return PrismaRecruiterRole.MANAGER;
    case "coach":
      return PrismaRecruiterRole.COACH;
    case "analyst":
      return PrismaRecruiterRole.ANALYST;
  }
}

export function toPrismaOrganizationType(type: OrganizationType): PrismaOrganizationType {
  switch (type) {
    case "mix":
      return PrismaOrganizationType.MIX;
    case "stack":
      return PrismaOrganizationType.STACK;
    case "team":
      return PrismaOrganizationType.TEAM;
  }
}

export function toPrismaApplicationStatus(status: ApplicationStatus): PrismaApplicationStatus {
  switch (status) {
    case "pending":
      return PrismaApplicationStatus.PENDING;
    case "accepted":
      return PrismaApplicationStatus.ACCEPTED;
    case "rejected":
      return PrismaApplicationStatus.REJECTED;
    case "withdrawn":
      return PrismaApplicationStatus.WITHDRAWN;
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

export function toDomainRecruiterProfile(profile: PrismaRecruiterProfile): RecruiterProfile {
  return {
    id: profile.id,
    userId: profile.userId,
    role: toDomainRecruiterRole(profile.role),
    displayName: profile.displayName,
    contacts: parseContacts(profile.contacts),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

export function toDomainOrganizationProfile(profile: PrismaOrganizationProfile): OrganizationProfile {
  return {
    id: profile.id,
    ownerUserId: profile.ownerUserId,
    type: toDomainOrganizationType(profile.type),
    name: profile.name,
    game: oneOf(profile.game, GAME_CODES, "game"),
    region: oneOf(profile.region, REGIONS, "region"),
    targetEloMin: profile.targetEloMin,
    targetEloMax: profile.targetEloMax,
    neededRoles: profile.neededRoles.map((role) => oneOf(role, CS2_ROLES, "role")),
    languages: profile.languages.map((language) => oneOf(language, LANGUAGES, "language")),
    description: profile.description,
    isRecruiting: profile.isRecruiting,
    visibility: toDomainProfileVisibility(profile.visibility),
    moderationStatus: toDomainModerationStatus(profile.moderationStatus),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

export function toPublicOrganizationDto(profile: OrganizationProfile): PublicOrganizationDto {
  return {
    id: profile.id,
    type: profile.type,
    name: profile.name,
    game: profile.game,
    region: profile.region,
    targetEloMin: profile.targetEloMin,
    targetEloMax: profile.targetEloMax,
    neededRoles: profile.neededRoles,
    languages: profile.languages,
    description: profile.description,
    isRecruiting: profile.isRecruiting
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

function toDomainUserIntent(intent: PrismaUserIntent): UserIntent {
  switch (intent) {
    case PrismaUserIntent.PLAYER:
      return "player";
    case PrismaUserIntent.RECRUITER:
      return "recruiter";
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

function toDomainRecruiterRole(role: PrismaRecruiterRole): RecruiterRole {
  switch (role) {
    case PrismaRecruiterRole.MANAGER:
      return "manager";
    case PrismaRecruiterRole.COACH:
      return "coach";
    case PrismaRecruiterRole.ANALYST:
      return "analyst";
  }
}

function toDomainOrganizationType(type: PrismaOrganizationType): OrganizationType {
  switch (type) {
    case PrismaOrganizationType.MIX:
      return "mix";
    case PrismaOrganizationType.STACK:
      return "stack";
    case PrismaOrganizationType.TEAM:
      return "team";
  }
}

export function toDomainApplicationStatus(status: PrismaApplicationStatus): ApplicationStatus {
  switch (status) {
    case PrismaApplicationStatus.PENDING:
      return "pending";
    case PrismaApplicationStatus.ACCEPTED:
      return "accepted";
    case PrismaApplicationStatus.REJECTED:
      return "rejected";
    case PrismaApplicationStatus.WITHDRAWN:
      return "withdrawn";
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

function parseContacts(value: Prisma.JsonValue): ProfileContact[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => profileContactSchema.parse(item));
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
