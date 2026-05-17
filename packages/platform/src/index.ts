import type {
  LocalProjectRecord,
  ProjectDocument,
  ProjectPreview,
  ProjectSnapshot,
  ShapeImageDocument,
  SyncStatus,
  UserProfile,
} from "@pixelkit/core";

export type AuthSession = {
  accessToken: string;
  user: UserProfile;
  expiresAt: string | null;
  offlineAvailable: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type CreateProjectInput = {
  name: string;
  userId: string;
};

export type UpdateProjectSnapshotInput = {
  projectId: string;
  snapshot: ProjectSnapshot;
  preview?: ProjectPreview | null;
};

export type SaveAssetInput = {
  projectId: string;
  file: File | Blob;
  name: string;
  mimeType: string;
};

export type SavedAsset = {
  id: string;
  projectId: string;
  url: string;
  name: string;
  mimeType: string;
  width?: number;
  height?: number;
  size?: number;
};

export type SyncConflictResult = {
  status: Extract<SyncStatus, "conflict">;
  localProject: LocalProjectRecord;
  remoteProject: ProjectDocument;
  copy: LocalProjectRecord;
};

export type SyncSuccessResult = {
  status: Exclude<SyncStatus, "conflict">;
  project: LocalProjectRecord;
};

export type SyncResult = SyncSuccessResult | SyncConflictResult;

export interface AuthAdapter {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession | null>;
  isAuthenticated(): Promise<boolean>;
}

export interface ProjectRepository {
  list(userId: string): Promise<LocalProjectRecord[]>;
  get(projectId: string): Promise<LocalProjectRecord | null>;
  create(input: CreateProjectInput): Promise<LocalProjectRecord>;
  updateSnapshot(input: UpdateProjectSnapshotInput): Promise<LocalProjectRecord>;
  delete(projectId: string): Promise<void>;
  duplicateFromConflict(input: {
    localProject: LocalProjectRecord;
    remoteProject: ProjectDocument;
  }): Promise<LocalProjectRecord>;
}

export interface AssetRepository {
  saveAsset(input: SaveAssetInput): Promise<SavedAsset | ShapeImageDocument>;
  getAssetUrl(assetId: string): Promise<string | null>;
  deleteAsset(assetId: string): Promise<void>;
  savePreview(input: {
    projectId: string;
    image: Blob;
    name?: string;
  }): Promise<ProjectPreview>;
}

export interface CloudSyncService {
  pushProject(projectId: string): Promise<SyncResult>;
  pullProject(remoteProjectId: string): Promise<SyncResult>;
  getRemoteProject(remoteProjectId: string): Promise<ProjectDocument | null>;
  detectConflict(input: {
    localProject: LocalProjectRecord;
    remoteProject: ProjectDocument;
  }): Promise<boolean>;
}

export interface NavigationAdapter {
  openProject(projectId: string): void;
  goHome(): void;
  getActiveProjectId(): string | null;
}

export type PixelKitPlatform = {
  auth: AuthAdapter;
  projects: ProjectRepository;
  assets: AssetRepository;
  sync: CloudSyncService;
  navigation: NavigationAdapter;
};
