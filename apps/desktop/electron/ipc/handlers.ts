import { ipcMain } from "electron";
import type { PixelKitDatabase } from "../storage/database.js";
import {
  clearSession,
  getSession,
  loginWithCloud,
} from "../storage/auth.js";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProjectSnapshot,
} from "../storage/projects.js";
import {
  deleteAsset,
  listAssets,
  saveAsset,
  savePreview,
} from "../storage/assets.js";
import { pullProject, pushProject } from "../storage/sync.js";
import type { DesktopPaths } from "../storage/paths.js";
import type {
  SaveAssetPayload,
  SavePreviewPayload,
} from "../types.js";
import type {
  CreateProjectInput,
  LoginCredentials,
  UpdateProjectSnapshotInput,
} from "@pixelkit/platform";

export const registerIpcHandlers = (
  db: PixelKitDatabase,
  paths: DesktopPaths,
) => {
  ipcMain.handle("auth:login", (_event, credentials: LoginCredentials) =>
    loginWithCloud(db, credentials),
  );
  ipcMain.handle("auth:logout", () => clearSession(db));
  ipcMain.handle("auth:getSession", () => getSession(db));

  ipcMain.handle("projects:list", (_event, userId: string) =>
    listProjects(db, userId),
  );
  ipcMain.handle("projects:get", (_event, projectId: string) =>
    getProject(db, projectId),
  );
  ipcMain.handle("projects:create", (_event, input: CreateProjectInput) =>
    createProject(db, input),
  );
  ipcMain.handle(
    "projects:updateSnapshot",
    (_event, input: UpdateProjectSnapshotInput) =>
      updateProjectSnapshot(db, input),
  );
  ipcMain.handle("projects:delete", (_event, projectId: string) =>
    deleteProject(db, projectId),
  );

  ipcMain.handle("assets:list", (_event, projectId: string) =>
    listAssets(db, projectId),
  );
  ipcMain.handle("assets:save", (_event, input: SaveAssetPayload) =>
    saveAsset(db, paths, input),
  );
  ipcMain.handle("assets:delete", (_event, assetId: string) =>
    deleteAsset(db, assetId),
  );
  ipcMain.handle("assets:savePreview", (_event, input: SavePreviewPayload) =>
    savePreview(paths, input),
  );

  ipcMain.handle("sync:pushProject", (_event, projectId: string) =>
    pushProject(db, projectId),
  );
  ipcMain.handle("sync:pullProject", (_event, remoteProjectId: string) =>
    pullProject(db, remoteProjectId),
  );
};
