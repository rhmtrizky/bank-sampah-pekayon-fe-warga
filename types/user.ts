/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN_KELURAHAN = "ADMIN_KELURAHAN",
  ADMIN_RW = "ADMIN_RW",
  WARGA = "WARGA",
}

/**
 * User status enumeration
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

/**
 * Complete user entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  alamat: string | null;
  role: UserRole;
  rw: string | null;
  rt: string | null;
  kelurahan_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

/**
 * Login response with JWT token
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  name: string;
  email?: string | null;
  phone?: string | null;
  password: string;
  rt?: number | null;
  rw: number;
}

/**
 * Register response
 */
export interface RegisterResponse {
  message: string;
  user: User;
}

/**
 * JWT token payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
