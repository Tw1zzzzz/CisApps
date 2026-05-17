import type { DiscoveryFilters, LikeAction, LikeSummaryDto, MatchSummaryDto, PrivateProfileDto, PublicDiscoveryProfileDto, User } from "@party-up/domain";
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
