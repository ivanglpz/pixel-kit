import { fetchProjectPublicById } from "@/services/projects";
import type { ProjectDocument } from "@pixelkit/core";

export type FetchPublicProjectInput = {
  projectId: string | null | undefined;
};

export interface EditorPublicProjectAdapter {
  fetchPublicProject(
    input: FetchPublicProjectInput,
  ): Promise<ProjectDocument | undefined>;
}

export const webEditorPublicProjectAdapter: EditorPublicProjectAdapter = {
  async fetchPublicProject({ projectId }) {
    if (!projectId) return undefined;

    return fetchProjectPublicById(projectId) as Promise<ProjectDocument>;
  },
};
