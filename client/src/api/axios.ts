import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function login(username: string, password: string) {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
}

export async function register(username: string, password: string) {
  const res = await api.post("/auth/register", { username, password });
  return res.data;
}
