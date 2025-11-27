/**
 * Transaction Detail page
 * Shows detailed information about a specific transaction
 */

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import {
  ApiResponse,
  TransactionDetail,
  TransactionType,
  TransactionStatus,
} from "@/types";
import { formatDate } from "@/utils/date";
import { formatCurrency } from "@/utils/formatCurrency";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  // Fetch transaction detail
  const { data, isLoading, error } = useSWR<ApiResponse<TransactionDetail>>(
    transactionId ? `/transactions/${transactionId}` : null,
    fetcher
  );

  const transaction = data?.data;

  /**
   * Get status color
   */
  const getStatusColor = (status: TransactionStatus): string => {
    const colors: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [TransactionStatus.COMPLETED]: "bg-green-100 text-green-800",
      [TransactionStatus.CANCELLED]: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status: TransactionStatus): string => {
    const labels: Record<TransactionStatus, string> = {
      [TransactionStatus.PENDING]: "Proses",
      [TransactionStatus.COMPLETED]: "Selesai",
      [TransactionStatus.CANCELLED]: "Batal",
    };
    return labels[status];
  };

  const isDeposit = transaction?.transaction_type === TransactionType.SETOR;

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
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Transaksi
            </h1>
            <p className="text-gray-600 mt-1">Informasi lengkap transaksi</p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardBody className="space-y-4">
              <Skeleton height={60} />
              <Skeleton height={100} />
              <Skeleton height={80} />
            </CardBody>
          </Card>
        ) : error || !transaction ? (
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
                  Gagal memuat detail transaksi
                </p>
                <Button variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Summary card */}
            <Card className={isDeposit ? "bg-green-50" : "bg-blue-50"}>
              <CardBody>
                <div className="text-center">
                  <div
                    className={`w-16 h-16 ${
                      isDeposit ? "bg-green-100" : "bg-blue-100"
                    } rounded-full mx-auto mb-3 flex items-center justify-center`}
                  >
                    <svg
                      className={`w-8 h-8 ${
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {isDeposit ? "+" : "-"}
                    {formatCurrency(transaction.total_amount)}
                  </h2>
                  <p
                    className={`text-sm font-medium ${
                      isDeposit ? "text-green-700" : "text-blue-700"
                    }`}
                  >
                    {isDeposit ? "Setor Sampah" : "Tarik Saldo"}
                  </p>
                  <div
                    className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {getStatusLabel(transaction.status)}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Transaction info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Transaksi</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Transaksi</span>
                  <span className="font-medium text-gray-900">
                    {transaction.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(transaction.tanggal_transaksi, "long")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin</span>
                  <span className="font-medium text-gray-900">
                    {transaction.admin.name}
                  </span>
                </div>
                {transaction.catatan && (
                  <div>
                    <span className="text-gray-600 block mb-1">Catatan</span>
                    <p className="text-gray-900">{transaction.catatan}</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Transaction items */}
            {transaction.items && transaction.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rincian Item</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {transaction.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.price_item.jenis_sampah}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} {item.price_item.satuan} ×{" "}
                            {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(transaction.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
