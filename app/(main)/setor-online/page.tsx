/**
 * Setor Online main page
 * Lists all deposit requests with create button
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { DepositRequestCard } from "@/components/cards/DepositRequestCard";
import { get } from "@/libs/axios";
import { ApiResponse, DepositRequest, DepositRequestStatus } from "@/types";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function SetorOnlinePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<DepositRequestStatus | "ALL">("ALL");

  // Fetch deposit requests
  const { data, isLoading, error } = useSWR<ApiResponse<DepositRequest[]>>(
    "/deposit-request/mine",
    fetcher
  );

  const depositRequests = data?.data || [];

  // Filter requests
  const filteredRequests =
    filter === "ALL"
      ? depositRequests
      : depositRequests.filter((req) => req.status === filter);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setor Online</h1>
            <p className="text-gray-600 mt-1">Request penjemputan sampah</p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push("/setor-online/create")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Buat Request
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "ALL", label: "Semua" },
            { value: DepositRequestStatus.PENDING, label: "Menunggu" },
            { value: DepositRequestStatus.APPROVED, label: "Disetujui" },
            { value: DepositRequestStatus.COMPLETED, label: "Selesai" },
            { value: DepositRequestStatus.REJECTED, label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() =>
                setFilter(tab.value as DepositRequestStatus | "ALL")
              }
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === tab.value
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="flex gap-3">
                  <Skeleton variant="rectangular" width={48} height={48} />
                  <div className="flex-1">
                    <Skeleton width="60%" />
                    <Skeleton width="80%" className="mt-2" />
                    <Skeleton width="40%" className="mt-2" />
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
                <p className="text-gray-500">Gagal memuat data</p>
              </div>
            </CardBody>
          </Card>
        ) : filteredRequests.length === 0 ? (
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-gray-500 mb-4">
                  {filter === "ALL"
                    ? "Belum ada request setor sampah"
                    : "Tidak ada request dengan status ini"}
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/setor-online/create")}
                >
                  Buat Request Pertama
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <DepositRequestCard
                key={request.request_id}
                depositRequest={request}
                onClick={() =>
                  router.push(`/setor-online/${request.request_id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
