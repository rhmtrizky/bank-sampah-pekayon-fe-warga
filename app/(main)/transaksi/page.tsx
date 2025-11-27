/**
 * Transaksi Page
 * Refactored for Modern UI & Better UX
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  TransactionType,
  TransactionStatus,
} from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/date";

// --- 1. Helper & Config ---

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

const TYPE_CONFIG = {
  [TransactionType.SETOR]: {
    label: "Setor Sampah",
    color: "text-green-600 bg-green-50",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    sign: "+",
    amountColor: "text-green-600"
  },
  [TransactionType.TARIK]: {
    label: "Tarik Saldo",
    color: "text-orange-600 bg-orange-50",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    sign: "-",
    amountColor: "text-orange-600"
  },
};

const STATUS_CONFIG = {
  [TransactionStatus.PENDING]: {
    label: "Proses",
    style: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  [TransactionStatus.COMPLETED]: {
    label: "Berhasil",
    style: "bg-green-100 text-green-700 border-green-200"
  },
  [TransactionStatus.CANCELLED]: {
    label: "Gagal",
    style: "bg-red-100 text-red-700 border-red-200"
  },
};

const TransactionItemCard = ({ transaction, onClick }: { transaction: Transaction; onClick: () => void }) => {
  const typeConfig = TYPE_CONFIG[transaction.transaction_type as TransactionType] || TYPE_CONFIG[TransactionType.SETOR];
  const statusConfig = STATUS_CONFIG[transaction.status as TransactionStatus] || STATUS_CONFIG[TransactionStatus.PENDING];

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-4">
           {/* Icon Box */}
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${typeConfig.color} bg-opacity-80 group-hover:scale-105 transition-transform`}>
              {typeConfig.icon}
           </div>

           <div>
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-gray-900 text-sm sm:text-base">{typeConfig.label}</h3>
                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.style}`}>
                    {statusConfig.label}
                 </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                 {formatDate(transaction.tanggal_transaksi)} • ID: #{transaction.id}
              </p>
           </div>
        </div>

        {/* Right Side: Amount */}
        <div className="text-right">
           <p className={`font-bold text-sm sm:text-base ${typeConfig.amountColor}`}>
              {typeConfig.sign} {formatCurrency(transaction.total_amount)}
           </p>
           <p className="text-[10px] text-gray-400 mt-1">Total</p>
        </div>
      </div>
    </div>
  );
};

// Main Page 

export default function TransaksiPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">("ALL");

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
      <div className="min-h-screen bg-gray-50/30 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">Cek semua pemasukan dan pengeluaran saldo Anda.</p>
          </div>

          {/* Filters Area */}
          <div className="space-y-3">
             {/* Type Filter */}
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[
                    { value: "ALL", label: "Semua Tipe" },
                    { value: TransactionType.SETOR, label: "Pemasukan (Setor)" },
                    { value: TransactionType.TARIK, label: "Pengeluaran (Tarik)" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setTypeFilter(tab.value as TransactionType | "ALL")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                        typeFilter === tab.value
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
             </div>

             {/* Status Filter */}
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { value: "ALL", label: "Semua Status" },
                    { value: TransactionStatus.COMPLETED, label: "Berhasil" },
                    { value: TransactionStatus.PENDING, label: "Dalam Proses" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value as TransactionStatus | "ALL")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                        statusFilter === tab.value
                            ? "bg-green-100 text-green-700 border-green-200 font-bold"
                            : "bg-white text-gray-500 border-gray-200 hover:border-green-200 hover:text-green-600"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
             </div>
          </div>

          {/* Content List */}
          <div className="space-y-3">
            {isLoading ? (
              // Loading State
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
                        <div className="space-y-2 w-32">
                            <Skeleton width="100%" height={16} />
                            <Skeleton width="60%" height={12} />
                        </div>
                    </div>
                    <Skeleton width={80} height={20} />
                </div>
              ))
            ) : error ? (
              // Error State
              <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
                <p className="text-red-600 font-medium">Gagal memuat transaksi</p>
                <p className="text-red-400 text-sm mt-1">Silakan coba lagi nanti.</p>
              </div>
            ) : transactions.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-base">Tidak ada transaksi</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Belum ada riwayat transaksi yang sesuai dengan filter Anda.
                </p>
              </div>
            ) : (
              // List Data
              transactions.map((transaction) => (
                <TransactionItemCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => router.push(`/transaksi/${transaction.id}`)}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}