# PixelKit Desktop

Reserved for the Electron + Next.js desktop app.

Desktop implementation will start after the shared domain contracts and platform boundary are in place.

The desktop renderer can use Next.js, but local desktop persistence should not depend on Next.js API routes. Use Electron main/preload IPC for SQLite, filesystem assets, auth session cache, and local-first project storage.
