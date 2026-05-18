import type {
  AuthSession,
  CreateProjectInput,
  LoginCredentials,
  SyncResult,
  UpdateProjectSnapshotInput,
} from "@pixelkit/platform";
import type {
  LocalProjectRecord,
  ProjectPreview,
  ProjectSnapshot,
} from "@pixelkit/core";

export type StoredAssetRecord = {
  id: string;
  projectId: string;
  url: string;
  path: string;
  name: string;
  mimeType: string;
  width?: number;
  height?: number;
  size: number;
  createdAt: string;
};

export type SaveAssetPayload = {
  projectId: string;
  name: string;
  mimeType: string;
  data: ArrayBuffer;
  width?: number;
  height?: number;
};

export type SavePreviewPayload = {
  projectId: string;
  name?: string;
  mimeType: string;
  data: ArrayBuffer;
};

export type DesktopApi = {
  auth: {
    login(credentials: LoginCredentials): Promise<AuthSession>;
    logout(): Promise<void>;
    getSession(): Promise<AuthSession | null>;
  };
  projects: {
    list(userId: string): Promise<LocalProjectRecord[]>;
    get(projectId: string): Promise<LocalProjectRecord | null>;
    create(input: CreateProjectInput): Promise<LocalProjectRecord>;
    updateSnapshot(
      input: UpdateProjectSnapshotInput,
    ): Promise<LocalProjectRecord>;
    delete(projectId: string): Promise<void>;
  };
  assets: {
    list(projectId: string): Promise<StoredAssetRecord[]>;
    save(input: SaveAssetPayload): Promise<StoredAssetRecord>;
    delete(assetId: string): Promise<void>;
    savePreview(input: SavePreviewPayload): Promise<ProjectPreview>;
  };
  sync: {
    pushProject(projectId: string): Promise<SyncResult>;
    pullProject(remoteProjectId: string): Promise<SyncResult>;
  };
};

export type ProjectRow = {
  id: string;
  remote_id: string | null;
  user_id: string;
  name: string;
  snapshot: string;
  preview: string | null;
  sync_status: LocalProjectRecord["syncStatus"];
  revision: number;
  last_synced_revision: number | null;
  created_at: string;
  updated_at: string;
  remote_updated_at: string | null;
};

export type AssetRow = {
  id: string;
  project_id: string;
  url: string;
  path: string;
  name: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  size: number;
  created_at: string;
};

export type SessionRow = {
  id: "current";
  session: string;
  updated_at: string;
};

export type SnapshotJson = ProjectSnapshot;
