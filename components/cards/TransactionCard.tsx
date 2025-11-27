/**
 * Transaction Card component
 * Displays transaction with type indicator
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Transaction, TransactionType, TransactionStatus } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate, getRelativeTime } from "@/utils/date";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

/**
 * Get status badge color
 */
function getStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [TransactionStatus.COMPLETED]: "bg-green-100 text-green-800",
    [TransactionStatus.CANCELLED]: "bg-red-100 text-red-800",
  };
  return colors[status];
}

/**
 * Get status label
 */
function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: "Proses",
    [TransactionStatus.COMPLETED]: "Selesai",
    [TransactionStatus.CANCELLED]: "Batal",
  };
  return labels[status];
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
}) => {
  const isDeposit = transaction.transaction_type === TransactionType.SETOR;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className="cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDeposit ? "bg-green-100" : "bg-blue-100"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              isDeposit ? "text-green-600" : "text-blue-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isDeposit
                  ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                  : "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-gray-900">
              {isDeposit ? "Setor Sampah" : "Tarik Saldo"}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                transaction.status
              )}`}
            >
              {getStatusLabel(transaction.status)}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {getRelativeTime(transaction.tanggal_transaksi)}
          </p>

          {transaction.catatan && (
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {transaction.catatan}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDate(transaction.tanggal_transaksi)}
            </span>
            <span
              className={`font-semibold ${
                isDeposit ? "text-green-600" : "text-blue-600"
              }`}
            >
              {isDeposit ? "+" : "-"}
              {formatCurrency(transaction.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
