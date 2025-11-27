/**
 * Transaksi main page
 * Lists all transactions with filters
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { TransactionCard } from "@/components/cards/TransactionCard";
import { get } from "@/libs/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  TransactionType,
  TransactionStatus,
} from "@/types";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function TransaksiPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">(
    "ALL"
  );

  // Build query params
  const buildQueryString = (): string => {
    const params = new URLSearchParams();
    if (typeFilter !== "ALL") params.append("type", typeFilter);
    if (statusFilter !== "ALL") params.append("status", statusFilter);
    return params.toString();
  };

  const queryString = buildQueryString();

  // Fetch transactions
  const { data, isLoading, error } = useSWR<
    ApiResponse<PaginatedResponse<Transaction>>
  >(`/transactions/me?${queryString}`, fetcher);

  const transactions = data?.data.data || [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-gray-600 mt-1">Riwayat transaksi Anda</p>
        </div>

        {/* Filters */}
        <Card>
          <CardBody className="space-y-4">
            {/* Type filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Transaksi
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter("ALL")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    typeFilter === "ALL"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTypeFilter(TransactionType.SETOR)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    typeFilter === TransactionType.SETOR
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Setor
                </button>
                <button
                  onClick={() => setTypeFilter(TransactionType.TARIK)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    typeFilter === TransactionType.TARIK
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tarik
                </button>
              </div>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === "ALL"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setStatusFilter(TransactionStatus.PENDING)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === TransactionStatus.PENDING
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Proses
                </button>
                <button
                  onClick={() => setStatusFilter(TransactionStatus.COMPLETED)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === TransactionStatus.COMPLETED
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
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
        ) : transactions.length === 0 ? (
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
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => router.push(`/transaksi/${transaction.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
