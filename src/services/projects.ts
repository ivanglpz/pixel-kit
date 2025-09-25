import { IProject } from "@/db/schemas/types";
import { api } from "./axios";

export const fetchListProjects = async (
  organizationId: string
): Promise<IProject[]> => {
  return api
    .get(`/projects/byList?organizationId=${organizationId}`)
    .then((e) => e.data?.data);
};
