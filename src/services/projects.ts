import { IProject } from "@/db/schemas/types";
import { api } from "./axios";

export const fetchListProjects = async (
  organizationId: string,
): Promise<IProject[]> => {
  return api
    .get(`/projects/byList?organizationId=${organizationId}`)
    .then((e) => e.data?.data);
};

export const createProject = async (
  payload: Pick<IProject, "name"> & { organization: string },
): Promise<IProject> => {
  return api.post(`/projects/create`, payload).then((e) => e.data?.data);
};

export const updateProject = async (
  payload: Pick<IProject, "_id" | "name" | "data">,
) => {
  return api.put(`/projects/update`, payload).then((e) => e.data?.data);
};
export const deleteProject = async (id: string) => {
  return api.delete(`/projects/delete?id=${id}`).then((e) => e.data?.data);
};
export const fetchProjectPublicById = async (
  id: string | undefined | null,
): Promise<IProject> => {
  return api.get(`/projects/byPublicId?id=${id}`).then((e) => e.data?.data);
};
