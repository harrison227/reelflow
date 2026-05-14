# Reelflow conventions

This file defines the rules for working in this codebase. Every PR — human or AI-assisted — must obey them. The lint config and CI enforce most of these mechanically.

## Architecture: strict layered separation

Four layers. Each layer can only import from layers below it. The boundary is enforced by `eslint-plugin-boundaries`. CI fails on violations.

1. **HTTP / app** (`src/app/`) — Next.js route handlers, server actions, page components. Validates inputs with Zod, calls a service, returns JSON. Never touches the DB directly.
2. **Services** (`src/lib/services/`) — business logic. The ONLY place rules like "an editor can't approve a deliverable" live. Takes an actor (id + role), checks permissions, calls repositories, writes audit log entries.
3. **Repositories** (`src/lib/repositories/`) — every database query. No business logic, no permission checks. Just typed SQL via Drizzle.
4. **Database** (`src/lib/db/`) — schema, migrations, connection.

Sibling modules: `errors/`, `auth/`, `validators/`, `storage/`, `recordings/`, plus `env.ts` and `logger.ts`.

## Non-negotiables per feature

Every new feature must include:

1. **Validation.** Every input has a Zod schema in `src/lib/validators/`.
2. **Authorization.** The service layer calls `assertCan(actor.role, '<action>')` before doing work. Resource-ownership checks (e.g. "editor can only see their own deliverables") also live in the service layer.
3. **Audit log.** Every state-changing action calls `recordAuditEvent(...)`.
4. **Typed errors.** Throw classes from `src/lib/errors/`. Never `throw new Error("...")`.
5. **Test.** At least one integration test in `test/services/<feature>.test.ts` covering the happy path and one permission-denied case.
6. **DB constraints.** If a field can't be null in code, it's `NOT NULL` in the schema. Foreign keys and unique constraints exist where they should.

## Conventions

- **Imports**: use `@/...` aliases. No deep relative paths.
- **Types**: `import type { ... }` for type-only imports. ESLint enforces this.
- **Errors**: use the typed classes in `src/lib/errors/`. The HTTP handler maps them to status codes automatically.
- **Logging**: use the configured `logger` from `@/lib/logger`. Never `console.log` in app code.
- **Env vars**: add to `src/lib/env.ts` Zod schema. Never use `process.env.X` directly outside that file.
- **DB queries**: live in repositories. Services never call Drizzle directly.

## Build order

The features go in this order. Resist building UI or polish ahead of the rails.

1. ✅ Skeleton: env, db, auth, errors, logging, lint, CI.
2. ✅ Clients: vertical slice template — services, repos, routes, tests.
3. Deliverables: CRUD + Kanban status transitions + brief structure.
4. Assets: presigned upload URLs to B2 + completion webhook + background thumbnail job.
5. Revisions: threads, comments, Komodo / Loom URL parsing and embeds.
6. Notifications: in-app + email dispatch + per-user preferences.
7. Audit log view.
8. Client preview share links.

## Komodo and Loom recordings

Recordings (screen recordings from Komodo or Loom) are attached to comments by pasting their share URL. The system:

1. Parses the URL via `src/lib/recordings/parse.ts` to extract provider + ID.
2. Stores `recording_provider`, `recording_id`, and `recording_url` on the comment row.
3. Renders the right embed iframe at view time.

Komodo URLs: `https://komododecks.com/recordings/{id}` → embed at `https://komododecks.com/embed/{id}`.
Loom URLs: `https://www.loom.com/share/{id}` → embed at `https://www.loom.com/embed/{id}`.

## Running locally

See [README.md](README.md).
