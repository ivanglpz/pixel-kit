# PixelKit Desktop Migration Progress

## 2026-05-17: Phase 0 Started

### What was done

- Added `PIXELKIT_DESKTOP_MIGRATION_PLAN.md` as the source document for the desktop MVP migration.
- Added `pnpm-workspace.yaml` so the repository can grow into a monorepo without moving the current Next.js app yet.
- Added `MIGRATION_TASKS.md` to break the migration into small phases.
- Added initial shared package scaffolding:
  - `packages/core`
  - `packages/platform`

### How it was done

- The current app remains at the repository root for now.
- No source files from `src/` were moved in this phase.
- The first shared packages contain only TypeScript contracts and pure helper placeholders, so they can be adopted incrementally.

### Current status

- The web app should behave exactly as before.
- The repo now has a place for shared domain types and platform boundaries.
- Next safe step: begin replacing duplicated/web-owned project types with `@pixelkit/core` in a small PR-sized pass.

### Notes

- Desktop is intentionally not scaffolded yet. The next useful milestone is to make the editor less dependent on web-only services before creating a Vite/Electron renderer.

### Agent findings

- `src/pages`, `src/pages/api`, `src/db`, `src/services`, `src/middleware.ts`, auth pages, dashboard components, Cloudinary upload routes, and Mongo/Mongoose schemas are web-only.
- `next.config.js`, `next-env.d.ts`, Next scripts/dependencies, `postcss.config.cjs`, `components.json`, and current `tsconfig` aliases need a careful web move later. The `canvas` workaround in `next.config.js` is cwd-sensitive.
- The editor is portable in its Konva/Jotai core, but blocked by Next routing/dynamic imports, web services, DB types, Cloudinary upload, autosave, `next/link`, `next-themes`, and app-level UI imports.
- First refactor target for the next phase: replace editor-facing web project/photo types with core contracts, then isolate project ID, autosave, image upload, toast, link/router, and theme behind platform or host adapters.

### Verification

- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `pnpm --filter ... typecheck` currently attempts an interactive workspace install because `pnpm-workspace.yaml` was just added. Use direct `tsc` checks until the workspace install/lockfile is intentionally refreshed.

## 2026-05-17: Phase 1A Shared Editor Types

### What was done

- Added root TypeScript aliases for `@pixelkit/core` and `@pixelkit/platform`.
- Added `PhotoDocument`, `ProjectModeSnapshot`, `getProjectModeSnapshot`, and `parseProjectDataByMode` to `@pixelkit/core`.
- Replaced editor imports of `IProject` and `IPhoto` from `@/db/schemas/types` with shared `ProjectDocument` and `PhotoDocument`.
- Updated `src/editor/states/projects.ts` to use the pure snapshot parser from `@pixelkit/core`.

### How it was done

- Runtime behavior was kept the same: API calls, uploads, autosave, Jotai hydration, and the current web app remain in place.
- The editor still uses its existing atoms and state shape; only the serializable document contracts moved outward.
- `src/db` remains web/backend-owned. This phase only removed the editor's direct type dependency on it.

### Verification

- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

### Current status

- `src/editor` no longer imports `@/db/schemas/types`.
- The next safe step is Phase 1B: add focused tests or type-level checks for `@pixelkit/core` snapshot parsing, then begin isolating `PROJECT_ID_ATOM` from `window.location`.

## 2026-05-17: Project-Local Agent Skills

### What was done

- Installed project-local skills under `.agents/skills`.
- Added `skills-lock.json` to record sources and content hashes.
- Added `AGENT_SKILLS.md` to document when each skill should be used during the migration.
- Added `.agents/` to `.gitignore` so installed skill contents stay local.

### Installed skills

- `vercel-react-best-practices`
- `react-components`
- `react-best-practices`
- `monorepo-management`
- `next-best-practices`
- `shadcn-ui`
- `typescript-advanced-types`
- `turborepo`

### Notes

- These are repository-local agent skills, not app runtime dependencies.
- No package dependencies were added to `package.json`.
- `.agents/` is ignored; `skills-lock.json` is the versioned record.
- Future agents should prefer these skills when touching React, Next.js, monorepo structure, TypeScript contracts, and shadcn UI.
