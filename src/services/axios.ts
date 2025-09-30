import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
export const api: AxiosInstance = axios.create({
  baseURL: "/api", // ahora todas las llamadas usan /api como prefijo
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token && config.headers) {
    (config.headers as Record<string, string>)["Authorization"] = token;
  }
  return config;
});
