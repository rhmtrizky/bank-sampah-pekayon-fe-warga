/**
 * JWT token utilities
 * Handles token parsing and user extraction
 */

import { JWTPayload } from "@/types";

/**
 * Decode JWT token without verification
 * @param token - JWT token string
 * @returns Decoded JWT payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

/**
 * Get user ID from JWT token
 * @param token - JWT token string
 * @returns User ID or null if invalid
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.userId ?? null;
}

/**
 * Get user role from JWT token
 * @param token - JWT token string
 * @returns User role or null if invalid
 */
export function getRoleFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.role ?? null;
}
