import type {
  ApplicationStatus,
  CreateOrganizationInput,
  CreateProfileInput,
  CreateRecruiterProfileInput,
  DiscoveryFilters,
  LikeSummaryDto,
  LikeAction,
  MatchSummaryDto,
  ModerationStatus,
  OrganizationFeedItemDto,
  OrganizationModerationItemDto,
  OrganizationProfile,
  PrivateProfileDto,
  PublicDiscoveryProfileDto,
  RecruiterProfile,
  TeamApplicationDto,
  UpdateOrganizationInput,
  UpdateProfileInput,
  User
} from "@party-up/domain";

export interface PartyUpAuthApi {
  requestOtp(email: string): Promise<{ ok: true; devOtp?: string }>;
  verifyOtp(email: string, otp: string): Promise<{ token: string; user: User }>;
}

export interface PartyUpApi {
  getMe(): Promise<PrivateProfileDto>;
  setUserIntent(input: { intent: "player" | "recruiter" }): Promise<User>;
  createProfile(input: CreateProfileInput): Promise<PrivateProfileDto>;
  updateProfile(input: UpdateProfileInput): Promise<PrivateProfileDto>;
  getDiscovery(filters: DiscoveryFilters): Promise<PublicDiscoveryProfileDto[]>;
  sendLike(profileId: string, action: LikeAction): Promise<{ matched: boolean }>;
  getLikes(direction: "incoming" | "outgoing"): Promise<LikeSummaryDto[]>;
  getChats(): Promise<MatchSummaryDto[]>;
  createRecruiterProfile(input: CreateRecruiterProfileInput): Promise<RecruiterProfile>;
  getRecruiterProfile(): Promise<RecruiterProfile | null>;
  createOrganization(input: CreateOrganizationInput): Promise<OrganizationProfile>;
  updateOrganization(input: UpdateOrganizationInput): Promise<OrganizationProfile>;
  getMyOrganization(): Promise<OrganizationProfile | null>;
  getOrganizationFeed(): Promise<OrganizationFeedItemDto[]>;
  applyToOrganization(organizationId: string, message: string): Promise<TeamApplicationDto>;
  getMyApplications(): Promise<TeamApplicationDto[]>;
  getOrganizationApplications(): Promise<TeamApplicationDto[]>;
  updateApplicationStatus(applicationId: string, status: Extract<ApplicationStatus, "accepted" | "rejected">): Promise<TeamApplicationDto>;
  getOrganizationModerationQueue(status: ModerationStatus | "all"): Promise<OrganizationModerationItemDto[]>;
  updateOrganizationModeration(
    organizationId: string,
    input: { status: Extract<ModerationStatus, "approved" | "rejected" | "restricted">; visibility?: "visible" | "hidden" }
  ): Promise<OrganizationModerationItemDto>;
}
