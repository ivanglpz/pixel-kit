# PixelKit Desktop Migration Tasks

This file tracks the migration as small phases. Each phase should leave the app in a understandable state and record what changed in `MIGRATION_PROGRESS.md`.

## Non-Negotiable Migration Rule

- Do not add tests during this migration unless explicitly requested.
- Do not add test doubles, mocks, fixtures, fake platforms, or test-only helpers unless explicitly requested.
- Do not run test commands, typecheck commands, or verification commands unless explicitly requested.
- Focus only on migration implementation and documentation.

## Phase 0: Migration Control Plane

- [x] Store the desktop migration plan in `PIXELKIT_DESKTOP_MIGRATION_PLAN.md`.
- [x] Add a workspace manifest without moving the web app yet.
- [x] Create initial shared package contracts for `core` and `platform`.
- [x] Create this task board and the progress log.

## Phase 1: Shared Domain Contracts

- [x] Replace web-only project/photo type imports in editor code with `@pixelkit/core`.
- [x] Move pure project snapshot parsing/serialization helpers into `@pixelkit/core`.
- [x] Isolate the active editor project id from `window.location.pathname`.
- [ ] Add focused tests for snapshot parsing/building. Blocked by migration rule: do not do this unless explicitly requested.
- [x] Keep Jotai atom hydration inside the editor package instead of moving it into core.

## Phase 2: Platform Boundary

- [x] Introduce a web save adapter that wraps current project preview/update services.
- [x] Introduce a web asset adapter that wraps current canvas image upload/optimization services.
- [x] Replace direct editor calls to upload/update services with platform contracts.
- [x] Keep MongoDB, Cloudinary, cookies, organizations, and public sharing web-only.
- [ ] Add test doubles for platform interfaces. Blocked by migration rule: do not do this unless explicitly requested.

## Phase 3: Editor Package Extraction

- [x] Create the initial `@pixelkit/editor` workspace package.
- [x] Point web editor routes at `@pixelkit/editor`.
- [x] Replace `@/editor/*` imports inside the editor with relative imports.
- [x] Move `src/editor` into `packages/editor/src`.
- [x] Add shims or adapter props for remaining Next-only pieces.
- [x] Keep web importing the same editor behavior through the package.
- [ ] Verify the current web editor still builds and opens. Blocked by migration rule: do not do this unless explicitly requested.

## Phase 4: Desktop Shell

- [x] Create `apps/desktop` with Electron main/preload and a Next.js renderer.
- [x] Keep Next.js API routes out of the desktop local backend; use Electron IPC for local persistence.
- [x] Add desktop login with cached session.
- [x] Add SQLite-backed local project repository.
- [x] Add local assets/previews under Electron `userData`.
- [x] Add dashboard and editor screens.
- [ ] Refresh workspace install/lockfile. Blocked until explicitly requested.

## Phase 5: Manual Cloud Sync

- [x] Add manual push/pull sync from desktop.
- [x] Detect divergence between local and remote projects.
- [x] Create a local copy when conflict is detected.
- [x] Record sync status per project.
- [ ] Refresh workspace install/lockfile. Blocked until explicitly requested.

## Phase 6: Desktop Stabilization

- [x] Refresh workspace install/lockfile after explicit approval.
- [x] Add Electron and desktop runtime dependencies after explicit approval.
- [x] Verify the desktop renderer typecheck/build after explicit approval.
- [x] Fix desktop renderer package transpilation and module aliases.
- [x] Fix duplicate React runtime in the desktop renderer.
- [x] Verify the desktop renderer loads in browser fallback mode.
- [x] Remove missing cursor asset reference that caused a renderer 404.
- [x] Verify the Electron window and IPC bridge runtime.

## Phase 7: Packaging And Release Prep

- [x] Add a production desktop build/package path.
- [x] Configure static Next export for Electron packaging.
- [x] Add macOS DMG packaging with Electron Builder.
- [x] Keep generated `.next`, `out`, `dist-electron`, and `dist` artifacts out of git.
- [x] Decide signing/notarization requirements for this phase: local-only DMG, no Developer ID certificate, no notarization.
- [x] Document desktop environment variables and release commands.
