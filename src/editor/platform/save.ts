import { uploadPhotoPreview } from "@/services/photo";
import { updateProject } from "@/services/projects";
import { base64ToFile } from "@/utils/base64toFile";
import { optimizeImageFile } from "@/utils/opt-img";
import type { ProjectDocument } from "@pixelkit/core";

export type EditorProjectSnapshot = {
  projectId: string;
  projectName: string;
  isPublic: boolean;
  previewUrl: string;
  data: string;
};

export type SaveEditorProjectInput = {
  project: EditorProjectSnapshot;
  previewBase64: string;
};

export interface EditorSaveAdapter {
  saveProject(input: SaveEditorProjectInput): Promise<void>;
}

export const webEditorSaveAdapter: EditorSaveAdapter = {
  async saveProject({ project, previewBase64 }) {
    const formData = new FormData();
    formData.append(
      "image",
      await optimizeImageFile({
        file: base64ToFile(previewBase64, "preview.png"),
        quality: 25,
      }),
    );
    formData.append("projectId", `${project.projectId}`);

    const response = await uploadPhotoPreview(formData);

    const payload: Pick<
      ProjectDocument,
      "_id" | "name" | "previewUrl" | "data" | "isPublic"
    > = {
      _id: project.projectId,
      data: project.data,
      name: project.projectName,
      isPublic: project.isPublic,
      previewUrl: response?.url ?? "./default_bg.png",
    };

    await updateProject(payload);
  },
};
