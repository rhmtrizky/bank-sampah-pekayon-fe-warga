/**
 * Edit Profile Page
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
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

  if (!user) return null;

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
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header & Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-green-600 hover:border-green-200 hover:shadow-sm transition-all duration-200"
              aria-label="Kembali"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
              <p className="text-sm text-gray-500">Perbarui informasi dasar akun Anda</p>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="space-y-4">
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl animate-fade-in">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">Berhasil Diperbarui!</p>
                  <p className="text-xs text-green-600">Mengalihkan kembali ke profil...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl animate-fade-in">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-gray-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
             
             <div className="relative z-10">
                <ProfileEditForm
                    user={user}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}