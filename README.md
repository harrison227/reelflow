# Reelflow

Video delivery management for a small video agency. Kanban-style workflow between owner, editor, and VA, with briefs, file uploads, Komodo / Loom feedback recordings, and audit trail.

This README covers local setup. Architectural conventions live in [CLAUDE.md](CLAUDE.md).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Postgres + Drizzle ORM
- Auth.js v5 (email magic links via Resend)
- S3-compatible object storage (Backblaze B2 in prod, MinIO locally)
- Zod input validation, pino structured logging
- Vitest + testcontainers for integration tests
- ESLint with `eslint-plugin-boundaries` enforcing the layer architecture

## First-run setup

Prereqs: Node 20+, pnpm 9+, Docker Desktop running.

```powershell
# 1. Install deps
pnpm install

# 2. Bring up Postgres and MinIO locally
docker compose up -d

# 3. Copy env template and fill in AUTH_SECRET
copy .env.example .env.local
# Generate a secret: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Paste it into AUTH_SECRET in .env.local

# 4. Generate the initial migration from the schema
pnpm db:generate

# 5. Apply migrations
pnpm db:migrate

# 6. Seed a couple of users and clients
pnpm db:seed

# 7. Run the dev server
pnpm dev
```

Server runs at http://localhost:3000. Health check: http://localhost:3000/api/health.

## Useful commands

- `pnpm dev` — start Next.js dev server
- `pnpm test` — run integration tests (spins up its own Postgres via testcontainers)
- `pnpm typecheck` — strict TypeScript check
- `pnpm lint` — ESLint with architecture boundary enforcement
- `pnpm db:studio` — Drizzle Studio (DB explorer in browser)
- `pnpm db:generate` — generate a new migration from schema changes
- `pnpm db:migrate` — apply pending migrations

## Production deploy

Target: Vercel (app) + Neon (Postgres) + Backblaze B2 (storage) + Resend (email).

Required env vars in production: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `B2_*`, `ALLOWED_EMAILS`.

Migrations are run via `pnpm db:migrate` as part of the deploy step.
