import type {
  DiscoveryFilters,
  LikeSummaryDto,
  LikeAction,
  MatchSummaryDto,
  PrivateProfileDto,
  PublicDiscoveryProfileDto,
  User
} from "@party-up/domain";

export interface PartyUpAuthApi {
  requestOtp(email: string): Promise<{ ok: true; devOtp?: string }>;
  verifyOtp(email: string, otp: string): Promise<{ token: string; user: User }>;
}

export interface PartyUpApi {
  getMe(): Promise<PrivateProfileDto>;
  createProfile(input: unknown): Promise<PrivateProfileDto>;
  updateProfile(input: unknown): Promise<PrivateProfileDto>;
  getDiscovery(filters: DiscoveryFilters): Promise<PublicDiscoveryProfileDto[]>;
  sendLike(profileId: string, action: LikeAction): Promise<{ matched: boolean }>;
  getLikes(direction: "incoming" | "outgoing"): Promise<LikeSummaryDto[]>;
  getChats(): Promise<MatchSummaryDto[]>;
}
