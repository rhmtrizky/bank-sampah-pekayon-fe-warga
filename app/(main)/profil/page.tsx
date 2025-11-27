/**
 * Profil page
 * Shows user profile information
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";

export default function ProfilPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) {
    return null;
  }

  /**
   * Handle logout
   */
  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-1">Informasi akun Anda</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/profil/edit")}>
            Edit Profil
          </Button>
        </div>

        {/* Profile card */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-6 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Name and email */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2 inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Warga
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Info grid */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  No. Telepon
                </h3>
                <p className="text-gray-900">{user.phone || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Alamat
                </h3>
                <p className="text-gray-900">{user.alamat || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  RW/RT
                </h3>
                <p className="text-gray-900">
                  0{user.rw || "-"} / 0{user.rt || "-"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Bergabung Sejak
                </h3>
                <p className="text-gray-900">
                  {formatDate(user.created_at, "long")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Akun</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <button
              onClick={() => router.push("/profil/change-password")}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <span className="font-medium text-gray-900">Ubah Password</span>
              </div>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium text-red-600">Keluar</span>
              </div>
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
