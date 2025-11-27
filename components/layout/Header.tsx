/**
 * Header component for main layout
 * Refactored for Modern Glassmorphism & Minimalist UI
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand / Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push("/home")}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-green-500 to-emerald-600 shadow-lg shadow-green-500/20 group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-105">
              <svg
                className="w-6 h-6 text-white"
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
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Bank Sampah
              </h1>
              <p className="text-[10px] font-semibold tracking-wider text-green-600 uppercase">
                Kel. Pekayon
              </p>
            </div>
          </div>

          {/* Right Actions: Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Button */}
            <button
              onClick={() => router.push("/notifikasi")}
              className="relative p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Notifikasi"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/20" />
            </button>

            {/* Divider (Mobile hidden) */}
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-1">
              {/* Profile Info */}
              <button
                onClick={() => router.push("/profil")}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-50 transition-all duration-200 group text-left"
              >
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-gray-200 to-gray-300 p-0.5 shadow-inner">
                  {/* Avatar Placeholder / Image */}
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-600 group-hover:text-green-600 transition-colors">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    {user?.name || "Warga"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Warga Aktif
                  </p>
                </div>
              </button>

              {/* Logout Button  */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 ml-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full transition-all duration-200 active:scale-95"
                title="Keluar dari Aplikasi"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
