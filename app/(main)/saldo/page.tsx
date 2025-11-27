/**
 * Saldo page
 * Shows wallet balance and transaction history with filters
 */

"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletHistoryCard } from "@/components/cards/WalletHistoryCard";
import { get } from "@/libs/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Wallet,
  WalletHistory,
  WalletTransactionType,
} from "@/types";
import { formatCurrency, formatCurrencyCompact } from "@/utils/formatCurrency";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function SaldoPage() {
  const [typeFilter, setTypeFilter] = useState<WalletTransactionType | "ALL">(
    "ALL"
  );

  // Fetch wallet info
  const { data: walletData, isLoading: walletLoading } = useSWR<
    ApiResponse<Wallet>
  >("/wallet/me", fetcher);

  // Build query for history
  const historyQuery = typeFilter !== "ALL" ? `?type=${typeFilter}` : "";

  // Fetch wallet history
  const { data: historyData, isLoading: historyLoading } = useSWR<
    ApiResponse<PaginatedResponse<WalletHistory>>
  >(`/wallet/history${historyQuery}`, fetcher);

  const wallet = walletData?.data;
  const history = historyData?.data.data || [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saldo</h1>
          <p className="text-gray-600 mt-1">Riwayat saldo Anda</p>
        </div>

        {/* Balance card */}
        {walletLoading ? (
          <Card>
            <CardBody>
              <Skeleton height={100} />
            </CardBody>
          </Card>
        ) : wallet ? (
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Saldo Tersedia</p>
                  <h2 className="text-3xl font-bold mb-4">
                    {formatCurrency(wallet.saldo)}
                  </h2>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-400/30">
                <div>
                  <p className="text-green-100 text-xs mb-1">Total Transaksi</p>
                  <p className="text-lg font-semibold">
                    {wallet.total_transactions || 0}
                  </p>
                </div>
                <div>
                  <p className="text-green-100 text-xs mb-1">Total Setoran</p>
                  <p className="text-lg font-semibold">
                    {formatCurrencyCompact(wallet.total_deposits || 0)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : null}

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Riwayat</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setTypeFilter("ALL")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  typeFilter === "ALL"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setTypeFilter(WalletTransactionType.DEPOSIT)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  typeFilter === WalletTransactionType.DEPOSIT
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Setor Sampah
              </button>
              <button
                onClick={() => setTypeFilter(WalletTransactionType.WITHDRAWAL)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  typeFilter === WalletTransactionType.WITHDRAWAL
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tarik Saldo
              </button>
              <button
                onClick={() => setTypeFilter(WalletTransactionType.ADJUSTMENT)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  typeFilter === WalletTransactionType.ADJUSTMENT
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Penyesuaian
              </button>
            </div>
          </CardBody>
        </Card>

        {/* History list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Riwayat Transaksi
          </h2>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <div className="flex gap-3">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1">
                      <Skeleton width="60%" />
                      <Skeleton width="40%" className="mt-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : history.length === 0 ? (
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500">
                    {typeFilter === "ALL"
                      ? "Belum ada riwayat transaksi"
                      : "Tidak ada transaksi dengan tipe ini"}
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <WalletHistoryCard key={item.id} history={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
