# PARTY UP MVP Implementation Checklist

## Summary

- Build the first production version as an **Expo React Native + TypeScript iPhone app**.
- Build backend as **Fastify + Prisma + PostgreSQL**.
- First vertical MVP: **Profile + Discovery**.
- Auth baseline: **Email OTP**.
- Current `design/` stays as reference material only; no browser globals or mock data patterns should be copied into production architecture.

## Implementation Checklist

### 1. Project Foundation

- [ ] Create monorepo structure with `apps/mobile`, `apps/api`, and `packages/domain`.
- [ ] Add package manager config, TypeScript config, lint/typecheck scripts, and README setup commands.
- [ ] Add shared domain package for typed enums and DTOs used by mobile and API.
- [ ] Port design tokens from `design/styles.css` into mobile-safe theme constants.
- [ ] Keep mock prototype files untouched in `design/`.

### 2. Backend Foundation

- [ ] Create Fastify API app in `apps/api`.
- [ ] Add Prisma with PostgreSQL connection via environment variables.
- [ ] Define initial Prisma models: `User`, `PlayerProfile`, `GameProfile`, `ProviderAccount`, `Like`, `Match`.
- [ ] Add Email OTP auth contract and protected route middleware.
- [ ] Add safe public/private profile DTO separation.
- [ ] Add validation for profile input, discovery filters, and like/pass actions.
- [ ] Implement initial endpoints:
  - `GET /me`
  - `PATCH /me/profile`
  - `GET /discovery`
  - `POST /profiles/:id/like`
  - `POST /profiles/:id/pass`
  - `POST /profiles/:id/super-like`

### 3. Mobile Foundation

- [ ] Create Expo TypeScript app in `apps/mobile`.
- [ ] Add navigation with bottom tabs: discovery, likes, chats, profile.
- [ ] Add safe area handling for iPhone notch/Dynamic Island.
- [ ] Add typed API client with loading, empty, error, and success states.
- [ ] Add temporary dev/mock service only behind the same API-client interface.
- [ ] Implement first screens:
  - Onboarding
  - My Profile
  - Edit Profile
  - Discovery Feed
  - Profile Detail
  - Filters

### 4. Product Behavior

- [ ] Profile supports CS2 fields: role, FACEIT nickname, ELO, peak ELO, maps, availability, languages, mic, verification state.
- [ ] Discovery filters support role, region, ELO range, maps, online status, mic, and verified-only.
- [ ] Like/pass/super-like actions are deterministic and idempotent.
- [ ] Private contacts are never returned in public discovery responses.
- [ ] Blocked, hidden, or moderation-restricted profiles are excluded from discovery.
- [ ] Missing FACEIT/Steam data is displayed as a normal incomplete state, not an error.

## Public Interfaces and Types

- Shared domain package exposes:
  - `User`
  - `PlayerProfile`
  - `GameProfile`
  - `ProviderAccount`
  - `DiscoveryFilters`
  - `DiscoveryProfile`
  - `ProfileVisibility`
  - `ModerationStatus`
  - `LikeAction`
  - `Match`
- API returns sanitized DTOs only:
  - `PrivateProfileDto` for `/me`
  - `PublicDiscoveryProfileDto` for `/discovery`
- Environment variables:
  - `DATABASE_URL`
  - `API_PORT`
  - `APP_ENV`
  - `OTP_SECRET` or equivalent provider config
  - `EXPO_PUBLIC_API_URL`

## Test Plan

- [ ] Run TypeScript checks for all packages.
- [ ] Run API unit tests for validation, profile DTO sanitization, and discovery filtering.
- [ ] Run API integration tests for `/me`, `/discovery`, and like/pass actions.
- [ ] Run Prisma migration locally against a development database.
- [ ] Run Expo app on iPhone simulator.
- [ ] Verify iPhone-sized layouts for onboarding, profile, discovery, filters, and profile detail.
- [ ] Test loading, empty, error, and success states.
- [ ] Confirm public discovery responses do not include private contacts, tokens, or raw provider payloads.

## Assumptions Locked

- Runtime: Expo React Native with TypeScript.
- Backend: Fastify.
- Database: PostgreSQL.
- ORM/migrations: Prisma.
- Auth: Email OTP.
- MVP priority: Profile + Discovery before chats, moderation, analytics, and external provider sync.
- FACEIT/Steam integration starts as typed provider-account fields; live provider sync comes after the first working vertical slice.
