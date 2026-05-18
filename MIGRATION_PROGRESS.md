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

## 2026-05-17: Phase 3A Editor Package Bridge

### What was done

- Added the initial `packages/editor` workspace package.
- Added an `@pixelkit/editor` TypeScript alias that points to `packages/editor/src/index.ts`.
- Made `@pixelkit/editor` re-export the current editor entrypoint from `src/editor`.
- Updated the private editor route and public project route to import from `@pixelkit/editor`.
- Replaced the editor's internal `@/editor/*` imports with relative imports.
- Added an editor-local `Valid` component so `SidebarRight` no longer imports it from app-level components.
- Removed `next/link` from the editor export toast and used a regular external anchor instead.

### How it was done

- This is a bridge phase: the physical editor files are still in `src/editor`, but web routes now depend on the package entrypoint.
- The package wrapper keeps the current web behavior while allowing the physical move to happen in a smaller follow-up.
- Internal relative imports make the future `src/editor` to `packages/editor/src` move less dependent on root aliases.

### Current constraints

- No tests, typecheck, or verification commands were run.
- The remaining editor extraction blockers are `next/dynamic`, `next-themes`, public-stage `next/router`, app UI imports, and web service imports that are already isolated or intentionally web-owned.

### Current status

- Phase 3 package entrypoint exists.
- Web editor routes now import the editor through `@pixelkit/editor`.
- Next safe step: continue removing or wrapping remaining Next/app-only editor dependencies before the physical directory move.

## 2026-05-17: Phase 3B Next/App Dependency Cleanup

### What was done

- Removed `next/dynamic` from the editor entrypoint and dialog portal.
- Replaced dynamic SSR guards with a small React-only `ClientOnly` wrapper and a mounted dialog portal container.
- Removed `next-themes` from `ThemeComponent` and replaced it with editor-local theme detection.
- Removed `next/link` from the editor export toast.
- Removed `next/router` from the public editor stage; the web route now passes the project id into `PixelKitPublicApp`.
- Added `EditorPublicProjectAdapter` and `webEditorPublicProjectAdapter` for public project loading.
- Added `EditorProjectAdapter` and `webEditorProjectAdapter` for editor project loading.
- Added an editor-local context menu component and switched editor sidebars away from app-level `@/components/ui/context-menu`.

### How it was done

- The current web behavior remains routed through web adapters under `src/editor/platform/*`.
- Editor UI files no longer import Next APIs directly.
- Editor UI files no longer import app-level components directly.
- Root web pages remain responsible for Next routing and pass route-derived data into the editor package entrypoint.

### Current constraints

- No tests, typecheck, or verification commands were run.
- Web service imports still exist inside `src/editor/platform/*` by design.
- `PixelKitStagePublic` still derives a default browser share URL if no host passes one, but desktop can provide `shareUrl` explicitly.

### Current status

- Phase 3 adapter/shim work is complete enough for the physical editor move.
- Next safe step: move `src/editor` into `packages/editor/src` and leave temporary compatibility re-exports for old web imports.

## 2026-05-17: Phase 3C Editor Directory Move

### What was done

- Moved the editor source tree from `src/editor` to `packages/editor/src`.
- Made `packages/editor/src/index.tsx` the real `@pixelkit/editor` entrypoint.
- Removed the temporary package wrapper that re-exported from `src/editor`.
- Updated root TypeScript paths so existing `@/editor` and `@/editor/*` imports resolve to `packages/editor/src`.
- Updated `packages/editor/package.json` and `packages/editor/tsconfig.json` to point at the TSX entrypoint.

### How it was done

- Existing web imports of editor internals are temporarily preserved through path aliases.
- The current web editor routes continue to import the app entrypoint through `@pixelkit/editor`.
- Jotai editor hydration and state remain inside the editor package, not in `@pixelkit/core`.

### Current constraints

- No tests, typecheck, or verification commands were run.
- External web code still imports some editor internals through `@/editor/*`; those aliases now point to the package and can be cleaned up later.
- Web service implementations for save/assets/project loading remain in `packages/editor/src/platform/*` as web adapters.

### Current status

- Phase 3 physical extraction is complete.
- Next safe step: begin Phase 4 desktop shell scaffolding while keeping local persistence in Electron IPC/SQLite, not Next.js API routes.

## 2026-05-17: Phase 4A Desktop Shell And Local Backend

### What was done

- Added the `@pixelkit/desktop` workspace package under `apps/desktop`.
- Added a Next.js renderer for the desktop app.
- Added Electron main process startup and a preload IPC bridge exposed as `window.pixelkitDesktop`.
- Added IPC handlers for auth, projects, assets, and previews.
- Added SQLite-backed local project storage under Electron `userData`.
- Added local asset and preview storage under Electron `userData`.
- Added cached desktop login using the remote login endpoint configured by `PIXELKIT_API_BASE_URL`.
- Added basic desktop screens:
  - login
  - local project dashboard
  - editor route using `@pixelkit/editor`
- Added desktop renderer adapters that connect `@pixelkit/editor` save and asset operations to Electron IPC.
- Added `initialProject` hydration support to `@pixelkit/editor` so desktop can open a local project document directly.

### How it was done

- Desktop local persistence lives in Electron main, not in Next.js API routes.
- The renderer only talks to `window.pixelkitDesktop`.
- SQLite database path: `app.getPath("userData")/pixelkit.sqlite`.
- Asset path: `app.getPath("userData")/assets/{projectId}/`.
- Preview path: `app.getPath("userData")/previews/{projectId}/`.
- Login tokens are cached in SQLite and encrypted with Electron `safeStorage` when available.

### Current constraints

- No tests, typecheck, verification, install, or lockfile refresh commands were run.
- `apps/desktop/package.json` declares new desktop dependencies, but `pnpm-lock.yaml` has not been refreshed.
- Manual cloud sync is not implemented yet.
- The desktop dev flow is currently two commands: one for the Next renderer and one for Electron.

### Current status

- Phase 4 shell, local project repository, local assets/previews, cached login, dashboard, and editor route are scaffolded.
- Next safe step: Phase 5 manual cloud sync, or explicitly refresh/install dependencies if requested.

## 2026-05-17: Phase 5A Manual Cloud Sync

### What was done

- Added desktop IPC handlers for manual project push and pull.
- Added remote project fetch/update helpers in Electron main.
- Added local sync metadata through the SQLite `remote_updated_at` column.
- Added divergence detection between local dirty projects and changed remote projects.
- Added conflict-copy behavior using the `"{name} local copy"` naming rule.
- Added dashboard controls to:
  - pull a remote project by id
  - push a linked local project
- Recorded sync status changes on local project records.

### How it was done

- Sync runs in Electron main, not in Next.js API routes.
- The renderer calls `window.pixelkitDesktop.sync.pullProject` and `window.pixelkitDesktop.sync.pushProject`.
- Pull creates or updates a local SQLite project linked by `remoteId`.
- Push requires an existing `remoteId`; local-only projects are not silently created in the cloud.
- If both local and remote changed, Electron creates a local conflict copy and does not overwrite remote data silently.

### Current constraints

- No tests, typecheck, verification, install, or lockfile refresh commands were run.
- Desktop auth points to the hosted PixelKit web API by default; `PIXELKIT_API_BASE_URL` is only an override for alternate login/sync targets.
- Cloud project creation from local-only desktop projects is not implemented yet because the current web create endpoint requires organization context.

### Current status

- Manual push/pull sync behavior is scaffolded.
- Desktop MVP implementation phases are now present in code.
- Next safe step: explicitly refresh/install workspace dependencies and run verification only if requested.


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

## 2026-05-17: Phase 6A Desktop Stabilization

### What was done

- Refreshed workspace dependencies after explicit approval and added the desktop runtime libraries needed by `@pixelkit/desktop`.
- Replaced the desktop renderer config with `apps/desktop/next.config.mjs` so Next.js loads the desktop-specific configuration.
- Configured desktop renderer transpilation for `@pixelkit/core`, `@pixelkit/editor`, and `@pixelkit/platform`.
- Added desktop renderer aliases for shared workspace imports used by the extracted editor package.
- Forced the desktop renderer to resolve `react`, `react-dom`, and `react/jsx-runtime` from the workspace root to avoid duplicate React runtime errors.
- Changed the desktop project editor page to load `@pixelkit/editor` client-side only, avoiding server-side `konva/react-konva` page-data crashes.
- Added a browser fallback for the desktop login page when the Electron preload bridge is not available.
- Removed the missing `/cursors/default.png` global cursor reference that caused a desktop renderer 404.
- Ignored generated local verification folders so they do not enter migration commits.

### Verification

- `pnpm --filter @pixelkit/desktop exec tsc --noEmit` passed after the desktop stabilization fixes.
- `pnpm --filter @pixelkit/desktop exec next build` passed after the desktop stabilization fixes.
- The desktop renderer loaded on `http://localhost:4210` and showed the login screen with a clear preload-bridge-unavailable message in normal browser mode.

### Current constraints

- These were verification commands explicitly authorized for this stabilization phase.
- No tests, test doubles, mocks, fixtures, or test-specific helpers were added.
- Remaining non-blocking warnings: current Node is `v24.13.1` while the repo declares `22.x`, and Browserslist data is outdated.
- The actual Electron window and IPC bridge runtime still need a direct launch check.

### Current status

- Phase 6 desktop renderer stabilization is complete.
- The Electron static preview launched from the exported renderer and initialized the local SQLite bridge after rebuilding native dependencies for Electron.
- Next safe step: Phase 7 packaging and release prep.

## 2026-05-17: Phase 7A Desktop Packaging

### What was done

- Switched the desktop editor route from dynamic `/project/[id]` to static `/project?id=...` so Next static export can package arbitrary local project ids.
- Added `output: "export"`, static image handling, and relative asset prefixing for the desktop production renderer build.
- Added a production Electron build path:
  - `pnpm --filter @pixelkit/desktop run build`
  - `pnpm --filter @pixelkit/desktop run start`
  - `pnpm --filter @pixelkit/desktop run electron:build:mac`
- Added `tsconfig.electron.json` and a small prepare script to compile Electron main process code into `dist-electron` and copy the preload bridge.
- Updated Electron main to load the exported `out/index.html` in packaged/static mode and the dev server in development mode.
- Added Electron Builder configuration for an unsigned local macOS DMG.
- Updated native runtime dependencies:
  - `better-sqlite3` moved to `12.10.0` for Electron 39 compatibility.
  - `electron-builder` added at `24.13.3` because `26.0.12` conflicts with the repo's pnpm exotic subdependency policy.
- Added generated desktop build outputs to `.gitignore`.

### Verification

- `pnpm --filter @pixelkit/desktop run build` passed and produced a static Next export plus compiled Electron main files.
- `pnpm --filter @pixelkit/desktop run rebuild:native` completed through Electron Builder's native dependency install path.
- `pnpm --filter @pixelkit/desktop start` launched Electron against the exported renderer without startup errors after the native SQLite rebuild.
- `pnpm --filter @pixelkit/desktop run electron:build:mac` passed and generated `apps/desktop/dist/PixelKit-0.0.0-arm64.dmg`.

### Current constraints

- These were build/verification commands explicitly authorized to finish the migration phases.
- No tests, test doubles, mocks, fixtures, or test-specific helpers were added.
- The DMG is unsigned and not notarized; this phase intentionally uses `identity: null`.
- Remaining non-blocking warnings: current Node is `v24.13.1` while the repo declares `22.x`, Browserslist data is outdated, package metadata lacks desktop `description`/`author`, and no custom Electron app icon is configured yet.

### Current status

- Phase 7 packaging is complete for local macOS builds.
- The desktop MVP migration phases are complete through a local-only macOS DMG.

## 2026-05-18: Phase 7B Local DMG Runability

### What was done

- Investigated the generated DMG after a local run attempt failed.
- Confirmed the DMG image checksum is valid and the current machine architecture is `arm64`.
- Mounted the DMG and confirmed `PixelKit.app` is present.
- Found the app bundle failed `codesign --verify --deep --strict` with `code has no resources but signature indicates they must be present`.
- Added a custom Electron Builder mac hook that applies macOS' local ad-hoc code marker (`codesign -s -`) to the assembled `.app` before DMG creation.
- Updated desktop packaging docs to make clear this is a local build without a Developer ID certificate or notarization.

### Why the DMG did not open cleanly

- The DMG file itself was valid, but the app bundle inside it was not structurally codesign-valid.
- The package is intentionally not Developer ID signed or notarized, so Gatekeeper can still block first launch unless the user explicitly approves opening it.
- The DMG should be mounted first; the runnable artifact is `PixelKit.app` inside the mounted volume.

### Current status

- Phase 7 now produces a local DMG whose app bundle is structurally valid on macOS.
- The package is still not ready for broad external distribution until Developer ID signing and notarization are configured.
