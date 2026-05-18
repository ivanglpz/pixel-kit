# PixelKit Desktop

Electron + Next.js desktop app shell.

## Current Shape

- `electron/main.ts` owns the Electron app lifecycle.
- `electron/preload.cjs` exposes a typed IPC bridge as `window.pixelkitDesktop`.
- `electron/storage/*` owns local persistence.
- `src/pages/*` is the Next.js renderer.
- The renderer uses `@pixelkit/editor` for the shared editor UI.

## Local Persistence

- SQLite database: `app.getPath("userData")/pixelkit.sqlite`
- Assets: `app.getPath("userData")/assets/{projectId}/`
- Previews: `app.getPath("userData")/previews/{projectId}/`
- Login session: cached in SQLite, with token encryption through Electron `safeStorage` when available.

## Backend Boundary

Desktop local persistence must not use Next.js API routes.

- Renderer talks to preload.
- Preload talks to Electron main through IPC.
- Electron main talks to SQLite/filesystem.
- Cloud login uses `PIXELKIT_API_BASE_URL` only for the remote login call.
- Manual cloud sync also uses `PIXELKIT_API_BASE_URL` from Electron main.

## Sync Behavior

- Pull remote project: dashboard accepts a remote project id and stores a local SQLite copy.
- Push project: only enabled for projects with `remoteId`.
- Conflict rule: when local dirty data and remote data both changed, the local version is copied as `"{name} local copy"` and remote data is preserved.
- Local-only project cloud creation is intentionally not wired yet because the current web create endpoint requires organization context.

## Manual Start Shape

The renderer and Electron process are separate commands for now:

- `pnpm --filter @pixelkit/desktop dev:renderer`
- `pnpm --filter @pixelkit/desktop dev:electron`

Dependency installation/lockfile refresh is intentionally left for a later explicit step.
