/**
 * Edit Profile page
 * Form to edit user profile
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import { put } from "@/libs/axios";
import { ApiResponse, User } from "@/types";
import { useAuthStore } from "@/store/authStore";

export default function EditProfilPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return null;
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: {
    name: string;
    alamat: string;
  }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await put<ApiResponse<User>>("/auth/profile", {
        name: data.name,
        alamat: data.alamat,
      });

      // Update user in store
      setUser(response.data);
      setSuccess(true);

      // Redirect after 1 second
      setTimeout(() => {
        router.push("/profil");
      }, 1000);
    } catch (err) {
      setError("Gagal memperbarui profil. Silakan coba lagi.");
      console.error("Failed to update profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
            <p className="text-gray-600 mt-1">Perbarui informasi akun Anda</p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              Profil berhasil diperbarui! Mengalihkan...
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardBody>
            <ProfileEditForm
              user={user}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
