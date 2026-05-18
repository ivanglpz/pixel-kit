const { copyFileSync, mkdirSync, rmSync } = require("node:fs");
const { join } = require("node:path");
const { build } = require("esbuild");

const desktopRoot = join(__dirname, "..");
const distElectronDir = join(desktopRoot, "dist-electron");

rmSync(distElectronDir, { recursive: true, force: true });
mkdirSync(distElectronDir, { recursive: true });

build({
  entryPoints: [join(desktopRoot, "electron", "main.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: join(distElectronDir, "main.js"),
  sourcemap: true,
  external: ["electron", "better-sqlite3"],
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  logLevel: "info",
})
  .then(() => {
    copyFileSync(
      join(desktopRoot, "electron", "preload.cjs"),
      join(distElectronDir, "preload.cjs"),
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
