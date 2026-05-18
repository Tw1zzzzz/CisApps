import type {
  CONTACT_TYPES,
  CS2_MAPS,
  CS2_ROLES,
  GAME_CODES,
  LANGUAGES,
  LIKE_ACTIONS,
  REGIONS,
  USER_INTENTS,
  RECRUITER_ROLES,
  ORGANIZATION_TYPES,
  APPLICATION_STATUSES
} from "./constants.js";

export type GameCode = (typeof GAME_CODES)[number];
export type Cs2Role = (typeof CS2_ROLES)[number];
export type Cs2Map = (typeof CS2_MAPS)[number];
export type Region = (typeof REGIONS)[number];
export type Language = (typeof LANGUAGES)[number];
export type ContactType = (typeof CONTACT_TYPES)[number];
export type LikeAction = (typeof LIKE_ACTIONS)[number];
export type UserIntent = (typeof USER_INTENTS)[number];
export type RecruiterRole = (typeof RECRUITER_ROLES)[number];
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ProfileVisibility = "visible" | "hidden";
export type ModerationStatus = "pending" | "approved" | "rejected" | "restricted";
export type Provider = "faceit" | "steam";
export type UserRole = "player" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  intent: UserIntent | null;
  createdAt: string;
}

export interface ProfileContact {
  type: ContactType;
  value: string;
  isPrivate: boolean;
}

export interface ProviderAccount {
  id: string;
  provider: Provider;
  providerUserId: string | null;
  nickname: string;
  profileUrl: string | null;
  verified: boolean;
  linkedAt: string;
}

export interface GameProfile {
  id: string;
  game: GameCode;
  role: Cs2Role;
  elo: number;
  peakElo: number | null;
  maps: Cs2Map[];
  availability: string;
  hasMic: boolean;
  hours: number | null;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  nickname: string;
  displayName: string;
  age: number;
  region: Region;
  bio: string;
  languages: Language[];
  visibility: ProfileVisibility;
  moderationStatus: ModerationStatus;
  isOnline: boolean;
  isVerified: boolean;
  openToOrganizations: boolean;
  avatarHue: number;
  contacts: ProfileContact[];
  providerAccounts: ProviderAccount[];
  gameProfile: GameProfile;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryFilters {
  role?: Cs2Role | "all";
  region?: Region;
  ageMin?: number;
  ageMax?: number;
  eloMin?: number;
  eloMax?: number;
  maps?: Cs2Map[];
  onlyOnline?: boolean;
  withMic?: boolean;
  verifiedOnly?: boolean;
}

export interface DiscoveryProfile {
  id: string;
  nickname: string;
  displayName: string;
  age: number;
  region: Region;
  bio: string;
  languages: Language[];
  isOnline: boolean;
  isVerified: boolean;
  avatarHue: number;
  gameProfile: GameProfile;
  faceit: Pick<ProviderAccount, "nickname" | "profileUrl" | "verified"> | null;
}

export interface PrivateProfileDto {
  user: User;
  profile: PlayerProfile;
  completion: number;
}

export interface PublicDiscoveryProfileDto {
  profile: DiscoveryProfile;
}

export interface LikeSummaryDto {
  id: string;
  action: Exclude<LikeAction, "pass">;
  createdAt: string;
  profile: DiscoveryProfile;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
}

export interface MatchSummaryDto {
  id: string;
  createdAt: string;
  profile: DiscoveryProfile;
  unreadCount: number;
  lastMessage: string | null;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  role: RecruiterRole;
  displayName: string;
  contacts: ProfileContact[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationProfile {
  id: string;
  ownerUserId: string;
  type: OrganizationType;
  name: string;
  game: GameCode;
  region: Region;
  targetEloMin: number;
  targetEloMax: number;
  neededRoles: Cs2Role[];
  languages: Language[];
  description: string;
  isRecruiting: boolean;
  visibility: ProfileVisibility;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PublicOrganizationDto {
  id: string;
  type: OrganizationType;
  name: string;
  game: GameCode;
  region: Region;
  targetEloMin: number;
  targetEloMax: number;
  neededRoles: Cs2Role[];
  languages: Language[];
  description: string;
  isRecruiting: boolean;
}

export interface OrganizationFeedItemDto {
  organization: PublicOrganizationDto;
  applied: boolean;
}

export interface TeamApplicationDto {
  id: string;
  status: ApplicationStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  organization: PublicOrganizationDto;
  player: DiscoveryProfile;
}

export interface OrganizationModerationItemDto {
  organization: OrganizationProfile;
  recruiter: Pick<RecruiterProfile, "role" | "displayName"> | null;
  ownerEmail: string;
}
