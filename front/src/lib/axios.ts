import axios from "axios";
import { env } from "../env";
import { Headers } from "@/interception";


export const api = axios.create({
  baseURL: env.VITE_APP_URL,
});

api.interceptors.request.use((config) => {
  const authHeaders = Headers.Authorization();
  if (authHeaders.Authorization) {
    config.headers.Authorization = authHeaders.Authorization;
  }
  return config;
});

