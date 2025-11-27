/**
 * Home page - Dashboard for Warga
 * Shows balance, recent transactions, and quick actions
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { BalanceCard } from "@/components/cards/BalanceCard";
import { Card, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import { ApiResponse, Wallet, Transaction, TransactionType } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate, getRelativeTime } from "@/utils/date";

/**
 * SWR fetcher function with proper typing
 */
const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function HomePage() {
  const router = useRouter();

  // Fetch wallet data
  const { data: walletData, isLoading: walletLoading } = useSWR<
    ApiResponse<Wallet>
  >("/wallet/me", fetcher);

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useSWR<
    ApiResponse<Transaction[]>
  >("/transactions/me?limit=5", fetcher);

  const wallet = walletData?.data;
  const transactions = transactionsData?.data || [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di Bank Sampah Kelurahan Pekayon
          </p>
        </div>

        {/* Balance card */}
        <BalanceCard balance={wallet?.saldo ?? 0} isLoading={walletLoading} />

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={() => router.push("/setor-online")}
            className="h-24 flex-col gap-2"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Setor Sampah</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/saldo")}
            className="h-24 flex-col gap-2"
          >
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Riwayat Saldo</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/jadwal")}
            className="h-24 flex-col gap-2"
          >
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Jadwal</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/harga")}
            className="h-24 flex-col gap-2"
          >
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Harga Sampah</span>
          </Button>
        </div>

        {/* Recent transactions */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Transaksi Terbaru</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/transaksi")}
              >
                Lihat Semua
              </Button>
            </div>

            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1">
                      <Skeleton width="60%" />
                      <Skeleton width="40%" className="mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => router.push(`/transaksi/${transaction.id}`)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.transaction_type === TransactionType.SETOR
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          transaction.transaction_type === TransactionType.SETOR
                            ? "text-green-600"
                            : "text-blue-600"
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
                            transaction.transaction_type ===
                            TransactionType.SETOR
                              ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                              : "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          }
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {transaction.transaction_type === TransactionType.SETOR
                          ? "Setor Sampah"
                          : "Tarik Saldo"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getRelativeTime(transaction.tanggal_transaksi)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.transaction_type === TransactionType.SETOR
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {transaction.transaction_type === TransactionType.SETOR
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
