import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import type { ProjectPreview } from "@pixelkit/core";
import type {
  AssetRow,
  SaveAssetPayload,
  SavePreviewPayload,
  StoredAssetRecord,
} from "../types.js";
import type { PixelKitDatabase } from "./database.js";
import type { DesktopPaths } from "./paths.js";

const nowIso = () => new Date().toISOString();

const extensionFromName = (name: string, fallback: string) => {
  return extname(name) || fallback;
};

const rowToAsset = (row: AssetRow): StoredAssetRecord => ({
  id: row.id,
  projectId: row.project_id,
  url: row.url,
  path: row.path,
  name: row.name,
  mimeType: row.mime_type,
  width: row.width ?? undefined,
  height: row.height ?? undefined,
  size: row.size,
  createdAt: row.created_at,
});

export const listAssets = (
  db: PixelKitDatabase,
  projectId: string,
): StoredAssetRecord[] => {
  const rows = db
    .prepare("SELECT * FROM assets WHERE project_id = ? ORDER BY created_at DESC")
    .all(projectId) as AssetRow[];

  return rows.map(rowToAsset);
};

export const saveAsset = (
  db: PixelKitDatabase,
  paths: DesktopPaths,
  input: SaveAssetPayload,
): StoredAssetRecord => {
  const id = randomUUID();
  const projectDir = join(paths.assetsDir, input.projectId);
  mkdirSync(projectDir, { recursive: true });

  const fileName = `${id}${extensionFromName(input.name, ".bin")}`;
  const filePath = join(projectDir, fileName);
  const buffer = Buffer.from(input.data);
  writeFileSync(filePath, buffer);

  const createdAt = nowIso();
  const url = `pixelkit://assets/${input.projectId}/${fileName}`;

  db.prepare(
    `INSERT INTO assets (
      id, project_id, url, path, name, mime_type, width, height, size, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.projectId,
    url,
    filePath,
    input.name,
    input.mimeType,
    input.width ?? null,
    input.height ?? null,
    buffer.byteLength,
    createdAt,
  );

  return {
    id,
    projectId: input.projectId,
    url,
    path: filePath,
    name: input.name,
    mimeType: input.mimeType,
    width: input.width,
    height: input.height,
    size: buffer.byteLength,
    createdAt,
  };
};

export const deleteAsset = (
  db: PixelKitDatabase,
  assetId: string,
): void => {
  const row = db
    .prepare("SELECT * FROM assets WHERE id = ?")
    .get(assetId) as AssetRow | undefined;

  if (row) {
    rmSync(row.path, { force: true });
  }

  db.prepare("DELETE FROM assets WHERE id = ?").run(assetId);
};

export const savePreview = (
  paths: DesktopPaths,
  input: SavePreviewPayload,
): ProjectPreview => {
  const projectDir = join(paths.previewsDir, input.projectId);
  mkdirSync(projectDir, { recursive: true });

  const fileName = input.name ?? "preview.png";
  const filePath = join(projectDir, fileName);
  writeFileSync(filePath, Buffer.from(input.data));

  return {
    projectId: input.projectId,
    url: `file://${filePath}`,
    updatedAt: nowIso(),
  };
};
