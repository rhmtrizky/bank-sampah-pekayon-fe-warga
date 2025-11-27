/**
 * Deposit Request Detail page
 * Shows detailed information about a specific deposit request
 */

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import {
  ApiResponse,
  DepositRequestDetail,
  DepositRequestStatus,
} from "@/types";
import { formatDate, getRelativeTime } from "@/utils/date";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function DepositRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  // Fetch deposit request detail
  const { data, isLoading, error } = useSWR<ApiResponse<DepositRequestDetail>>(
    requestId ? `/deposit-request/${requestId}` : null,
    fetcher
  );

  const request = data?.data;

  /**
   * Get status color
   */
  const getStatusColor = (status: DepositRequestStatus): string => {
    const colors: Record<DepositRequestStatus, string> = {
      [DepositRequestStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [DepositRequestStatus.APPROVED]: "bg-blue-100 text-blue-800",
      [DepositRequestStatus.REJECTED]: "bg-red-100 text-red-800",
      [DepositRequestStatus.COMPLETED]: "bg-green-100 text-green-800",
      [DepositRequestStatus.CANCELLED]: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status: DepositRequestStatus): string => {
    const labels: Record<DepositRequestStatus, string> = {
      [DepositRequestStatus.PENDING]: "Menunggu Konfirmasi",
      [DepositRequestStatus.APPROVED]: "Disetujui",
      [DepositRequestStatus.REJECTED]: "Ditolak",
      [DepositRequestStatus.COMPLETED]: "Selesai",
      [DepositRequestStatus.CANCELLED]: "Dibatalkan",
    };
    return labels[status];
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Request</h1>
            <p className="text-gray-600 mt-1">Informasi lengkap request</p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardBody className="space-y-4">
              <Skeleton height={40} />
              <Skeleton height={60} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </CardBody>
          </Card>
        ) : error || !request ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-red-300 mx-auto mb-4"
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
                <p className="text-gray-500 mb-4">
                  Gagal memuat detail request
                </p>
                <Button variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Status card */}
            <Card>
              <CardBody>
                <div className="text-center">
                  <div
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-medium mb-3 ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusLabel(request.status)}
                  </div>
                  <p className="text-gray-600">
                    {getRelativeTime(request.created_at)}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Main info */}
            <Card>
              <CardBody className="space-y-4">
                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Item Sampah
                  </h3>
                  <div className="space-y-2">
                    {request.items.map((item, idx) => (
                      <div
                        key={item.item_id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.waste_type.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Item #{idx + 1}
                          </p>
                        </div>
                        <p className="text-gray-900 font-semibold">
                          {Number.parseFloat(item.weight_kg).toFixed(3)} kg
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Tanggal Request
                    </h3>
                    <p className="text-gray-900">
                      {formatDate(request.created_at, "long")}
                    </p>
                  </div>

                  {request.scheduled_date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Jadwal Pengepulan
                      </h3>
                      <p className="text-gray-900">
                        {formatDate(request.scheduled_date, "long")}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">RW</h3>
                  <p className="text-gray-900">{request.rw_list.name}</p>
                </div>
              </CardBody>
            </Card>

            {/* Photo */}
            {request.photo && (
              <Card>
                <CardBody>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Foto Sampah
                  </h3>
                  <img
                    src={request.photo}
                    alt="Foto sampah"
                    className="w-full rounded-lg"
                  />
                </CardBody>
              </Card>
            )}

            {/* Contact info */}
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
                    <p className="font-medium mb-1">Informasi</p>
                    <p>
                      Admin akan menghubungi Anda melalui nomor telepon yang
                      terdaftar untuk konfirmasi jadwal penjemputan.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
