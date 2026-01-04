import { IPhoto } from "@/db/schemas/types";
import { DeletePhotosBody } from "@/pages/api/projects/DeleteManyPhotos";
import { api } from "./axios";

export const fetchListPhotosProject = async (
  projectId: string
): Promise<Omit<IPhoto, "createdBy" | "folder" | "projectId">[]> => {
  const response = await api.get(
    `/projects/byPhotoList?projectId=${projectId}`
  );
  return response?.data?.data;
};

export const deleteManyPhotos = async (
  body: DeletePhotosBody
): Promise<Omit<IPhoto, "createdBy" | "folder" | "projectId">[]> => {
  const response = await api.post(`/projects/deleteManyPhotos`, body);
  return response?.data?.data;
};
