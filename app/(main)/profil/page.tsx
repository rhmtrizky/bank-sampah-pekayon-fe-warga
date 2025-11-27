/**
 * User Profile Page
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";

export default function ProfilPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
              <p className="text-sm text-gray-500">Kelola informasi akun Anda</p>
            </div>
            <button 
              onClick={() => router.push("/profil/edit")}
              className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-colors"
            >
              Edit Profil
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-linear-to-tr from-green-400 to-emerald-600 p-1 shadow-lg shadow-green-200">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 space-y-1 mt-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    Warga Aktif
                    </span>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <InfoItem label="Nomor Telepon" value={user.phone || "-"} />
              <InfoItem label="Alamat Rumah" value={user.alamat || "-"} />
              <InfoItem label="Wilayah (RW / RT)" value={`RW 0${user.rw || "-"} / RT 0${user.rt || "-"}`} />
              <InfoItem label="Bergabung Sejak" value={formatDate(user.created_at, "long")} />
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Pengaturan Akun</h3>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <ActionItem 
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                }
                label="Ubah Password"
                onClick={() => router.push("/profil/change-password")}
              />
              <div className="h-px bg-gray-50 mx-4" />
              <ActionItem 
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                }
                label="Keluar Aplikasi"
                isDanger
                onClick={handleLogout}
              />
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

// --- Sub Components ---

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
    <p className="text-gray-900 font-medium">{value}</p>
  </div>
);

const ActionItem = ({ icon, label, onClick, isDanger }: { icon: React.ReactNode, label: string, onClick: () => void, isDanger?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group ${isDanger ? 'text-red-600' : 'text-gray-700'}`}
  >
    <div className="flex items-center gap-3">
      <svg className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icon}
      </svg>
      <span className="font-medium">{label}</span>
    </div>
    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);