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

- [ ] Create `apps/desktop` with Electron main/preload and a Next.js renderer.
- [ ] Keep Next.js API routes out of the desktop local backend; use Electron IPC for local persistence.
- [ ] Add desktop login with cached session.
- [ ] Add SQLite-backed local project repository.
- [ ] Add local assets/previews under Electron `userData`.
- [ ] Add dashboard and editor screens.

## Phase 5: Manual Cloud Sync

- [ ] Add manual push/pull sync from desktop.
- [ ] Detect divergence between local and remote projects.
- [ ] Create a local copy when conflict is detected.
- [ ] Record sync status per project.
