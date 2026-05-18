import {
  serializeProjectSnapshot,
  type ProjectDocument,
} from "@pixelkit/core";
import type { SyncResult } from "@pixelkit/platform";
import { getSession } from "./auth.js";
import type { PixelKitDatabase } from "./database.js";
import {
  duplicateLocalProjectFromConflict,
  getProject,
  getProjectByRemoteId,
  getProjectRow,
  markProjectSynced,
  upsertProjectFromRemote,
} from "./projects.js";

type ApiResponse<T> = {
  data: T;
  error?: string;
};

const getApiBaseUrl = () => {
  const apiBaseUrl = process.env.PIXELKIT_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("PIXELKIT_API_BASE_URL is required for desktop sync");
  }

  return apiBaseUrl;
};

const fetchRemoteProject = async (
  token: string,
  remoteProjectId: string,
): Promise<ProjectDocument> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/projects/byId?id=${remoteProjectId}`,
    {
      headers: {
        Authorization: token,
      },
    },
  );
  const body = (await response.json()) as ApiResponse<ProjectDocument>;

  if (!response.ok || !body.data) {
    throw new Error(body.error ?? "Remote project could not be fetched");
  }

  return body.data;
};

const updateRemoteProject = async (
  token: string,
  project: ProjectDocument,
): Promise<ProjectDocument> => {
  const response = await fetch(`${getApiBaseUrl()}/api/projects/update`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
  const body = (await response.json()) as ApiResponse<ProjectDocument>;

  if (!response.ok || !body.data) {
    throw new Error(body.error ?? "Remote project could not be updated");
  }

  return body.data;
};

const hasRemoteDiverged = (
  localRemoteUpdatedAt: string | null,
  remoteProject: ProjectDocument,
) => {
  return Boolean(
    localRemoteUpdatedAt && localRemoteUpdatedAt !== remoteProject.updatedAt,
  );
};

export const pushProject = async (
  db: PixelKitDatabase,
  localProjectId: string,
): Promise<SyncResult> => {
  const session = getSession(db);
  if (!session) throw new Error("A cached session is required to sync");

  const localProject = getProject(db, localProjectId);
  const localProjectRow = getProjectRow(db, localProjectId);
  if (!localProject || !localProjectRow) {
    throw new Error(`Project ${localProjectId} was not found`);
  }
  if (!localProject.remoteId) {
    throw new Error("This local project is not linked to a remote project yet");
  }

  const remoteProject = await fetchRemoteProject(
    session.accessToken,
    localProject.remoteId,
  );

  if (
    localProject.syncStatus === "dirty" &&
    hasRemoteDiverged(localProjectRow.remote_updated_at, remoteProject)
  ) {
    const copy = duplicateLocalProjectFromConflict(db, localProject);

    return {
      status: "conflict",
      localProject,
      remoteProject,
      copy,
    };
  }

  const updatedRemote = await updateRemoteProject(session.accessToken, {
    ...remoteProject,
    name: localProject.name,
    previewUrl: localProject.preview?.url ?? remoteProject.previewUrl,
    data: serializeProjectSnapshot(localProject.snapshot),
  });

  return {
    status: "synced",
    project: markProjectSynced(db, {
      projectId: localProject.id,
      remoteProject: updatedRemote,
    }),
  };
};

export const pullProject = async (
  db: PixelKitDatabase,
  remoteProjectId: string,
): Promise<SyncResult> => {
  const session = getSession(db);
  if (!session) throw new Error("A cached session is required to sync");

  const remoteProject = await fetchRemoteProject(
    session.accessToken,
    remoteProjectId,
  );
  const existingLocal = getProjectByRemoteId(db, remoteProjectId);
  const existingRow = existingLocal ? getProjectRow(db, existingLocal.id) : null;

  if (
    existingLocal &&
    existingLocal.syncStatus === "dirty" &&
    hasRemoteDiverged(existingRow?.remote_updated_at ?? null, remoteProject)
  ) {
    const copy = duplicateLocalProjectFromConflict(db, existingLocal);
    upsertProjectFromRemote(db, {
      userId: session.user.userId,
      remoteProject,
      localProjectId: existingLocal.id,
    });

    return {
      status: "conflict",
      localProject: existingLocal,
      remoteProject,
      copy,
    };
  }

  return {
    status: "synced",
    project: upsertProjectFromRemote(db, {
      userId: session.user.userId,
      remoteProject,
      localProjectId: existingLocal?.id,
    }),
  };
};
