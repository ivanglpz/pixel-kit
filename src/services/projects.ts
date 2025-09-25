import { IProject } from "@/db/schemas/types";
import { api } from "./axios";

export const fetchListProjects = async (
  organizationId: string
): Promise<IProject[]> => {
  return api
    .get(`/projects/byList?organizationId=${organizationId}`)
    .then((e) => e.data?.data);
};

export const createProject = async (
  payload: Pick<IProject, "name"> & { organization: string }
) => {
  return api.post(`/projects/create`, payload).then((e) => e.data?.data);
};
