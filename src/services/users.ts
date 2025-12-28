import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { api } from "./axios";

export const loginUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return api.post("/users/login", {
    email,
    password,
  });
};
export const createUser = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  return api.post("/users/create", {
    fullName,
    email,
    password,
  });
};

type ResponseMe = {
  message: string;
  user: {
    email: string;
    fullName: string;
    userId: string;
    photoUrl: string | null;
  };
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
    }
  );
};
