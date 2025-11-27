/**
 * Jadwal Page
 */

"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import { ApiResponse, Schedule, ScheduleType } from "@/types";
import { useAuthStore } from "@/store/authStore";

// Helper & Config

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

const TYPE_CONFIG = {
  [ScheduleType.PENGUMPULAN]: {
    label: "Pengumpulan Sampah",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    illustration: (
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2h5.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707H19a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V17z" />
            </svg>
        </div>
    )
  },
  [ScheduleType.PENCAIRAN]: {
    label: "Pencairan Saldo",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    illustration: (
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
        </div>
    )
  },
};

const ScheduleItemCard = ({ schedule }: { schedule: Schedule }) => {
  const config = TYPE_CONFIG[schedule.schedule_type as ScheduleType] || TYPE_CONFIG[ScheduleType.PENGUMPULAN];
  const dateObj = new Date(schedule.tanggal);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
  const isToday = new Date().toDateString() === dateObj.toDateString();

  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 relative overflow-hidden">
      {/* Active Indicator if Today */}
      {isToday && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-bl-xl z-10">
            HARI INI
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Date Box */}
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
            <span className="text-xs font-bold text-gray-400 group-hover:text-emerald-600 uppercase">{month}</span>
            <span className="text-xl font-extrabold text-gray-800 group-hover:text-emerald-800">{day}</span>
        </div>

        <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 truncate pr-2">{config.label}</h3>
             </div>
             <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                {schedule.lokasi || "Lokasi di RW setempat"}
             </p>
             
             {/* Badge Type */}
             <div className="mt-3 flex items-center gap-2">
                 <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${config.color.replace('bg-', 'bg-opacity-10 ')}`}>
                    {config.icon}
                    <span>{schedule.jam_mulai} - {schedule.jam_selesai} WIB</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Main Page ---

export default function JadwalPage() {
  const { user } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState<ScheduleType | "ALL">("ALL");

  // Fetch schedules for user
  const { data, isLoading, error } = useSWR<ApiResponse<Schedule[]>>(
    user?.id ? `/schedules/rw/${user.id}` : null,
    fetcher
  );

  const schedules = data?.data || [];

  // Filter schedules
  const filteredSchedules =
    typeFilter === "ALL"
      ? schedules
      : schedules.filter((s) => s.schedule_type === typeFilter);

  // Sort by date (upcoming first)
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jadwal Kegiatan</h1>
              <p className="text-sm text-gray-500 mt-1">Pantau jadwal pengumpulan sampah & pencairan di RW Anda.</p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
             {[
                { value: "ALL", label: "Semua Jadwal" },
                { value: ScheduleType.PENGUMPULAN, label: "🚛 Pengumpulan" },
                { value: ScheduleType.PENCAIRAN, label: "💰 Pencairan" },
             ].map((tab) => {
                 const isActive = typeFilter === tab.value;
                 return (
                     <button
                        key={tab.value}
                        onClick={() => setTypeFilter(tab.value as ScheduleType | "ALL")}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                        isActive
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                            : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                        }`}
                     >
                        {tab.label}
                     </button>
                 )
             })}
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {!user?.id ? (
                // State: No RW Assigned
                <div className="bg-orange-50 rounded-2xl p-8 text-center border border-orange-100">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-orange-800">Profil Belum Lengkap</h3>
                    <p className="text-orange-600 text-sm mt-1 mb-4">Silakan lengkapi data di profil Anda untuk melihat jadwal.</p>
                </div>
            ) : isLoading ? (
                // Loading State
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4">
                      <Skeleton variant="rectangular" width={56} height={56} className="rounded-xl" />
                      <div className="flex-1 space-y-2">
                          <Skeleton width="60%" height={20} />
                          <Skeleton width="40%" height={15} />
                      </div>
                  </div>
                ))
            ) : error ? (
                // Error State
                <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
                    <p className="text-red-600 font-medium">Gagal memuat jadwal</p>
                    <p className="text-red-400 text-sm mt-1">Silakan coba lagi nanti.</p>
                </div>
            ) : sortedSchedules.length === 0 ? (
                // Empty State
                <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg">Tidak ada jadwal</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                      {typeFilter === "ALL"
                        ? "Belum ada jadwal kegiatan untuk Anda saat ini."
                        : "Tidak ada jadwal dengan kategori ini."}
                    </p>
                </div>
            ) : (
                // List Data
                sortedSchedules.map((schedule) => (
                    <ScheduleItemCard key={schedule.id} schedule={schedule} />
                ))
            )}
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex gap-4">
             <div className="text-blue-500 mt-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
                 <h4 className="font-bold text-blue-900 text-sm">Informasi Penting</h4>
                 <ul className="flex flex-col mt-2 space-y-1 text-sm text-blue-800">
                    <p><span className="font-semibold">Pengumpulan:</span> Petugas akan berkeliling mengambil sampah warga.</p>
                    <p><span className="font-semibold">Pencairan:</span> Warga dapat menukarkan saldo tabungan menjadi uang tunai di posko RW.</p>
                    <p><span className="font-semibold">Jadwal: </span>Pastikan Anda datang sesuai jadwal yang tersedia.</p>
                 </ul>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}