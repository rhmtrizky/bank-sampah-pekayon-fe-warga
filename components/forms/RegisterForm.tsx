/**
 * Register form component with React Hook Form + Zod validation
 */

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { get, post } from "@/libs/axios";
import { ApiResponse, RegisterRequest, RegisterResponse } from "@/types";
import { passwordSchema } from "@/utils/validators";
// Validators are inlined in the schema below

/**
 * RW interface
 */
interface RW {
  rw_id: string;
  name: string;
}

/**
 * Register form schema validation
 */
const registerSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z
      .string()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Format email tidak valid"
      )
      .optional()
      .nullable(),
    phone: z
      .string()
      .min(6, "Nomor telepon minimal 6 karakter")
      .max(20, "Nomor telepon maksimal 20 karakter")
      .optional()
      .nullable(),
    alamat: z
      .string()
      .min(5, "Alamat minimal 5 karakter")
      .optional()
      .nullable(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    rt: z.number().int().positive().optional().nullable(),
    rw: z.number().int().positive({ message: "RW wajib dipilih" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

/**
 * Infer TypeScript type from schema
 */
type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register form component
 */
export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rwList, setRwList] = useState<RW[]>([]);
  const [isLoadingRw, setIsLoadingRw] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  /**
   * Fetch RW list on component mount
   */
  useEffect(() => {
    const fetchRwList = async (): Promise<void> => {
      try {
        const response = await get<ApiResponse<RW[]>>("/rw");
        setRwList(response.data);
      } catch (error) {
        console.error("Failed to fetch RW list:", error);
      } finally {
        setIsLoadingRw(false);
      }
    };

    fetchRwList();
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;

      await post<ApiResponse<RegisterResponse>, RegisterRequest>(
        "/auth/register",
        registerData
      );

      // Redirect to login with success message
      router.push("/login?registered=true");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      setError("root", {
        type: "manual",
        message: "Registrasi gagal. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name field */}
      <Input
        {...register("name")}
        type="text"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        error={errors.name?.message}
        className="text-gray-600"
        fullWidth
        required
      />

      {/* Email field */}
      <Input
        {...register("email")}
        type="email"
        label="Email (Opsional)"
        placeholder="contoh@email.com"
        error={errors.email?.message}
        className="text-gray-600"
        fullWidth
      />

      {/* Phone field */}
      <Input
        {...register("phone")}
        type="tel"
        label="Nomor Telepon (Opsional)"
        placeholder="08xxxxxxxxxx"
        error={errors.phone?.message}
        className="text-gray-600"
        fullWidth
      />

      {/* Address field */}
      <Input
        {...register("alamat")}
        type="text"
        label="Alamat (Opsional)"
        placeholder="Masukkan alamat lengkap"
        className="text-gray-600"
        error={errors.alamat?.message}
        fullWidth
      />

      {/* RW selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          RW <span className="text-red-500">*</span>
        </label>
        <select
          {...register("rw", { valueAsNumber: true })}
          disabled={isLoadingRw}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-400"
        >
          <option value="">
            {isLoadingRw ? "Memuat data RW..." : "Pilih RW"}
          </option>
          {rwList.map((rw) => (
            <option key={rw.rw_id} value={rw.rw_id} className="text-gray-600">
              {rw.name}
            </option>
          ))}
        </select>
        {errors.rw && (
          <p className="mt-1 text-sm text-red-600">{errors.rw.message}</p>
        )}
      </div>

      {/* RT field */}
      <Input
        {...register("rt", { valueAsNumber: true })}
        type="number"
        label="RT (Opsional)"
        placeholder="Masukkan RT"
        className="text-gray-600"
        error={errors.rt?.message}
        fullWidth
      />

      {/* Password field */}
      <Input
        {...register("password")}
        type="password"
        label="Password"
        placeholder="Minimal 6 karakter"
        className="text-gray-600"
        error={errors.password?.message}
        fullWidth
        required
      />

      {/* Confirm password field */}
      <Input
        {...register("confirmPassword")}
        type="password"
        label="Konfirmasi Password"
        placeholder="Masukkan ulang password"
        className="text-gray-600"
        error={errors.confirmPassword?.message}
        fullWidth
        required
      />

      {/* Global error message */}
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.root.message}</p>
        </div>
      )}

      {/* Submit button */}
      <Button type="submit" fullWidth isLoading={isLoading}>
        Daftar
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <a
          href="/login"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Masuk sekarang
        </a>
      </p>
    </form>
  );
};
