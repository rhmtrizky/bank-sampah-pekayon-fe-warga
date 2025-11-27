/**
 * Deposit Request Card component
 * Displays deposit request with status badge
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { DepositRequest, DepositRequestStatus } from "@/types";
import { formatDate, getRelativeTime } from "@/utils/date";

interface DepositRequestCardProps {
  depositRequest: DepositRequest;
  onClick?: () => void;
}

/**
 * Get status badge color
 */
function getStatusColor(status: DepositRequestStatus): string {
  const colors: Record<DepositRequestStatus, string> = {
    [DepositRequestStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [DepositRequestStatus.APPROVED]: "bg-blue-100 text-blue-800",
    [DepositRequestStatus.REJECTED]: "bg-red-100 text-red-800",
    [DepositRequestStatus.COMPLETED]: "bg-green-100 text-green-800",
    [DepositRequestStatus.CANCELLED]: "bg-gray-100 text-gray-800",
  };
  return colors[status];
}

/**
 * Get status label
 */
function getStatusLabel(status: DepositRequestStatus): string {
  const labels: Record<DepositRequestStatus, string> = {
    [DepositRequestStatus.PENDING]: "Menunggu",
    [DepositRequestStatus.APPROVED]: "Disetujui",
    [DepositRequestStatus.REJECTED]: "Ditolak",
    [DepositRequestStatus.COMPLETED]: "Selesai",
    [DepositRequestStatus.CANCELLED]: "Dibatalkan",
  };
  return labels[status];
}

export const DepositRequestCard: React.FC<DepositRequestCardProps> = ({
  depositRequest,
  onClick,
}) => {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className="cursor-pointer transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-6 h-6 text-green-600"
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
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              Request Setor Sampah
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                depositRequest.status
              )}`}
            >
              {getStatusLabel(depositRequest.status)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {depositRequest.scheduled_date
              ? getRelativeTime(depositRequest.scheduled_date)
              : "Tanggal pengepulan belum dijadwalkan"}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(depositRequest.created_at, "long")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
