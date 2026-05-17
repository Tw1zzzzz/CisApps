# PARTY UP

Production MVP workspace for the PARTY UP iPhone esports teammate-finder app.

The existing `design/` folder is static prototype source material. Production code lives in:

- `apps/mobile` - Expo React Native iPhone app
- `apps/api` - Fastify API
- `packages/domain` - shared TypeScript domain types and validation

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Development

```bash
npm run dev:api
npm run dev:mobile
```

## Checks

```bash
npm run typecheck
npm run test
```

## Database

The API is configured for PostgreSQL through Prisma.

```bash
npm run prisma:migrate
npm run prisma:seed
```

Use a local development database URL in `apps/api/.env`.
