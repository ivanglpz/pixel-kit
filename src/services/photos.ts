import { IPhoto } from "@/db/schemas/types";
import { api } from "./axios";

export const fetchListPhotosProject = async (
  projectId: string
): Promise<Omit<IPhoto, "createdBy" | "folder" | "projectId">[]> => {
  const response = await api.get(
    `/projects/byPhotoList?projectId=${projectId}`
  );
  return response?.data?.data;
};
