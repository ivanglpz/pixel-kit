import {
  parseProjectSnapshot,
  type ProjectPreview,
} from "@pixelkit/core";
import type {
  EditorAssetAdapter,
  EditorSaveAdapter,
} from "@pixelkit/editor";
import { getDesktopApi } from "./desktop-api";

const dataUrlToArrayBuffer = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return response.arrayBuffer();
};

const getImageDimensions = (file: File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image dimensions could not be read"));
    };
    image.src = url;
  });
};

export const createDesktopSaveAdapter = (): EditorSaveAdapter => ({
  async saveProject({ project, previewBase64 }) {
    const api = getDesktopApi();
    const preview: ProjectPreview = await api.assets.savePreview({
      projectId: project.projectId,
      name: "preview.png",
      mimeType: "image/png",
      data: await dataUrlToArrayBuffer(previewBase64),
    });

    await api.projects.updateSnapshot({
      projectId: project.projectId,
      snapshot: parseProjectSnapshot(project.data),
      preview,
    });
  },
});

export const createDesktopAssetAdapter = (): EditorAssetAdapter => ({
  async uploadImage({ projectId, file }) {
    if (!projectId) {
      throw new Error("Project ID is required to save an image");
    }

    const dimensions = await getImageDimensions(file);
    const asset = await getDesktopApi().assets.save({
      projectId,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      data: await file.arrayBuffer(),
      width: dimensions.width,
      height: dimensions.height,
    });

    return {
      name: asset.name,
      url: asset.url,
      width: asset.width ?? dimensions.width,
      height: asset.height ?? dimensions.height,
    };
  },
  async listImages({ projectId }) {
    if (!projectId) {
      throw new Error("Project ID is required to list images");
    }

    const assets = await getDesktopApi().assets.list(projectId);
    return assets.map((asset) => ({
      _id: asset.id,
      url: asset.url,
      mimeType: asset.mimeType,
      size: asset.size,
      createdAt: asset.createdAt,
      name: asset.name,
      width: asset.width ?? 0,
      height: asset.height ?? 0,
    }));
  },
  async deleteImages({ imageIds }) {
    await Promise.all(
      imageIds.map((assetId) => getDesktopApi().assets.delete(assetId)),
    );
  },
});
