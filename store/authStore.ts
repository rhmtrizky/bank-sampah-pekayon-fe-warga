/**
 * Zustand auth store with full TypeScript typing
 * Manages authentication state and user session
 */

import { create } from "zustand";
import { User, LoginRequest, LoginResponse, ApiResponse } from "@/types";
import { post } from "@/libs/axios";
import { decodeJWT, isTokenExpired } from "@/libs/auth";

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication actions interface
 */
interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loadUserFromStorage: () => void;
  clearError: () => void;
}

/**
 * Complete auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Auth store implementation
 */
export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  /**
   * Login user with credentials
   * Stores token and user data in localStorage
   */
  login: async (credentials: LoginRequest): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const response = await post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );

      const { token, user } = response.data;
      console.log("Login successful, received token:", token);

      // Validate token
      if (!token || isTokenExpired(token)) {
        throw new Error("Token tidak valid atau telah kadaluarsa");
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(user));

        // Set cookie for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi.";

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  /**
   * Logout user and clear session
   * Removes token and user data from localStorage
   */
  logout: (): void => {
    // Clear localStorage and cookie
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Clear cookie
      document.cookie = "auth_token=; path=/; max-age=0";
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /**
   * Update user data in store
   */
  setUser: (user: User): void => {
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user_data", JSON.stringify(user));
    }

    set({ user });
  },

  /**
   * Load user from localStorage on app initialization
   * Called in root layout or middleware
   */
  loadUserFromStorage: (): void => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("auth_token");
    const userDataStr = localStorage.getItem("user_data");

    if (!token || !userDataStr) {
      set({ ...initialState });
      return;
    }

    // Validate token expiration
    if (isTokenExpired(token)) {
      // Token expired, clear storage and cookie
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      document.cookie = "auth_token=; path=/; max-age=0";
      set({ ...initialState });
      return;
    }

    try {
      const user = JSON.parse(userDataStr) as User;

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      document.cookie = "auth_token=; path=/; max-age=0";
      set({ ...initialState });
    }
  },

  /**
   * Clear error state
   */
  clearError: (): void => {
    set({ error: null });
  },
}));
