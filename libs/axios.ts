/**
 * Axios instance with typed interceptors
 * Handles JWT authentication and error responses
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

/**
 * Base API URL from environment or default
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://m0bnqlsf-5000.asse.devtunnels.ms/api";

/**
 * Configured axios instance with interceptors
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  // Do NOT set default Content-Type. Let axios detect JSON vs multipart.
});

/**
 * Request interceptor: Add JWT token to headers
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from localStorage (client-side only)
    if (typeof globalThis !== "undefined" && globalThis.window) {
      const token = globalThis.localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  (error: AxiosError<ApiError>): Promise<AxiosError<ApiError>> => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      if (typeof globalThis !== "undefined" && globalThis.window) {
        globalThis.localStorage.removeItem("auth_token");
        globalThis.localStorage.removeItem("user_data");
        if (!globalThis.window.location.pathname.includes("/login")) {
          globalThis.window.location.href = "/login";
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data?.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data?.message);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe GET request
 */

export async function get<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<T>(url);
  return response.data;
}

/**
 * Type-safe POST request
 */
export async function post<T, D = unknown>(url: string, data?: D): Promise<T> {
  const response = await axiosInstance.post<T>(url, data);
  return response.data;
}

/**
 * Type-safe PUT request
 */
export async function put<T, D = unknown>(url: string, data?: D): Promise<T> {
  const response = await axiosInstance.put<T>(url, data);
  return response.data;
}

/**
 * Type-safe PATCH request
 */
export async function patch<T, D = unknown>(url: string, data?: D): Promise<T> {
  const response = await axiosInstance.patch<T>(url, data);
  return response.data;
}

/**
 * Type-safe DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  const response = await axiosInstance.delete<T>(url);
  return response.data;
}

export default axiosInstance;
