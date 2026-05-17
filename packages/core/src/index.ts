export type EditorMode = "DESIGN_MODE";

export type ShapeTool = "IMAGE" | "TEXT" | "FRAME" | "DRAW" | "ICON";

export type Vector2 = {
  x: number;
  y: number;
};

export type Role = "admin" | "member" | "owner";

export type RoleProject = "developer" | "designer" | "viewer" | "commenter";

export type SyncStatus = "local-only" | "synced" | "dirty" | "conflict";

export type UserProfile = {
  userId: string;
  email: string;
  fullName: string;
  photoUrl: string | null;
};

export type OrganizationMember<T extends Role = Role> = {
  user: UserProfile;
  role: T;
};

export type OrganizationDocument = {
  _id: string;
  name: string;
  members: OrganizationMember[];
};

export type ShapeImageDocument = {
  src: string;
  width: number;
  height: number;
  name: string;
};

export type ShapeNodeDocument = {
  id?: string;
  tool?: ShapeTool;
  parentId?: string | null;
  children?: ShapeDocument[];
  image?: ShapeImageDocument;
  fills?: unknown[];
  strokes?: unknown[];
  effects?: unknown[];
  [key: string]: unknown;
};

export type PageViewport = {
  SCALE: Vector2;
  POSITION: Vector2;
};

export type ShapeDocument = {
  id: string;
  state: ShapeNodeDocument;
};

export type PageDocument = {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  SHAPES: {
    LIST: ShapeDocument[];
  };
  VIEWPORT: PageViewport;
};

export type ProjectSnapshot = {
  [mode in EditorMode]?: {
    LIST: PageDocument[];
    ID: string | null;
  };
};

export type ProjectModeSnapshot = {
  pages: PageDocument[];
  selectedPageId: string | null;
  firstPageId: string | null;
};

export type ProjectPreview = {
  projectId?: string;
  url: string;
  width?: number;
  height?: number;
  updatedAt?: string;
};

export type ProjectDocument = {
  _id: string;
  name: string;
  isPublic: boolean;
  organization?: OrganizationDocument;
  previewUrl: string;
  createdBy?: UserProfile;
  data: string;
  version: number;
  mode: EditorMode;
  createdAt: string;
  updatedAt: string;
};

export type PhotoDocument = {
  _id: string;
  projectId: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  folder: string;
  createdBy: string;
  name: string;
  width: number;
  height: number;
};

export type LocalProjectRecord = {
  id: string;
  remoteId: string | null;
  userId: string;
  name: string;
  snapshot: ProjectSnapshot;
  preview: ProjectPreview | null;
  syncStatus: SyncStatus;
  revision: number;
  lastSyncedRevision: number | null;
  createdAt: string;
  updatedAt: string;
};

export const parseProjectSnapshot = (data: string): ProjectSnapshot => {
  return JSON.parse(data) as ProjectSnapshot;
};

export const serializeProjectSnapshot = (snapshot: ProjectSnapshot): string => {
  return JSON.stringify(snapshot);
};

export const getProjectModeSnapshot = (
  snapshot: ProjectSnapshot,
  mode: EditorMode,
): ProjectModeSnapshot => {
  const modeData = snapshot[mode];
  const pages = modeData?.LIST ?? [];
  const selectedPageId = modeData?.ID ?? null;

  return {
    pages,
    selectedPageId,
    firstPageId: pages[0]?.id ?? null,
  };
};

export const parseProjectDataByMode = (
  data: string,
  mode: EditorMode,
): ProjectModeSnapshot => {
  return getProjectModeSnapshot(parseProjectSnapshot(data), mode);
};
