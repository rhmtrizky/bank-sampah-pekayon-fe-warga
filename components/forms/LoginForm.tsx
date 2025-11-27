/**
 * Login form component with React Hook Form + Zod validation
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { identifierSchema, passwordSchema } from "@/utils/validators";

/**
 * Login form schema validation
 */
const loginSchema = z.object({
  emailOrPhone: identifierSchema,
  password: passwordSchema
});

/**
 * Infer TypeScript type from schema
 */
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login form component
 */
export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await login(data);
      router.push("/home");
    } catch (error) {
      // Error is already handled by auth store
      setError("root", {
        type: "manual",
        message: authError || "Login gagal. Silakan coba lagi.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email field */}
      <Input
        {...register("emailOrPhone")}
        type="text"
        label="Email atau Nomor Telepon"
        placeholder="contoh@email.com atau 08xxxxxxxxxx"
        error={errors.emailOrPhone?.message}
        className="text-gray-600"
        fullWidth
        required
        leftIcon={
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        }
      />

      {/* Password field */}
      <Input
        {...register("password")}
        type="password"
        label="Password"
        placeholder="Masukkan password"
        error={errors.password?.message}
        className="text-gray-600"
        fullWidth
        required
        leftIcon={
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      {/* Global error message */}
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.root.message}</p>
        </div>
      )}

      {/* Submit button */}
      <Button type="submit" fullWidth isLoading={isLoading}>
        Masuk
      </Button>

      {/* Register link */}
      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <a
          href="/register"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Daftar sekarang
        </a>
      </p>
    </form>
  );
};
