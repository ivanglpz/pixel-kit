import { api } from "@/services/axios";
import type { ProjectDocument } from "@pixelkit/core";

type ProjectApiResponse = {
  data: ProjectDocument;
};

export type FetchEditorProjectInput = {
  projectId: string;
};

export interface EditorProjectAdapter {
  fetchProject(input: FetchEditorProjectInput): Promise<ProjectDocument>;
}

export const webEditorProjectAdapter: EditorProjectAdapter = {
  async fetchProject({ projectId }) {
    const response = await api.get<ProjectApiResponse>(
      `/projects/byId?id=${projectId}`,
    );

    return response.data.data;
  },
};
