import { IUser } from "@/db/schemas/types";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { api } from "./axios";

export const loginUser = ({
  email,
  password,
}: Pick<IUser, "email" | "password">) => {
  return api.post("/users/login", {
    email,
    password,
  });
};
export const createUser = async ({
  fullName,
  email,
  password,
}: Pick<IUser, "fullName" | "email" | "password">) => {
  return api.post("/users/create", {
    fullName,
    email,
    password,
  });
};

type ResponseMe = {
  message: string;
  user: Omit<
    IUser,
    "password" | "passwordUpdatedAt" | "createdAt" | "updatedAt"
  >;
};
export const meUser = async (): Promise<ResponseMe> => {
  const accessToken = Cookies.get("accessToken");
  const response = await api.get<ResponseMe>("/users/me", {
    headers: {
      authorization: accessToken,
    },
  });
  return response?.data;
};
type ChangePasswordResponse = {
  message: string;
  token: string;
};
export const changePassword = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<AxiosResponse<ChangePasswordResponse>> => {
  const accessToken = Cookies.get("accessToken");

  return api.put(
    "/users/change-password",
    {
      oldPassword,
      newPassword,
    },
    {
      headers: {
        authorization: accessToken,
      },
    },
  );
};

export const uploadUserPhoto = async (values: FormData) => {
  const response = await api.post<{
    data: { width: number; height: number; name: string; url: string };
  }>(`/users/photo`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data?.data;
};

export const updateUserProfile = async ({
  fullName,
  photoUrl,
}: Pick<IUser, "fullName" | "photoUrl">) => {
  const response = await api.put<{ message: string }>(`/users/update`, {
    fullName,
    photoUrl,
  });
  return response?.data;
};
