/**
 * Register page
 * Public route - unauthenticated users only
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Sampah</h1>
          <p className="text-gray-600 mt-2">Kelurahan Pekayon</p>
        </div>

        {/* Register card */}
        <Card padding="lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Daftar Akun Baru
          </h2>
          <RegisterForm />
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2025 Bank Sampah Kelurahan Pekayon
        </p>
      </div>
    </div>
  );
}
