import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "/api", // ahora todas las llamadas usan /api como prefijo
  headers: {
    "Content-Type": "application/json",
  },
});
