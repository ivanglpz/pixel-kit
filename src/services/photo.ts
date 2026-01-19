import { IPhoto } from "@/db/schemas/types";
import { api } from "./axios";

type PhotoUploadResponse = Pick<IPhoto, "name" | "width" | "height" | "url">;

type UploadPhotoParams = {
  endpoint: "/projects/upload" | "/projects/preview";
  values: FormData;
};

const uploadPhotoBase = async ({
  endpoint,
  values,
}: UploadPhotoParams): Promise<PhotoUploadResponse> => {
  const response = await api.post<{ data: PhotoUploadResponse }>(
    endpoint,
    values,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

export const uploadPhoto = (values: FormData): Promise<PhotoUploadResponse> =>
  uploadPhotoBase({
    endpoint: "/projects/upload",
    values,
  });

export const uploadPhotoPreview = (
  values: FormData,
): Promise<PhotoUploadResponse> =>
  uploadPhotoBase({
    endpoint: "/projects/preview",
    values,
  });
