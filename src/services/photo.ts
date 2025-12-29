import { IPhoto } from "@/db/schemas/types";
import { api } from "./axios";

export const uploadPhoto = async (
  values: FormData
): Promise<Pick<IPhoto, "name" | "width" | "height" | "url">> => {
  const response = await api.post<{
    data: Pick<IPhoto, "name" | "width" | "height" | "url">;
  }>(`/projects/upload`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data?.data;
};

export const uploadPhotoPreview = async (
  values: FormData
): Promise<Pick<IPhoto, "name" | "width" | "height" | "url">> => {
  const response = await api.post<{
    data: Pick<IPhoto, "name" | "width" | "height" | "url">;
  }>(`/projects/preview`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data?.data;
};
