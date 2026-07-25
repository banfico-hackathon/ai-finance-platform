// client.js — Scalable Axios API Client with Auto-Bearer Token & 401 Refresh Interceptor
import axios from "axios";
import { getValidToken, refreshTokens, clearAuth } from "./auth";

export const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

// --- Interceptor 1: Pre-Request Token Injection ---
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    clearAuth();
    if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }
  }
  return config;
});

// --- Interceptor 2: 401 Unauthorized Auto-Refresh & Retry ---
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { accessToken } = await refreshTokens();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        clearAuth();
        if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
