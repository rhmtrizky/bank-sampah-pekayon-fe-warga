/**
 * Balance card component
 * Displays user wallet balance
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";

interface BalanceCardProps {
  balance: number;
  isLoading?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  isLoading = false,
}) => {
  return (
    <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-100 mb-1">Saldo Anda</p>
          {isLoading ? (
            <div className="h-8 w-48 bg-green-500 rounded animate-pulse" />
          ) : (
            <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
          )}
        </div>
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};
