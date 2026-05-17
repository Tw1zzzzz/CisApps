import { createHttpApi, createHttpAuthApi } from "./httpApi";
import { mockApi, mockAuthApi } from "./mockApi";
import type { PartyUpApi, PartyUpAuthApi } from "./types";

const hasApiUrl = Boolean(process.env.EXPO_PUBLIC_API_URL);
const forceMock = process.env.EXPO_PUBLIC_USE_MOCK_API === "1";

export function createAuthClient(): PartyUpAuthApi {
  return hasApiUrl && !forceMock ? createHttpAuthApi() : mockAuthApi;
}

export function createApiClient(token: string | null): PartyUpApi {
  return token && token !== "mock-token" && hasApiUrl && !forceMock ? createHttpApi(token) : mockApi;
}
