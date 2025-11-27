/**
 * Register Page
 * Refactored for Modern Split-Screen Layout & Visual Appeal
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/forms/RegisterForm";
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
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side: Visual & Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-bl from-emerald-600 to-green-900 overflow-hidden text-white items-center justify-center">
        {/* Abstract Background  */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M100 0 C 80 100 50 100 0 0 Z" fill="white" />
           </svg>
        </div>
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 max-w-lg px-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Mari Mulai Perubahan</h2>
          <p className="text-lg text-emerald-100 font-light leading-relaxed">
            Daftarkan diri Anda sekarang dan jadilah bagian dari komunitas yang peduli terhadap lingkungan. Satu langkah kecil untuk bumi yang lebih baik.
          </p>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex items-center gap-2">
           <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
           </div>
           <span className="font-bold text-gray-900">Bank Sampah</span>
        </div>

        <div className="w-full max-w-md space-y-8 my-auto py-10">
          {/* Welcome Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun Baru 🚀</h1>
            <p className="mt-2 text-sm text-gray-600">
              Lengkapi data di bawah ini untuk bergabung sebagai Warga.
            </p>
          </div>

          {/* Register Form Container */}
          <div className="bg-white lg:bg-transparent rounded-2xl shadow-none">
            <RegisterForm />
          </div>

        </div>
      </div>

    </div>
  );
}