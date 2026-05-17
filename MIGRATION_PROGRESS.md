# PixelKit Desktop Migration Progress

## Non-Negotiable Migration Rule

- Do not add tests during this migration unless explicitly requested.
- Do not add test doubles, mocks, fixtures, fake platforms, or test-only helpers unless explicitly requested.
- Do not run test commands, typecheck commands, or verification commands unless explicitly requested.
- Focus only on migration implementation and documentation.

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

- Desktop is intentionally not scaffolded yet. The next useful milestone is to make the editor less dependent on web-only services before creating an Electron + Next.js desktop renderer.

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

## 2026-05-17: Phase 1B Active Project Boundary

### What was done

- Changed `PROJECT_ID_ATOM` from a browser-path-derived atom to explicit editor state.
- Added a `projectId` prop to the main editor entrypoint.
- Updated the web project route to read `router.query.id` and pass it into the editor.

### How it was done

- The editor no longer reads `window.location.pathname` to decide the active project.
- The current web host remains responsible for routing and project selection.
- Existing tab/dashboard flows that set `PROJECT_ID_ATOM` directly are still preserved.

### Verification

- `rg "window.location.pathname" src/editor` returns no matches.
- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

### Current status

- This creates the first real host boundary for desktop: Electron can later set the active project id without emulating a Next route.

## 2026-05-17: Desktop Renderer Direction Clarified

### What changed

- Updated the migration direction from Electron + Vite to Electron + Next.js.
- Kept the existing principle that desktop local persistence should not depend on Next.js API routes.

### Why

- Next.js can be used inside Electron as the renderer/app shell.
- The unsafe coupling for desktop is not Next.js UI; it is relying on web-only API routes, MongoDB, Cloudinary, cookies, and server-only web infrastructure for local-first behavior.

### Current decision

- Web and desktop can both use Next.js UI patterns.
- Web keeps Next.js API routes for cloud/backend behavior.
- Desktop uses Electron main + IPC + SQLite/filesystem for local-first persistence, and only talks to cloud APIs for login/manual sync.

## 2026-05-17: Phase 2A Autosave Adapter Boundary

### What was done

- Added an `EditorSaveAdapter` boundary for project autosave.
- Moved the current web autosave implementation into `webEditorSaveAdapter`.
- Updated `useTimerAutoSave` to call the adapter instead of importing web services directly.
- Added an optional `saveAdapter` prop to the editor entrypoint for a future desktop-local implementation.

### How it was done

- Runtime behavior remains web-compatible: the default adapter still uploads the preview and updates the project through the existing web services.
- The editor hook now depends on a save contract, not directly on Cloudinary preview upload or project API update helpers.

### Verification

- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

### Current status

- The first platform boundary is in place for autosave.
- Next safe step: repeat the same adapter pattern for image uploads in `useEventStage` and the right sidebar image browser.

## 2026-05-17: Phase 2B Canvas Image Upload Adapter

### What was done

- Added an `EditorAssetAdapter` boundary for canvas image uploads.
- Moved current web image optimization/upload behavior into `webEditorAssetAdapter`.
- Updated `useEventStage` to call the asset adapter instead of importing web upload services directly.
- Added an optional `assetAdapter` prop to the editor entrypoint and passed it into the stage hook.

### How it was done

- Runtime behavior remains web-compatible: the default adapter still optimizes the image and uploads it through the existing web service.
- The canvas event hook now depends on an asset contract, not directly on Cloudinary upload helpers.
- The right sidebar image browser was intentionally left unchanged for a later, separate phase.

### Verification

- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

### Current status

- Autosave and canvas image upload now both have host-swappable adapters.
- Next safe step: apply a similar boundary to the right sidebar image browser/gallery.

## 2026-05-17: Phase 2C Image Gallery Asset Adapter

### What was done

- Expanded `EditorAssetAdapter` with image listing and image deletion methods.
- Moved right sidebar image gallery list/delete/upload behavior behind the asset adapter.
- Passed the editor `assetAdapter` prop through `SidebarRight` into `LayoutShapeConfig`.
- Kept the existing web implementation inside `webEditorAssetAdapter`, where it still wraps the current photo services and image optimizer.

### How it was done

- `src/editor/sidebar/sidebar-right-shape.tsx` no longer imports `uploadPhoto`, `fetchListPhotosProject`, `deleteManyPhotos`, or `optimizeImageFile` directly.
- The sidebar now works against editor asset contracts, so a future desktop host can provide local filesystem/IPC behavior without changing the panel UI.
- The adapter supports skipped optimization, preserving the sidebar behavior of uploading images under 1MB as-is.
- Upload error handling now accepts both Axios-shaped web errors and normal adapter errors for desktop/local implementations.

### Verification

- `rg "services/(photo|photos)|uploadPhoto|fetchListPhotosProject|deleteManyPhotos|optimizeImageFile" src/editor -g '*.ts' -g '*.tsx'` now only reports `src/editor/platform/save.ts` and `src/editor/platform/assets.ts`.
- `./node_modules/.bin/tsc -p packages/core/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc -p packages/platform/tsconfig.json --noEmit` passed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` passed.

### Current status

- Editor upload/update service calls are now isolated to platform adapter files.
- MongoDB, Cloudinary, cookies, organizations, and public sharing remain web-owned.

## 2026-05-17: Test Work Deferred

### What changed

- Removed the platform test-double work that had been added prematurely.
- Removed the `@pixelkit/platform` export for that helper.
- Marked test doubles as blocked in `MIGRATION_TASKS.md` unless explicitly requested.

### Current instruction

- Do not add tests, test doubles, mocks, fixtures, or test-specific helpers during the migration unless explicitly requested.
- Do not run test, typecheck, or verification commands as part of migration work unless explicitly requested.

### Current status

- Continue migration work only.
- Next safe step: Phase 3 editor package extraction, starting with shims or adapter props for remaining Next-only pieces before moving files.


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
