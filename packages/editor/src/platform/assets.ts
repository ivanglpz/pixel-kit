import { uploadPhoto } from "@/services/photo";
import { deleteManyPhotos, fetchListPhotosProject } from "@/services/photos";
import { optimizeImageFile } from "@/utils/opt-img";
import type { PhotoDocument } from "@pixelkit/core";

export type UploadedEditorImage = Pick<
  PhotoDocument,
  "name" | "width" | "height" | "url"
>;

export type EditorImageAsset = Omit<
  PhotoDocument,
  "createdBy" | "folder" | "projectId"
>;

export type EditorImageOptimizationOptions = {
  quality?: number;
  maxSizeBytes?: number;
};

export type UploadEditorImageInput = {
  projectId: string | null;
  file: File;
  optimization?: EditorImageOptimizationOptions | false;
};

export type ListEditorImagesInput = {
  projectId: string | null;
};

export type DeleteEditorImagesInput = {
  projectId: string | null;
  imageIds: string[];
};

export interface EditorAssetAdapter {
  uploadImage(input: UploadEditorImageInput): Promise<UploadedEditorImage>;
  listImages(input: ListEditorImagesInput): Promise<EditorImageAsset[]>;
  deleteImages(input: DeleteEditorImagesInput): Promise<void>;
}

export const webEditorAssetAdapter: EditorAssetAdapter = {
  async uploadImage({ projectId, file, optimization }) {
    if (!projectId) {
      throw new Error("Project ID is required to upload images");
    }

    const uploadFile =
      optimization === false
        ? file
        : await optimizeImageFile({
            file,
            quality: optimization?.quality ?? 25,
            maxSizeBytes: optimization?.maxSizeBytes,
          });

    const formData = new FormData();
    formData.append("image", uploadFile);
    formData.append("projectId", projectId);

    return uploadPhoto(formData);
  },

  async listImages({ projectId }) {
    if (!projectId) {
      throw new Error("Project ID is required to list images");
    }

    return fetchListPhotosProject(projectId) as Promise<EditorImageAsset[]>;
  },

  async deleteImages({ projectId, imageIds }) {
    if (!projectId) {
      throw new Error("Project ID is required to delete images");
    }

    await deleteManyPhotos({
      projectId,
      photoIds: imageIds,
    });
  },
};
