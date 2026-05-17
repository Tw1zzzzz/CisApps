# AGENTS.md

## Role

Act as a senior full-stack engineer and mobile software architect.

This repository currently contains the `PARTY UP` design prototype for an esports teammate-finder product. Treat the existing `design/` folder as product/design source material, not as production application architecture.

The target product direction is an iPhone application for esports CRM, player scouting, team matching, FACEIT/Steam-derived profile data, chats, moderation, analytics, and performance tracking.

## Current Repository Context

- `design/PARTY UP.html` is a static browser prototype.
- `design/*.jsx` uses React 18 UMD, Babel in the browser, global `window.*` state, and mock data.
- `design/data.js` contains mock CS2/FACEIT-style player data and must not be treated as a real backend model.
- There is no package manifest, build system, API server, database schema, iOS project, or React Native/Expo project yet.
- There is no Git repository initialized in this folder at the time this file was created.

## Product Direction

Build like a production B2B/B2C esports SaaS/mobile product:

- Player discovery and teammate matching should be trustworthy, fast, and readable.
- Profiles should support esports-specific fields: game, role, FACEIT nickname, ELO, peak ELO, maps, availability, languages, communication channels, verification status, and moderation state.
- Analytics dashboards should be dense, structured, and practical rather than flashy.
- Admin/moderation workflows should prioritize safety, auditability, and operational clarity.
- Never expose private contact channels before the product rules allow it.

## Mobile App Direction

When preparing or implementing the iPhone app, prefer this path unless the user explicitly decides otherwise:

1. Use React Native with Expo and TypeScript for fastest iteration from the current React prototype.
2. Keep the design system portable: tokens, typography, spacing, colors, and reusable UI primitives.
3. Separate domain models, API clients, state management, and UI components from the start.
4. Avoid one-off global state, browser-only APIs, inline styles at scale, and production logic inside screens.
5. Target iPhone safe areas, notch/Dynamic Island layouts, bottom tab navigation, keyboard handling, and gesture ergonomics.

If a native SwiftUI app is requested instead, preserve the same product architecture: domain models, service boundaries, validation, typed API contracts, and reusable view components.

## Work Style

- First understand the existing codebase before changing anything.
- Prefer small, safe, incremental changes over rewrites.
- Reuse existing components, utilities, services, types, and patterns.
- Do not duplicate logic.
- Do not invent fake APIs, fake data models, or placeholder production logic.
- Do not add dependencies unless they are clearly necessary.
- Preserve existing behavior unless the task explicitly requires changing it.
- Keep changes scoped to the user request.
- If a decision affects architecture, security, payments, database structure, or major UX behavior, ask before committing to it.

## Code Quality

- Use TypeScript for new application code.
- Keep types close to domain concepts and API contracts.
- Validate all external input.
- Handle loading, empty, error, and success states where relevant.
- Avoid hardcoded values, magic numbers, hidden side effects, and untyped cross-module contracts.
- Keep business logic separate from UI.
- Keep files reasonably small and modular.
- Follow the existing style once a production app structure exists.
- Prefer deterministic, testable functions for matching, filtering, scoring, analytics, and moderation decisions.

## Frontend and Mobile UI Rules

- Reuse the visual direction in `design/`, but do not copy prototype implementation patterns into production blindly.
- Build clean, responsive, practical mobile UI.
- Respect iOS safe areas, bottom navigation, touch targets, keyboard avoidance, and reduced-motion settings.
- Do not show raw technical errors to end users.
- Use readable empty states for no profiles, no matches, no chats, no analytics data, and moderation queues.
- Keep dashboards and analytics scan-friendly: clear hierarchy, compact cards, stable spacing, and meaningful labels.
- Avoid flashy UI that reduces usability.
- Avoid visible debug/tweak panels in production builds.

## Backend and Data Rules

- Never expose secrets, API tokens, cookies, session payloads, or private user data.
- Do not log sensitive information.
- Use existing middleware, validators, services, and error handling once they exist.
- Consider rate limits, pagination, indexes, caching, retries, and provider downtime.
- Treat FACEIT, Steam, Telegram, Discord, and similar provider data as external input.
- Normalize external provider data before storing or displaying it.
- Do not assume external usernames are stable identifiers.
- For database schema changes, explain migration risks and backwards compatibility.

## AI and OpenAI Integration Rules

Use OpenAI APIs only when there is a clear product need, such as profile quality checks, moderation assistance, structured summarization, scouting notes, or analytics explanations.

- Minimize hallucination risk.
- Use structured prompts and deterministic outputs for business logic.
- Prefer JSON-schema-like validated outputs where possible.
- Keep AI decisions reviewable for moderation or high-impact workflows.
- Consider latency, token cost, retries, provider errors, and fallback UX.
- Never hardcode OpenAI API keys or any other secrets.
- Do not send private contact data, tokens, cookies, or unnecessary personal data to AI services.
- When current OpenAI API behavior matters, verify against official OpenAI documentation before implementing.

## Security and Privacy

- Private contacts, chat content, provider tokens, and identity data are sensitive.
- Use least-privilege access patterns.
- Avoid client-side trust for authorization-sensitive actions.
- Moderation/admin access must be enforced server-side.
- Do not leak whether a private user action occurred unless the product explicitly allows it.
- Be careful with screenshots, logs, crash reports, analytics events, and AI prompts because they may contain personal data.

## Testing and Verification

For meaningful code changes:

- Run the relevant typecheck, lint, unit tests, and app build if available.
- For UI changes, verify on iPhone-sized viewports or iOS simulator when available.
- Test loading, empty, error, and success states.
- Test edge cases around missing FACEIT/Steam data, private profiles, unverified users, blocked users, and rate-limited providers.
- After fixing a bug, explain the root cause and how to verify the fix.

If a test command or build system does not exist yet, state that clearly.

## Repository Setup Guidance

Before starting production iPhone development, prefer creating or confirming:

- A package manager and lockfile.
- A TypeScript app structure.
- A mobile runtime choice: Expo/React Native or SwiftUI.
- Environment variable strategy for API URLs and secrets.
- API contract definitions.
- Domain model definitions for users, profiles, games, roles, provider accounts, likes, matches, chats, reports, moderation actions, and analytics.
- Basic lint/typecheck/build scripts.
- A README with local setup and development commands.

Do not initialize major architecture, database, auth, payments, or provider integrations without the user's approval.

## Final Response Format

Always finish substantial work with:

1. What changed
2. Files changed
3. How to test
4. Risks or follow-up checks

