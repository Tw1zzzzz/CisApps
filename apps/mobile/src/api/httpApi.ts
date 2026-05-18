import type {
  DiscoveryFilters,
  LikeAction,
  LikeSummaryDto,
  MatchSummaryDto,
  ModerationStatus,
  OrganizationFeedItemDto,
  OrganizationModerationItemDto,
  OrganizationProfile,
  PrivateProfileDto,
  PublicDiscoveryProfileDto,
  RecruiterProfile,
  TeamApplicationDto,
  User
} from "@party-up/domain";
import type { PartyUpApi, PartyUpAuthApi } from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function createHttpAuthApi(): PartyUpAuthApi {
  return {
    requestOtp(email: string) {
      return request<{ ok: true; devOtp?: string }>("/auth/request-otp", { method: "POST", body: { email } });
    },
    verifyOtp(email: string, otp: string) {
      return request<{ token: string; user: User }>("/auth/verify-otp", { method: "POST", body: { email, otp } });
    }
  };
}

export function createHttpApi(token: string): PartyUpApi {
  return {
    getMe: () => request<PrivateProfileDto>("/me", { token }),
    async setUserIntent(input) {
      const response = await request<{ user: User }>("/me/intent", { token, method: "PATCH", body: input });
      return response.user;
    },
    createProfile: (input) => request<PrivateProfileDto>("/me/profile", { token, method: "POST", body: input }),
    updateProfile: (input) => request<PrivateProfileDto>("/me/profile", { token, method: "PATCH", body: input }),
    async getDiscovery(filters: DiscoveryFilters) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          for (const item of value) search.append(key, String(item));
        } else if (value !== undefined) {
          search.set(key, String(value));
        }
      }
      const response = await request<{ profiles: PublicDiscoveryProfileDto[] }>(`/discovery?${search.toString()}`, { token });
      return response.profiles;
    },
    sendLike(profileId: string, action: LikeAction) {
      const path = action === "super-like" ? "super-like" : action;
      return request<{ matched: boolean }>(`/profiles/${profileId}/${path}`, { token, method: "POST" });
    },
    async getLikes(direction: "incoming" | "outgoing") {
      const response = await request<{ likes: LikeSummaryDto[] }>(`/likes/${direction}`, { token });
      return response.likes;
    },
    async getChats() {
      const response = await request<{ chats: MatchSummaryDto[] }>("/chats", { token });
      return response.chats;
    },
    async createRecruiterProfile(input) {
      const response = await request<{ recruiterProfile: RecruiterProfile }>("/me/recruiter-profile", { token, method: "POST", body: input });
      return response.recruiterProfile;
    },
    async getRecruiterProfile() {
      const response = await request<{ recruiterProfile: RecruiterProfile | null }>("/me/recruiter-profile", { token });
      return response.recruiterProfile;
    },
    async createOrganization(input) {
      const response = await request<{ organization: OrganizationProfile }>("/me/organization", { token, method: "POST", body: input });
      return response.organization;
    },
    async updateOrganization(input) {
      const response = await request<{ organization: OrganizationProfile }>("/me/organization", { token, method: "PATCH", body: input });
      return response.organization;
    },
    async getMyOrganization() {
      const response = await request<{ organization: OrganizationProfile | null }>("/me/organization", { token });
      return response.organization;
    },
    async getOrganizationFeed() {
      const response = await request<{ organizations: OrganizationFeedItemDto[] }>("/organizations/feed", { token });
      return response.organizations;
    },
    async applyToOrganization(organizationId, message) {
      const response = await request<{ application: TeamApplicationDto }>(`/organizations/${organizationId}/apply`, {
        token,
        method: "POST",
        body: { message }
      });
      return response.application;
    },
    async getMyApplications() {
      const response = await request<{ applications: TeamApplicationDto[] }>("/me/applications", { token });
      return response.applications;
    },
    async getOrganizationApplications() {
      const response = await request<{ applications: TeamApplicationDto[] }>("/organization/applications", { token });
      return response.applications;
    },
    async updateApplicationStatus(applicationId, status) {
      const response = await request<{ application: TeamApplicationDto }>(`/organization/applications/${applicationId}/status`, {
        token,
        method: "PATCH",
        body: { status }
      });
      return response.application;
    },
    async getOrganizationModerationQueue(status: ModerationStatus | "all") {
      const search = new URLSearchParams({ status });
      const response = await request<{ organizations: OrganizationModerationItemDto[] }>(`/admin/moderation/organizations?${search.toString()}`, { token });
      return response.organizations;
    },
    async updateOrganizationModeration(organizationId, input) {
      const response = await request<{ organization: OrganizationModerationItemDto }>(`/admin/moderation/organizations/${organizationId}`, {
        token,
        method: "PATCH",
        body: input
      });
      return response.organization;
    }
  };
}

async function request<T>(
  path: string,
  options: { token?: string; method?: string; body?: unknown }
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json"
    }
  };
  if (options.token) {
    init.headers = {
      ...init.headers,
      authorization: `Bearer ${options.token}`
    };
  }
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return response.json() as Promise<T>;
}
