/**
 * Main layout wrapper for authenticated pages
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuthStore } from "@/store/authStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loadUserFromStorage } = useAuthStore();

  // Load user from storage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-20 pt-4">{children}</main>
      <Footer />
    </div>
  );
};
