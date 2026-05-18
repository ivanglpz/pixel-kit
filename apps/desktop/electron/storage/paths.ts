import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";

export type DesktopPaths = {
  userData: string;
  databasePath: string;
  assetsDir: string;
  previewsDir: string;
};

export const getDesktopPaths = (): DesktopPaths => {
  const userData = app.getPath("userData");
  const assetsDir = join(userData, "assets");
  const previewsDir = join(userData, "previews");

  mkdirSync(assetsDir, { recursive: true });
  mkdirSync(previewsDir, { recursive: true });

  return {
    userData,
    databasePath: join(userData, "pixelkit.sqlite"),
    assetsDir,
    previewsDir,
  };
};
