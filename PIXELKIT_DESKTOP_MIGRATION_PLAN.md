# PixelKit Desktop MVP Monorepo Migration

## Summary
- Convert the repo into a `pnpm` monorepo with `apps/web`, `apps/desktop`, `packages/editor`, `packages/core`, and `packages/platform`.
- Keep the current Next.js + MongoDB + Cloudinary backend inside `apps/web`.
- Build `apps/desktop` with Electron + React + Vite as a local-first app.
- Desktop requires online login once, then allows offline use with cached session.
- Desktop stores projects locally in SQLite and assets/previews on disk.
- Cloud sync is manual in v1; conflicts create a copy instead of overwriting data.

## Key Changes
- Create workspace structure:
  - `apps/web`: current Next.js app, API routes, MongoDB schemas, Cloudinary upload, auth pages, web dashboard.
  - `apps/desktop`: Electron main/preload + Vite React renderer.
  - `packages/editor`: shared React/Konva/Jotai editor UI and editor state.
  - `packages/core`: serializable project/page/shape types, schema helpers, snapshot parsing/building, pure editor/domain logic.
  - `packages/platform`: shared interfaces for auth, project storage, assets, preview/export, navigation, environment, and sync.
- Use `pnpm-workspace.yaml` and package-level `tsconfig` references/aliases.
- Keep `@stylespixelkit/*` available to both web and desktop by moving Panda/styled-system config to a shared package or root-generated workspace output.
- Keep Next Pages Router unchanged for web during v1 to reduce migration risk.

## Implementation Changes
- Extract shared project model:
  - Define `ProjectDocument`, `PageDocument`, `ShapeDocument`, `ProjectPreview`, `LocalProjectRecord`, and `SyncStatus` in `packages/core`.
  - Move pure JSON parsing/building out of `src/editor/states/projects.ts` into `packages/core`.
  - Keep Jotai atom hydration/dehydration in `packages/editor`, because it depends on React/Jotai runtime.
- Introduce platform interfaces in `packages/platform`:
  - `AuthAdapter`: `login`, `logout`, `getSession`, `refreshSession`, `isAuthenticated`.
  - `ProjectRepository`: `list`, `get`, `create`, `updateSnapshot`, `delete`, `duplicateFromConflict`.
  - `AssetRepository`: `saveAsset`, `getAssetUrl`, `deleteAsset`, `savePreview`.
  - `CloudSyncService`: `pushProject`, `pullProject`, `getRemoteProject`, `detectConflict`.
  - `NavigationAdapter`: `openProject`, `goHome`, `getActiveProjectId`.
- Web adapter:
  - Wrap current `/api/*` calls from `src/services/*`.
  - Keep MongoDB, Cloudinary, cookies, organizations, and public project sharing web-only.
  - Replace direct imports from `@/db/schemas/types` inside editor code with shared `packages/core` types.
- Desktop adapter:
  - Electron main owns SQLite and filesystem access.
  - Renderer talks to main through typed IPC exposed by preload.
  - Store SQLite DB at `app.getPath("userData")/pixelkit.sqlite`.
  - Store assets/previews at `app.getPath("userData")/assets/{projectId}/`.
  - Cache auth token/session using Electron `safeStorage` or encrypted data in `userData`; require online login only when no valid cached session exists.
  - Use absolute API base URL for login/manual sync, configured by env such as `VITE_PIXELKIT_API_BASE_URL`.
- Editor package:
  - Move current `src/editor` into `packages/editor/src`.
  - Remove direct dependencies on `next/router`, `next/dynamic`, `next/link`, `window.location.pathname`, Cloudinary services, Mongo types, and cookie-based auth.
  - Replace `useTimerAutoSave` with a platform-driven autosave hook that saves local snapshots through `ProjectRepository`.
  - Keep preview generation/export logic shared, but route final save/download through platform adapters.
- Desktop MVP screens:
  - Login screen: online login, then session cache.
  - Project dashboard: list local projects, create project, open project, delete project, manual cloud sync action.
  - Editor screen: shared `PixelEditor` with desktop platform provider.
- Conflict rule:
  - On manual sync, compare local `updatedAt`/revision with remote version.
  - If both changed since last sync, create a duplicate local project named like `"{name} local copy"` and preserve both versions.
  - Do not overwrite local or remote data silently in v1.

## Test Plan
- Web:
  - `pnpm --filter web typecheck`
  - `pnpm --filter web build`
  - Verify existing flows: login, project list, create project, open editor, autosave to API, public project view.
- Shared packages:
  - Unit tests for project snapshot parse/build, shape serialization, and platform interface mocks.
  - Typecheck `packages/core`, `packages/platform`, and `packages/editor`.
- Desktop:
  - `pnpm --filter desktop dev` opens Electron app.
  - Online login creates cached session.
  - Relaunch without internet still opens dashboard and editor.
  - Create project offline, edit canvas, close app, reopen, verify project persists.
  - Add/import asset, verify asset persists from local filesystem.
  - Manual sync with no conflict uploads project.
  - Manual sync with conflict creates a copy.
- Regression:
  - Confirm editor behavior stays consistent between web and desktop for page creation, shape editing, selection, export preview, undo/redo where currently supported.

## Assumptions
- Package manager stays `pnpm`.
- Desktop v1 uses Electron + Vite + React, not Next inside Electron.
- Desktop local DB is SQLite.
- Desktop auth is “login online once, then offline with cached session.”
- Desktop cloud save/sync is manual in v1.
- MongoDB, Cloudinary, organizations, and public sharing remain web-owned for now.
- The first implementation milestone is a usable Desktop MVP: login, local project dashboard, and shared editor.
