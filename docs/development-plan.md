# PARTY UP Development Plan

## Current State

The repository currently contains a static browser prototype in `design/`.
There is no production app, package manifest, backend, database schema, auth layer, or iOS project yet.

Existing prototype surfaces:

- Onboarding
- Swipe/discovery feed
- Profile detail
- Filters
- Likes
- Matches and chats
- My profile
- FACEIT-style player stats
- Contacts
- Analytics
- Admin/moderation queue

Important constraint: `design/data.js` is mock UI data only. It should inform domain concepts, but it must not become the production backend model without validation and normalization.

## Recommended Product Architecture

Use Expo React Native with TypeScript for the first production iPhone build.

Why:

- Fastest path from the current React prototype to a usable iPhone app.
- Good fit for typed domain models, reusable UI primitives, auth, push notifications, and API clients.
- Keeps the door open for native iOS modules later if performance or platform features require them.

Native SwiftUI remains an option, but it should be a deliberate architecture decision before implementation because it changes staffing, code reuse, delivery speed, and backend integration patterns.

## Target System Shape

```text
apps/mobile
  Expo React Native iPhone app

apps/api
  Backend API for auth, profiles, matching, chats, moderation, analytics

packages/domain
  Shared TypeScript domain types, validation schemas, constants

packages/ui
  Mobile design tokens and reusable UI primitives

packages/config
  Shared lint, TypeScript, formatting config
```

This can start as a small monorepo only if approved. If we want the smallest first step, start with `apps/mobile` and `packages/domain`, then add `apps/api` once product flows are typed.

## MVP Scope

### 1. Account and Profile Foundation

Goal: a user can create and manage a trustworthy player profile.

Build:

- Auth-ready user model
- Player profile model
- Game profile model for CS2
- Provider account model for FACEIT and Steam
- Profile visibility and moderation status
- Profile completion calculation
- Edit profile screen
- Local validation for age, roles, ELO, maps, languages, contacts, availability

Do not expose private contacts before match/product rules allow it.

### 2. Discovery and Matching

Goal: users can browse relevant players and create matches.

Build:

- Discovery feed API contract
- Typed filter model
- Server-side filter validation
- Like, pass, super-like actions
- Match creation rules
- Empty states for no results
- Rate limiting guardrails for swipe actions

Initial matching can be deterministic and rule-based:

- Game
- Region
- ELO range
- Roles
- Maps
- Availability
- Languages
- Verification state
- Block/report state

Do not add AI matching until basic deterministic matching is working and measurable.

### 3. Likes, Matches, and Chats

Goal: users can see interest and communicate after a match.

Build:

- Incoming likes list
- Outgoing likes list
- Match list
- Chat list
- Basic message thread
- Unread counts
- Contact reveal policy after match
- Block/report actions from chat and profile

Real-time chat can start simple. Use polling or managed realtime only after backend choice is confirmed.

### 4. Moderation and Safety

Goal: admins can review risky or new content without leaking private data.

Build:

- Report model
- Moderation queue
- Moderation action model
- Audit log model
- Profile approval/rejection flow
- Contact and bio safety checks
- Admin-only server authorization

Moderation must be enforced backend-side, not hidden only in the mobile UI.

### 5. Analytics

Goal: profile and product performance are readable and useful.

Build:

- Profile views
- Like rate
- Match rate
- Response rate
- Discovery impressions
- Funnel events
- Admin dashboard metrics

Keep analytics event payloads privacy-safe. Do not include chat text, tokens, or private contacts.

## Backend Plan

### Phase 1: API Contracts and Domain Models

Create typed contracts before database implementation:

- `User`
- `PlayerProfile`
- `GameProfile`
- `ProviderAccount`
- `ProfileContact`
- `DiscoveryFilters`
- `Like`
- `Match`
- `Chat`
- `Message`
- `Report`
- `ModerationAction`
- `AnalyticsEvent`

Validation should live close to the domain layer so mobile and backend agree on shape.

### Phase 2: Backend Runtime

Choose backend stack before implementation. Recommended default:

- Node.js
- TypeScript
- Fastify or NestJS
- PostgreSQL
- Prisma or Drizzle

Alternative for fastest MVP:

- Supabase Auth
- Supabase Postgres
- Row-level security
- Edge/functions only where needed

This decision affects auth, realtime chat, migrations, hosting, and operational cost, so it should be confirmed before coding.

### Phase 3: Core API Endpoints

Initial API surface:

- `GET /me`
- `PATCH /me/profile`
- `GET /discovery`
- `POST /profiles/:id/like`
- `POST /profiles/:id/pass`
- `POST /profiles/:id/super-like`
- `GET /likes/incoming`
- `GET /likes/outgoing`
- `GET /matches`
- `GET /chats`
- `GET /chats/:id/messages`
- `POST /chats/:id/messages`
- `POST /reports`
- `GET /admin/moderation-queue`
- `POST /admin/moderation-actions`
- `POST /analytics/events`

All endpoints need auth, pagination where lists are returned, and safe error responses.

### Phase 4: External Provider Integration

FACEIT and Steam data are external input and must be normalized.

Build:

- Provider account linking flow
- Provider user ID storage separate from display nickname
- Provider refresh jobs
- Rate limit handling
- Provider downtime fallback
- Manual profile fallback if provider data is missing

Do not trust external usernames as stable identifiers.

## Mobile App Plan

### Phase 1: Bootstrap

Create Expo TypeScript app structure:

- Navigation
- Safe area handling
- Design tokens
- Theme
- Reusable primitives
- Typed API client
- Environment variable strategy
- Loading, empty, error, and success states

Initial screens should reuse the visual direction from `design/`, not the prototype implementation pattern.

### Phase 2: Screen Implementation

Recommended order:

1. App shell and bottom tabs
2. Onboarding
3. My profile
4. Edit profile
5. Discovery feed
6. Profile detail
7. Filters
8. Likes
9. Matches and chats
10. Settings
11. Report/block flows
12. Admin/moderation views
13. Analytics views

### Phase 3: iPhone Verification

Use the Build iOS Apps toolchain for simulator verification once an Expo/iOS project exists:

- Build and run on iPhone simulator
- Verify safe areas and Dynamic Island spacing
- Test bottom tab ergonomics
- Test small viewport text wrapping
- Test keyboard behavior in chats and profile editing
- Capture screenshots for key flows

## Database Draft

Initial tables:

- `users`
- `profiles`
- `game_profiles`
- `provider_accounts`
- `profile_contacts`
- `profile_media`
- `likes`
- `matches`
- `chats`
- `messages`
- `blocks`
- `reports`
- `moderation_actions`
- `analytics_events`

Indexes to plan early:

- Discovery filters: game, region, role, elo, availability, verification state
- Likes: actor, target, status
- Matches: participant IDs
- Messages: chat ID and created timestamp
- Reports: status and severity
- Provider accounts: provider and provider user ID

Migration risk:

- Provider data shape will change as FACEIT/Steam integration gets real.
- Contact visibility rules can affect stored data access patterns.
- Chat and moderation audit logs should be append-oriented to avoid losing history.

## Security and Privacy Baseline

Required from the first backend implementation:

- Auth on all private endpoints
- Server-side admin/moderation authorization
- No secrets in mobile app
- No tokens or private contacts in logs
- Contact reveal policy enforced server-side
- Blocked users excluded from discovery and messaging
- Safe public profile DTO separate from private profile DTO
- Validation on all incoming API input

## AI Usage Later

Do not add AI to the MVP path unless there is a clear product need.

Good later candidates:

- Profile quality checks
- Bio moderation suggestions
- Report summarization for admins
- Scouting note summarization
- Analytics explanations

AI outputs must be structured, validated, reviewable, and treated as assistance rather than final authority for moderation.

## First Implementation Milestone

Milestone 1 should establish production foundations without overbuilding:

1. Confirm runtime choice: Expo app plus backend stack.
2. Add package manager and project structure.
3. Define domain types and validation schemas.
4. Port design tokens from `design/styles.css`.
5. Implement mobile app shell with bottom tabs.
6. Implement typed mock service behind API-client interfaces.
7. Build first real screens: onboarding, my profile, discovery feed, profile detail.
8. Run iPhone simulator verification.

This keeps the app usable while backend contracts are being shaped.

## Open Decisions Before Coding

These need confirmation before implementation:

- Expo React Native or native SwiftUI.
- Backend stack: custom Node API/Postgres or Supabase-first.
- Auth provider.
- Whether chat must be realtime in MVP.
- Whether moderation/admin is mobile-only, web dashboard, or both.
- Whether FACEIT/Steam integration is required in MVP or can start as manual verified fields.

## Suggested Next Step

Start with the production foundation:

- Create Expo TypeScript mobile app.
- Add shared domain types.
- Add typed mock data service that maps current prototype concepts into safe app DTOs.
- Build app shell, bottom tabs, profile, discovery, and profile detail.

After that, replace the mock service with the backend API incrementally.
