# PixelKit Desktop Migration Tasks

This file tracks the migration as small phases. Each phase should leave the app in a understandable state and record what changed in `MIGRATION_PROGRESS.md`.

## Phase 0: Migration Control Plane

- [x] Store the desktop migration plan in `PIXELKIT_DESKTOP_MIGRATION_PLAN.md`.
- [x] Add a workspace manifest without moving the web app yet.
- [x] Create initial shared package contracts for `core` and `platform`.
- [x] Create this task board and the progress log.

## Phase 1: Shared Domain Contracts

- [ ] Replace web-only project type imports in editor-facing code with `@pixelkit/core`.
- [ ] Move pure project snapshot parsing/building helpers into `@pixelkit/core`.
- [ ] Add focused tests for snapshot parsing/building.
- [ ] Keep Jotai atom hydration inside the current editor code until the editor package is extracted.

## Phase 2: Platform Boundary

- [ ] Introduce a web platform adapter that wraps current `/api/*` services.
- [ ] Replace direct editor calls to upload/update services with platform contracts.
- [ ] Keep MongoDB, Cloudinary, cookies, organizations, and public sharing web-only.
- [ ] Add test doubles for platform interfaces.

## Phase 3: Editor Package Extraction

- [ ] Move `src/editor` into `packages/editor/src`.
- [ ] Add shims or adapter props for Next-only pieces.
- [ ] Keep web importing the same editor behavior through the package.
- [ ] Verify the current web editor still builds and opens.

## Phase 4: Desktop Shell

- [ ] Create `apps/desktop` with Electron main/preload and Vite React renderer.
- [ ] Add desktop login with cached session.
- [ ] Add SQLite-backed local project repository.
- [ ] Add local assets/previews under Electron `userData`.
- [ ] Add dashboard and editor screens.

## Phase 5: Manual Cloud Sync

- [ ] Add manual push/pull sync from desktop.
- [ ] Detect divergence between local and remote projects.
- [ ] Create a local copy when conflict is detected.
- [ ] Record sync status per project.

