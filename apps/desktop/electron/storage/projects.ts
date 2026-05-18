import { randomUUID } from "node:crypto";
import type {
  LocalProjectRecord,
  PageDocument,
  ProjectDocument,
  ProjectPreview,
  ProjectSnapshot,
} from "@pixelkit/core";
import type { CreateProjectInput, UpdateProjectSnapshotInput } from "@pixelkit/platform";
import type { PixelKitDatabase } from "./database";
import type { ProjectRow } from "../types";

const nowIso = () => new Date().toISOString();

const createEmptySnapshot = (): ProjectSnapshot => {
  const pageId = randomUUID();
  const page: PageDocument = {
    id: pageId,
    name: "Page 1",
    color: "black",
    isVisible: true,
    SHAPES: {
      LIST: [],
    },
    VIEWPORT: {
      SCALE: { x: 1, y: 1 },
      POSITION: { x: 0, y: 0 },
    },
  };

  return {
    DESIGN_MODE: {
      LIST: [page],
      ID: pageId,
    },
  };
};

const rowToProject = (row: ProjectRow): LocalProjectRecord => ({
  id: row.id,
  remoteId: row.remote_id,
  userId: row.user_id,
  name: row.name,
  snapshot: JSON.parse(row.snapshot) as ProjectSnapshot,
  preview: row.preview ? (JSON.parse(row.preview) as ProjectPreview) : null,
  syncStatus: row.sync_status,
  revision: row.revision,
  lastSyncedRevision: row.last_synced_revision,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const projectToSnapshot = (project: ProjectDocument): ProjectSnapshot =>
  JSON.parse(project.data) as ProjectSnapshot;

export const listProjects = (
  db: PixelKitDatabase,
  userId: string,
): LocalProjectRecord[] => {
  const rows = db
    .prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC")
    .all(userId) as ProjectRow[];

  return rows.map(rowToProject);
};

export const getProject = (
  db: PixelKitDatabase,
  projectId: string,
): LocalProjectRecord | null => {
  const row = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(projectId) as ProjectRow | undefined;

  return row ? rowToProject(row) : null;
};

export const createProject = (
  db: PixelKitDatabase,
  input: CreateProjectInput,
): LocalProjectRecord => {
  const id = randomUUID();
  const createdAt = nowIso();
  const snapshot = createEmptySnapshot();

  db.prepare(
    `INSERT INTO projects (
      id, remote_id, user_id, name, snapshot, preview, sync_status,
      revision, last_synced_revision, created_at, updated_at, remote_updated_at
    ) VALUES (?, NULL, ?, ?, ?, NULL, 'local-only', 1, NULL, ?, ?, NULL)`,
  ).run(id, input.userId, input.name, JSON.stringify(snapshot), createdAt, createdAt);

  const project = getProject(db, id);
  if (!project) throw new Error("Desktop project was not created");

  return project;
};

export const updateProjectSnapshot = (
  db: PixelKitDatabase,
  input: UpdateProjectSnapshotInput,
): LocalProjectRecord => {
  const existing = getProject(db, input.projectId);
  if (!existing) {
    throw new Error(`Project ${input.projectId} was not found`);
  }

  db.prepare(
    `UPDATE projects
     SET snapshot = ?, preview = ?, sync_status = 'dirty',
         revision = revision + 1, updated_at = ?
     WHERE id = ?`,
  ).run(
    JSON.stringify(input.snapshot),
    input.preview ? JSON.stringify(input.preview) : null,
    nowIso(),
    input.projectId,
  );

  const updated = getProject(db, input.projectId);
  if (!updated) throw new Error("Desktop project update failed");

  return updated;
};

export const deleteProject = (
  db: PixelKitDatabase,
  projectId: string,
): void => {
  db.prepare("DELETE FROM projects WHERE id = ?").run(projectId);
};

export const getProjectRow = (
  db: PixelKitDatabase,
  projectId: string,
): ProjectRow | null => {
  return (
    (db.prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as
      | ProjectRow
      | undefined) ?? null
  );
};

export const getProjectByRemoteId = (
  db: PixelKitDatabase,
  remoteProjectId: string,
): LocalProjectRecord | null => {
  const row = db
    .prepare("SELECT * FROM projects WHERE remote_id = ?")
    .get(remoteProjectId) as ProjectRow | undefined;

  return row ? rowToProject(row) : null;
};

export const duplicateLocalProjectFromConflict = (
  db: PixelKitDatabase,
  localProject: LocalProjectRecord,
): LocalProjectRecord => {
  const id = randomUUID();
  const createdAt = nowIso();

  db.prepare(
    `INSERT INTO projects (
      id, remote_id, user_id, name, snapshot, preview, sync_status,
      revision, last_synced_revision, created_at, updated_at, remote_updated_at
    ) VALUES (?, NULL, ?, ?, ?, ?, 'conflict', 1, NULL, ?, ?, NULL)`,
  ).run(
    id,
    localProject.userId,
    `${localProject.name} local copy`,
    JSON.stringify(localProject.snapshot),
    localProject.preview ? JSON.stringify(localProject.preview) : null,
    createdAt,
    createdAt,
  );

  const copy = getProject(db, id);
  if (!copy) throw new Error("Conflict copy was not created");

  return copy;
};

export const upsertProjectFromRemote = (
  db: PixelKitDatabase,
  input: {
    userId: string;
    remoteProject: ProjectDocument;
    localProjectId?: string;
  },
): LocalProjectRecord => {
  const snapshot = projectToSnapshot(input.remoteProject);
  const preview: ProjectPreview | null = input.remoteProject.previewUrl
    ? {
        projectId: input.remoteProject._id,
        url: input.remoteProject.previewUrl,
        updatedAt: input.remoteProject.updatedAt,
      }
    : null;
  const now = nowIso();
  const localProjectId = input.localProjectId ?? randomUUID();

  db.prepare(
    `INSERT INTO projects (
      id, remote_id, user_id, name, snapshot, preview, sync_status,
      revision, last_synced_revision, created_at, updated_at, remote_updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'synced', 1, 1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      remote_id = excluded.remote_id,
      name = excluded.name,
      snapshot = excluded.snapshot,
      preview = excluded.preview,
      sync_status = 'synced',
      revision = projects.revision + 1,
      last_synced_revision = projects.revision + 1,
      updated_at = excluded.updated_at,
      remote_updated_at = excluded.remote_updated_at`,
  ).run(
    localProjectId,
    input.remoteProject._id,
    input.userId,
    input.remoteProject.name,
    JSON.stringify(snapshot),
    preview ? JSON.stringify(preview) : null,
    now,
    now,
    input.remoteProject.updatedAt,
  );

  const project = getProject(db, localProjectId);
  if (!project) throw new Error("Remote project was not stored locally");

  return project;
};

export const markProjectSynced = (
  db: PixelKitDatabase,
  input: {
    projectId: string;
    remoteProject: ProjectDocument;
  },
): LocalProjectRecord => {
  const existing = getProject(db, input.projectId);
  if (!existing) throw new Error(`Project ${input.projectId} was not found`);

  db.prepare(
    `UPDATE projects
     SET remote_id = ?, sync_status = 'synced',
         last_synced_revision = revision,
         remote_updated_at = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    input.remoteProject._id,
    input.remoteProject.updatedAt,
    nowIso(),
    input.projectId,
  );

  const project = getProject(db, input.projectId);
  if (!project) throw new Error("Synced project was not reloaded");

  return project;
};
