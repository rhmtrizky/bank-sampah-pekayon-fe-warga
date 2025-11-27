/**
 * Login Page
 * Refactored for Modern Split-Screen Layout & Visual Appeal
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const registered = searchParams.get("registered");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side: Visual & Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-green-600 to-emerald-900 overflow-hidden text-white items-center justify-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 max-w-lg px-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-xl border border-white/30">
               <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Ubah Sampah Jadi Berkah</h2>
          <p className="text-lg text-green-100 font-light leading-relaxed">
            Bergabunglah dengan Bank Sampah Kelurahan Pekayon. Kelola lingkungan, tabung kebaikan, dan rasakan manfaatnya untuk masa depan yang lebih hijau.
          </p>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex items-center gap-2">
           <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
           </div>
           <span className="font-bold text-gray-900">Bank Sampah</span>
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Welcome Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang 👋</h1>
            <p className="mt-2 text-sm text-gray-600">
              Silakan masukkan kredensial Anda untuk masuk ke dashboard.
            </p>
          </div>

          {/* Alerts */}
          {registered === "true" && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-700">
                Registrasi berhasil! Silakan login sekarang.
              </p>
            </div>
          )}

          {/* Login Form Container */}
          <div className="bg-white lg:bg-transparent rounded-2xl shadow-none">
            <LoginForm />
          </div>

          {/* Footer Links */}
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 Bank Sampah Kelurahan Pekayon. <br className="sm:hidden" /> All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}