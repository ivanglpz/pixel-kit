const { copyFileSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const desktopRoot = join(__dirname, "..");
const distElectronDir = join(desktopRoot, "dist-electron");

mkdirSync(distElectronDir, { recursive: true });
copyFileSync(
  join(desktopRoot, "electron", "preload.cjs"),
  join(distElectronDir, "preload.cjs"),
);
