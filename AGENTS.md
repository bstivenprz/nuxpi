# AGENT.md — Build Rules

## Project Structure

- [api](./apps/api) - the app backend directory (Nest.js)
- [web](./apps/web) - the frontend directory (Next.js 16)

## Mission
- Build an interactive social platform with a PPV (pay-per-view) business model: gated content, purchases, payouts, and strong engagement loops.
- Deliver high performance and excellent UX/UI; proactively improve the existing codebase.

## Tooling & Conventions
- Monorepo: Turborepo
- Package manager: pnpm (no npm/yarn).
- Frontend: React + TypeScript, App Router; TailwindCSS for styling; @heroui/react as component library; lucide-react for icons.
- Backend: Node + TypeScript; PostgreSQL via TypeORM; prefer migrations over sync; avoid data loss changes without explicit review.
- Naming: directories/files kebab-case (lowercase-with-dashes); symbols camelCase/PascalCase per TypeScript norms.
- Type safety: `"strict": true`; no `any`/`!`; narrow types and runtime guards (zod/io-ts or manual); exhaustive switches for unions.

## Project Hygiene
- Lint/format: keep eslint/prettier configs enforced; prefer `pnpm lint` / `pnpm format`.
- Tests: add/maintain unit/integration/e2e where risk justifies; cover auth/PPV flows, payments, and permission checks.
- Env/config: load via `.env`; never hardcode secrets; document required vars with types/defaults.
- Accessibility: keyboard-first, focus states, aria labels; color-contrast ok.
- Performance: memoize where needed, suspense/streaming where sensible, avoid unnecessary waterfalls; measure with real data when possible.

## Frontend Guidelines
- Tailwind first; extend theme via `tailwind.config`.
- Use @heroui/react components; theme via provider; keep styling tokens centralized.
- Icons from lucide-react; size via Tailwind classes.
- State: server components where possible; client components only when needed; prefer server actions/fetchers; cache + revalidate wisely.
- Forms & data: schema-validated inputs; optimistic updates with rollback for critical actions; loading/skeleton states; error boundaries.
- Routing: semantic, kebab-case segments; protect PPV routes and enforce ownership/permission checks both client hint and server gate.

## Backend Guidelines
- Patterns: use CQRS pattern to provide use-cases.
- TypeORM: use repositories/data-mappers, not active record; migrations for schema changes; clear transactional boundaries.
- Domain: explicit modules (users, content, payments, PPV, notifications). Keep DTOs/schema validators at boundaries.
- Security: authN/authZ on every mutation/read of gated data; parameterized queries; rate limiting on sensitive endpoints; audit critical actions.
- Error handling: typed errors; sanitized messages to clients; structured logging with correlation ids.
- Performance: indexes for lookups; pagination/limits; avoid N+1; background jobs for heavy tasks (webhooks, settlements).

## Delivery Workflow
- Prefer incremental, small PRs; describe risk and tests run.
- Refactor when touching code if it improves clarity/safety.
- Default commands:
  - `pnpm install`
  - `pnpm lint`
  - `pnpm test` (or domain-specific)
  - `pnpm dev` / `pnpm build`
- Document new scripts and env vars in README/AGENT.

## Definition of Done
- Strict types, lint clean, tests added/updated for changed risk areas.
- UX states covered: loading, empty, error, success.
- Docs updated (usage, env, migrations) and migrations committed.
- PPV/permissions logic enforced on server; client hints only supplement.
