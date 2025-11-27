/**
 * Wallet History Card component
 * Displays wallet transaction history entry
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { WalletHistory, WalletTransactionType } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate, getRelativeTime } from "@/utils/date";

interface WalletHistoryCardProps {
  history: WalletHistory;
}

/**
 * Get transaction type info
 */
function getTypeInfo(type: WalletTransactionType): {
  label: string;
  icon: string;
  color: string;
} {
  const typeMap: Record<
    WalletTransactionType,
    { label: string; icon: string; color: string }
  > = {
    [WalletTransactionType.DEPOSIT]: {
      label: "Setor Sampah",
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
      color: "green",
    },
    [WalletTransactionType.WITHDRAWAL]: {
      label: "Tarik Saldo",
      icon: "M20 12H4",
      color: "blue",
    },
    [WalletTransactionType.ADJUSTMENT]: {
      label: "Penyesuaian",
      icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6",
      color: "purple",
    },
  };
  return typeMap[type];
}

export const WalletHistoryCard: React.FC<WalletHistoryCardProps> = ({
  history,
}) => {
  const typeInfo = getTypeInfo(history.transaction_type);
  const isPositive =
    history.transaction_type === WalletTransactionType.DEPOSIT ||
    history.transaction_type === WalletTransactionType.ADJUSTMENT;

  return (
    <Card>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 bg-${typeInfo.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <svg
            className={`w-6 h-6 text-${typeInfo.color}-600`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={typeInfo.icon}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{typeInfo.label}</h3>
          <p className="text-sm text-gray-500">
            {getRelativeTime(history.tanggal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(history.tanggal, "long")}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right">
          <p
            className={`text-lg font-semibold ${
              isPositive ? "text-green-600" : "text-blue-600"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatCurrency(history.amount)}
          </p>
          <p className="text-sm text-gray-500">
            Saldo: {formatCurrency(history.saldo_after)}
          </p>
        </div>
      </div>
    </Card>
  );
};
