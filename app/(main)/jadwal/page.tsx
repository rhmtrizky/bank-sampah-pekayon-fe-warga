/**
 * Jadwal page
 * Shows schedules for user's RW with type filtering
 */

"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScheduleCard } from "@/components/cards/ScheduleCard";
import { get } from "@/libs/axios";
import { ApiResponse, Schedule, ScheduleType } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function JadwalPage() {
  const { user } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState<ScheduleType | "ALL">("ALL");

  // Fetch schedules for user's RW
  const { data, isLoading, error } = useSWR<ApiResponse<Schedule[]>>(
    user?.rw ? `/schedules/rw/${user.rw}` : null,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal</h1>
          <p className="text-gray-600 mt-1">
            Jadwal pengumpulan dan pencairan di RW Anda
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === "ALL"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setTypeFilter(ScheduleType.PENGUMPULAN)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === ScheduleType.PENGUMPULAN
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pengumpulan
          </button>
          <button
            onClick={() => setTypeFilter(ScheduleType.PENCAIRAN)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === ScheduleType.PENCAIRAN
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pencairan
          </button>
        </div>

        {/* Content */}
        {!user?.rw ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-yellow-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-500 mb-4">
                  Silakan lengkapi profil Anda untuk melihat jadwal
                </p>
              </div>
            </CardBody>
          </Card>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="flex gap-3">
                  <Skeleton variant="rectangular" width={56} height={56} />
                  <div className="flex-1">
                    <Skeleton width="60%" />
                    <Skeleton width="80%" className="mt-2" />
                    <Skeleton width="50%" className="mt-2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-red-300 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500">Gagal memuat jadwal</p>
              </div>
            </CardBody>
          </Card>
        ) : sortedSchedules.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">
                  {typeFilter === "ALL"
                    ? "Belum ada jadwal tersedia"
                    : "Tidak ada jadwal dengan tipe ini"}
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedSchedules.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        )}

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardBody>
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi Jadwal</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Pengumpulan:</strong> Jadwal pengambilan sampah dari
                    warga
                  </li>
                  <li>
                    <strong>Pencairan:</strong> Jadwal penarikan saldo untuk
                    warga
                  </li>
                  <li>Pastikan Anda datang sesuai jadwal yang tertera</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
