/**
 * Setor Online main page
 * Updated to match strict DepositRequest types
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { get, patch } from "@/libs/axios";
import { ApiResponse, DepositRequest, DepositRequestStatus } from "@/types";
import { formatDate } from "@/utils/date";

// Components and configs

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

const STATUS_CONFIG = {
  [DepositRequestStatus.PENDING]: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  [DepositRequestStatus.APPROVED]: {
    label: "Disetujui",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: (
      <svg
        className="w-3.5 h-3.5"
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
    ),
  },
  [DepositRequestStatus.COMPLETED]: {
    label: "Selesai",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  [DepositRequestStatus.REJECTED]: {
    label: "Ditolak",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  [DepositRequestStatus.CANCELLED]: {
    label: "Dibatalkan",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

const RequestCard = ({
  request,
  onClick,
  onCancel,
}: {
  request: DepositRequest;
  onClick: () => void;
  onCancel: (id: number) => void;
}) => {
  const config =
    STATUS_CONFIG[request.status as DepositRequestStatus] ||
    STATUS_CONFIG[DepositRequestStatus.PENDING];

  // Format Request ID (e.g., #000123)
  const formattedId = `#${request.request_id.toString().padStart(6, "0")}`;

  // Check if cancellable (only PENDING or APPROVED)
  const isCancellable =
    request.status === DepositRequestStatus.PENDING ||
    request.status === DepositRequestStatus.APPROVED;

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel(request.request_id);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
            <svg
              className="w-5 h-5"
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
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{formattedId}</h3>
            <p className="text-xs text-gray-500">
              {formatDate(request.created_at)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>

      {/* Info Grid - Updated based on available types */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        {/* Jadwal Info (Only if available) */}
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            {request.scheduled_date ? "Jadwal Jemput" : "Info Status"}
          </p>
          <p className="text-sm font-medium text-gray-800">
            {request.scheduled_date
              ? formatDate(request.scheduled_date)
              : request.status === DepositRequestStatus.PENDING
              ? "Menunggu konfirmasi admin"
              : "Lihat detail"}
          </p>
        </div>
        {/* Cancel Button */}
        {isCancellable && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleCancelClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Batalkan Setor</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Page Component

export default function SetorOnlinePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<DepositRequestStatus | "ALL">("ALL");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch deposit requests
  const { data, isLoading, error, mutate } = useSWR<
    ApiResponse<DepositRequest[]>
  >("/deposit-request/mine", fetcher);

  const depositRequests = data?.data || [];

  // Filter requests logic
  const filteredRequests =
    filter === "ALL"
      ? depositRequests
      : depositRequests.filter((req) => req.status === filter);

  // Open cancel modal
  const openCancelModal = (requestId: number): void => {
    setPendingCancelId(requestId);
    setShowCancelModal(true);
  };

  // Handle cancel request
  const handleCancelRequest = async (): Promise<void> => {
    if (!pendingCancelId) return;

    setIsCancelling(true);
    try {
      await patch<ApiResponse<DepositRequest>>(
        `/deposit-request/${pendingCancelId}/cancel`,
        {}
      );
      // Refresh data
      await mutate();
      setShowCancelModal(false);
      setPendingCancelId(null);
    } catch (err) {
      console.error("Failed to cancel request:", err);
      alert("Gagal membatalkan request. Silakan coba lagi.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Setor Sampah Online
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola permintaan penjemputan sampahmu disini.
              </p>
            </div>

            <button
              onClick={() => router.push("/setor-online/create")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all shadow-lg shadow-green-600/20 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Buat Request</span>
            </button>
          </div>

          {/* Filter Chips (Scrollable) */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { value: "ALL", label: "Semua" },
              { value: DepositRequestStatus.PENDING, label: "Menunggu" },
              { value: DepositRequestStatus.APPROVED, label: "Dijadwalkan" },
              { value: DepositRequestStatus.COMPLETED, label: "Selesai" },
              { value: DepositRequestStatus.REJECTED, label: "Ditolak" },
              { value: DepositRequestStatus.CANCELLED, label: "Batal" },
            ].map((tab) => {
              const isActive = filter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() =>
                    setFilter(tab.value as DepositRequestStatus | "ALL")
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-gray-100"
                >
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-3 w-full">
                      <Skeleton variant="circular" width={40} height={40} />
                      <div className="space-y-2 w-1/2">
                        <Skeleton width="80%" height={20} />
                        <Skeleton width="40%" height={15} />
                      </div>
                    </div>
                    <Skeleton width={80} height={24} className="rounded-full" />
                  </div>
                  <Skeleton width="100%" height={1} className="my-4" />
                  <div className="flex gap-10">
                    <Skeleton width={60} height={20} />
                    <Skeleton width={100} height={20} />
                  </div>
                </div>
              ))
            ) : error ? (
              // Error State
              <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
                <p className="text-red-600 font-medium">Gagal memuat data</p>
                <p className="text-red-400 text-sm mt-1">
                  Silakan coba lagi nanti.
                </p>
              </div>
            ) : filteredRequests.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg">
                  Belum ada request
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  {filter === "ALL"
                    ? "Kamu belum pernah membuat permintaan penjemputan sampah."
                    : "Tidak ada permintaan dengan status ini."}
                </p>
                {filter === "ALL" && (
                  <button
                    onClick={() => router.push("/setor-online/create")}
                    className="mt-6 text-green-600 font-semibold text-sm hover:underline"
                  >
                    Buat Request Pertama
                  </button>
                )}
              </div>
            ) : (
              // List Data
              filteredRequests.map((request) => (
                <RequestCard
                  key={request.request_id}
                  request={request}
                  onClick={() =>
                    router.push(`/setor-online/${request.request_id}`)
                  }
                  onCancel={openCancelModal}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          if (!isCancelling) {
            setShowCancelModal(false);
            setPendingCancelId(null);
          }
        }}
        title="Batalkan Request"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Apakah Anda yakin?
              </h4>
              <p className="text-sm text-gray-600">
                Request dengan ID{" "}
                <span className="font-semibold">
                  #{pendingCancelId?.toString().padStart(6, "0")}
                </span>{" "}
                akan dibatalkan. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setShowCancelModal(false);
                setPendingCancelId(null);
              }}
              disabled={isCancelling}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleCancelRequest}
              isLoading={isCancelling}
              disabled={isCancelling}
            >
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
