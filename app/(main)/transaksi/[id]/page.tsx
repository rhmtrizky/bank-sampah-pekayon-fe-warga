/**
 * Transaction Detail page
 * Refactored for Modern Receipt-style UI
 */

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
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

// Config

const STATUS_CONFIG = {
  [TransactionStatus.PENDING]: {
    label: "Sedang Diproses",
    style: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
  },
  [TransactionStatus.COMPLETED]: {
    label: "Transaksi Berhasil",
    style: "bg-green-100 text-green-700 border-green-200",
    icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
  },
  [TransactionStatus.CANCELLED]: {
    label: "Dibatalkan",
    style: "bg-red-100 text-red-700 border-red-200",
    icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
  }
};

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
  const isDeposit = transaction?.transaction_type === TransactionType.SETOR;
  const statusInfo = transaction ? STATUS_CONFIG[transaction.status as TransactionStatus] : STATUS_CONFIG[TransactionStatus.PENDING];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-green-600 hover:border-green-200 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Detail Transaksi</h1>
              <p className="text-xs text-gray-500">ID: #{transactionId}</p>
            </div>
          </div>

          {isLoading ? (
             <div className="space-y-4">
                <Skeleton height={200} className="rounded-3xl" />
                <Skeleton height={300} className="rounded-3xl" />
             </div>
          ) : error || !transaction ? (
             <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
                <p className="text-red-600 font-medium">Gagal memuat detail transaksi</p>
                <button onClick={() => router.back()} className="text-sm text-red-500 underline mt-2">Kembali</button>
             </div>
          ) : (
             <>
                {/* Hero for Amount & Status */}
                <div className={`rounded-3xl p-6 sm:p-8 text-center border relative overflow-hidden ${
                    isDeposit 
                    ? "bg-green-50 border-green-100" 
                    : "bg-orange-50 border-orange-100"
                }`}>
                    <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm ${
                            isDeposit ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                        }`}>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isDeposit ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                )}
                            </svg>
                        </div>
                        
                        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                            isDeposit ? "text-green-600" : "text-orange-600"
                        }`}>
                            {isDeposit ? "Pemasukan Saldo" : "Penarikan Saldo"}
                        </p>
                        
                        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${
                            isDeposit ? "text-green-800" : "text-orange-800"
                        }`}>
                            {isDeposit ? "+" : "-"}{formatCurrency(transaction.total_amount)}
                        </h2>

                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusInfo.style}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.label}</span>
                        </div>
                    </div>
                </div>

                {/* Drtails List */}
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    {/* Meta Info */}
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-50">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tanggal Transaksi</p>
                            <p className="font-medium text-gray-900">{formatDate(transaction.tanggal_transaksi, "long")}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Diproses Oleh</p>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold">A</span>
                                {transaction.admin.name}
                            </p>
                        </div>
                        {transaction.catatan && (
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Catatan</p>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{transaction.catatan}</p>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    {transaction.items && transaction.items.length > 0 && (
                        <div className="p-6 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Rincian Sampah</h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.price_item.jenis_sampah}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.quantity} {item.price_item.satuan} x {formatCurrency(item.unit_price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                ))}
                                
                                <div className="border-t border-dashed border-gray-300 my-4"></div>
                                
                                <div className="flex justify-between items-center text-base">
                                    <p className="font-bold text-gray-600">Total Transaksi</p>
                                    <p className={`font-bold ${isDeposit ? "text-green-600" : "text-orange-600"}`}>
                                        {formatCurrency(transaction.total_amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </>
          )}

        </div>
      </div>
    </MainLayout>
  );
}