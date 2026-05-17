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
