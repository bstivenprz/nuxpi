# Nuxpi Monorepo

Interactive social platform with PPV (pay-per-view) gated content, purchases, payouts, and engagement loops. Monorepo managed by Turborepo with a Next.js web app and a NestJS API.

## Stack
- **Tooling**: Turborepo, pnpm 9, TypeScript strict, Prettier, ESLint, Jest, Cypress, TailwindCSS.
- **Frontend (`apps/web`)**: Next.js 16 (App Router), React 19, TailwindCSS v4, @heroui/react, lucide-react icons, TanStack Query, React Hook Form + Zod, Socket.IO client, Supabase SSR helper, Cloudinary uploads.
- **Backend (`apps/api`)**: NestJS 10, CQRS pattern (commands/queries), TypeORM + PostgreSQL, Supabase auth/JWKS, JWT cookie strategy, Redis cache (planned), Swagger, Socket.IO gateway, Cloudinary + Resend integrations.
- **Shared**: `packages/ui` (shared components), `packages/eslint-config`, `packages/typescript-config`.

## Repository Layout
- `apps/web/` – Next.js app (App Router). Key folders: `src/app` (routes/layouts), `src/components`, `src/hooks`, `src/libs` (cloudinary/supabase/socket), `src/api` (axios/fetch wrappers + DTOs), `src/providers`.
- `apps/api/` – NestJS API. Key folders: `src/modules` (identity, profile, chat, feed), `src/auth`, `src/config`, `src/database` (migrations/seeds, data-source), `src/common` (decorators/utils/models), `src/services/supabase`.
- `packages/ui/` – shared UI building blocks.
- `packages/eslint-config/` and `packages/typescript-config/` – linting and TS base configs.
- Root config: `turbo.json`, `pnpm-workspace.yaml`, `.npmrc`, `.gitignore`.

## Prerequisites
- Node.js 18+.
- pnpm 9 (`corepack enable` or `npm i -g pnpm@9`).
- PostgreSQL and Redis running locally (match ports in env). Cloudinary and Supabase accounts for media/auth.

## Environment Variables
Create `.env` files per app (do not commit secrets). Samples live in `apps/api/.env` and `apps/web/.env`; replace placeholder values.

**API (`apps/api/.env`)**
- App: `PORT`, `API_PREFIX`, `FRONTEND_URL`.
- Auth: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, cookie names/expirations, same-site/httpOnly flags.
- Database: `DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_LOGGING`, `DB_SYNCHRONIZE` (use migrations in production).
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.
- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_JWKS_URL`, `SUPABASE_JWT_ISSUER`, `SUPABASE_COOKIE_NAME`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Email: `RESEND_API_KEY`, `RESEND_FROM_NAME`, `RESEND_FROM_EMAIL`.

**Web (`apps/web/.env`)**
- API: `NEXT_PUBLIC_API_URL`.
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, provider client secrets as needed.
- Cloudinary: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_FOLDER`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Rotate any committed keys and keep real values in local/CI secrets only.

## Install
```bash
pnpm install
```

## Common Commands
- Root: `pnpm dev` (run all), `pnpm build`, `pnpm lint`, `pnpm check-types`, `pnpm format`.
- Web only: `pnpm --filter web dev`, `pnpm --filter web build`, `pnpm --filter web lint`, `pnpm --filter web cypress:open`.
- API only: `pnpm --filter api dev`, `pnpm --filter api start`, `pnpm --filter api build`, `pnpm --filter api lint`, `pnpm --filter api test` (Jest).
- Turborepo filters: `pnpm turbo run <task> --filter=<pkg>` to scope tasks.

## Development Workflow
- Use `pnpm` commands above; prefer small, incremental changes.
- Run lint/tests relevant to your change (`pnpm lint`, `pnpm --filter api test`, `pnpm --filter web cypress:open` where applicable).
- Keep types strict and avoid `any`/non-null assertions; add zod/form validation for inputs.
- Add migrations for schema changes; avoid `DB_SYNCHRONIZE=true` outside local dev.
- Ensure accessibility (focus states/aria), performance (memoization, streaming/suspense), and permission checks for all gated flows.

## Notes for Collaborators
- Follow kebab-case for files/folders; camelCase/PascalCase for symbols.
- Centralize styling tokens in Tailwind/theme; use shared UI from `packages/ui` where possible.
- Do not commit real secrets; use `.env` locally and CI secrets in pipelines.
- If you enable remote caching, run `pnpm turbo login && pnpm turbo link` with your Vercel account.
