import { IPhoto } from "@/db/schemas/types";
import { api } from "./axios";

export const uploadPhoto = async (values: FormData): Promise<IPhoto> => {
  const response = await api.post<{ data: IPhoto }>(
    `/projects/upload`,
    values,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response?.data?.data;
};
