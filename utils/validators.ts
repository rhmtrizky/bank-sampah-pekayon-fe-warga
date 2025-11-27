/**
 * Additional Zod validation schemas
 */

import { z } from "zod";

/**
 * Indonesian phone number validator
 */
export const phoneSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid");

/**
 * Email validator
 */
export const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid");

/**
 * Identifier schema for login: accepts either an email or an Indonesian phone number
 */
export const identifierSchema = z.union([emailSchema, phoneSchema]);

/**
 * Password validator (min 8 chars, must contain letter and number)
 */
export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    "Password harus mengandung huruf dan angka"
  );

/**
 * Positive number validator
 */
export const positiveNumberSchema = z
  .number()
  .positive("Nilai harus lebih dari 0");

/**
 * Indonesian currency amount validator
 */
export const currencySchema = z
  .number()
  .min(1000, "Minimal Rp 1.000")
  .max(100_000_000, "Maksimal Rp 100.000.000");

/**
 * Weight validator (in kg)
 */
export const weightSchema = z
  .number()
  .min(0.1, "Berat minimal 0.1 kg")
  .max(1000, "Berat maksimal 1000 kg");

/**
 * Date string validator (ISO format)
 */
export const dateStringSchema = z.string().refine(
  (date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },
  { message: "Format tanggal tidak valid" }
);

/**
 * Future date validator
 */
export const futureDateSchema = z.string().refine(
  (date) => {
    const parsed = new Date(date);
    return parsed.getTime() > Date.now();
  },
  { message: "Tanggal harus di masa depan" }
);
