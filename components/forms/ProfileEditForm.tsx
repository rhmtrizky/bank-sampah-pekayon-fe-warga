/**
 * Profile Edit Form component
 * Form to edit user profile with React Hook Form + Zod
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { emailSchema, phoneSchema } from "@/utils/validators";
import { User } from "@/types";

/**
 * Profile edit form schema
 */
const profileEditSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
});

/**
 * Infer TypeScript type from schema
 */
type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  user: User;
  onSubmit: (data: ProfileEditFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user.name,
      alamat: user.alamat || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <Input
        {...register("name")}
        label="Nama Lengkap"
        placeholder="John Doe"
        className="text-gray-600"
        error={errors.name?.message}
        required
        fullWidth
      />

      {/* Email */}
      <Input
        type="email"
        label="Email"
        placeholder="john@example.com"
        value={user?.email}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
        required
        fullWidth
        disabled
      />

      {/* Phone */}
      <Input
        type="tel"
        label="No. Telepon"
        placeholder="08123456789"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
        value={user?.phone}
        required
        fullWidth
        disabled
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("alamat")}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-600"
          placeholder="Alamat lengkap..."
        />
        {errors.alamat && (
          <p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>
        )}
      </div>

      {/* RW info (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          RW
        </label>
        <input
          type="text"
          value={user.rw || "-"}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
        />
        <p className="mt-1 text-sm text-gray-500">
          Hubungi admin untuk mengubah RW
        </p>
      </div>
      {/* RW info (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          RT
        </label>
        <input
          type="text"
          value={user.rt || "-"}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
        />
        <p className="mt-1 text-sm text-gray-500">
          Hubungi admin untuk mengubah RT
        </p>
      </div>

      {/* Submit button */}
      <Button type="submit" fullWidth isLoading={isLoading}>
        Simpan Perubahan
      </Button>
    </form>
  );
};
