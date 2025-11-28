/**
 * Home page - Dashboard for Warga
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { get } from "@/libs/axios";
import { ApiResponse, Wallet, Transaction, TransactionType } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { getRelativeTime } from "@/utils/date";

// subcomponents and icons
const Icons = {
  Upload: () => (
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  ),
  History: () => (
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Calendar: () => (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  PriceTag: () => (
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
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  ),
  Wallet: () => (
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
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  ArrowUp: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  ),
  ArrowDown: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  ),
  Empty: () => (
    <svg
      className="w-12 h-12 text-gray-300 mx-auto mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
};

const QuickAction = ({
  icon: Icon,
  label,
  description,
  onClick,
  colorClass = "bg-green-50 text-green-600",
}: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 text-left w-full group"
  >
    <div
      className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}
    >
      <Icon />
    </div>
    <div>
      <span className="block font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
        {label}
      </span>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
  </button>
);

const TransactionItem = ({
  transaction,
  onClick,
}: {
  transaction: Transaction;
  onClick: () => void;
}) => {
  const isDeposit = transaction.transaction_type === TransactionType.SETOR;

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border-b border-gray-50 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDeposit
              ? "bg-green-100 text-green-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {isDeposit ? <Icons.ArrowDown /> : <Icons.ArrowUp />}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">
            {isDeposit ? "Setor Sampah" : "Penarikan Saldo"}
          </h4>
          <p className="text-xs text-gray-400">
            {getRelativeTime(transaction.tanggal_transaksi)}
          </p>
        </div>
      </div>
      <div
        className={`text-right font-bold text-sm ${
          isDeposit ? "text-green-600" : "text-gray-800"
        }`}
      >
        {isDeposit ? "+" : "-"}
        {formatCurrency(transaction.total_amount)}
      </div>
    </div>
  );
};

// Main Page
const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function HomePage() {
  const router = useRouter();

  const { data: walletData, isLoading: walletLoading } = useSWR<
    ApiResponse<Wallet>
  >("/wallet/me", fetcher);
  const { data: transactionsData, isLoading: transactionsLoading } = useSWR<
    ApiResponse<Transaction[]>
  >("/transactions/me?limit=5", fetcher);

  const wallet = walletData?.data;
  const transactions = transactionsData?.data || [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          {/* <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Selamat Pagi,</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Warga Pekayon 👋</h1>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-gray-100 shadow-sm">
               <div className="w-8 h-8 bg-linear-to-tr from-green-400 to-green-600 rounded-full"></div>
               <span className="text-sm font-semibold text-gray-700">Akun Warga</span>
            </div>
          </header> */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Main Hero & Actions (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Hero Balance Card */}
              <div className="relative overflow-hidden bg-linear-to-br from-green-600 to-emerald-800 rounded-4xl p-8 text-white shadow-xl shadow-green-600/10">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 grid sm:grid-cols-2 gap-8 items-end">
                  <div>
                    <div className="flex items-center gap-2 text-green-100 mb-3">
                      <Icons.Wallet />
                      <span className="font-medium">Total Saldo Tabungan</span>
                    </div>

                    {walletLoading ? (
                      <Skeleton className="h-12 w-64 bg-white/20 mb-2" />
                    ) : (
                      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                        {formatCurrency(wallet?.saldo ?? 0)}
                      </h2>
                    )}
                    {/* <p className="text-green-100/80 text-sm">Terakhir update: Hari ini</p> */}
                  </div>

                  {/* <div className="sm:text-right">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <span className="text-yellow-300">✨</span>
                      <span className="text-sm font-medium">Poin Keaktifan: 120 Poin</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Menu Cepat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuickAction
                    icon={Icons.Upload}
                    label="Setor Sampah"
                    description="Buat setoran sampah baru"
                    onClick={() => router.push("/setor-online")}
                  />
                  <QuickAction
                    icon={Icons.History}
                    label="Riwayat Saldo"
                    description="Cek mutasi keluar masuk"
                    colorClass="bg-blue-50 text-blue-600"
                    onClick={() => router.push("/saldo")}
                  />
                  <QuickAction
                    icon={Icons.Calendar}
                    label="Jadwal Pengepulan"
                    description="Lihat jadwal petugas keliling"
                    colorClass="bg-orange-50 text-orange-600"
                    onClick={() => router.push("/jadwal")}
                  />
                  <QuickAction
                    icon={Icons.PriceTag}
                    label="Katalog Harga"
                    description="Daftar harga sampah terkini"
                    colorClass="bg-purple-50 text-purple-600"
                    onClick={() => router.push("/harga")}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Aktivitas Terkini
                  </h3>
                  <button
                    onClick={() => router.push("/transaksi")}
                    className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-1">
                  {transactionsLoading ? (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="flex-1 space-y-2">
                          <Skeleton width="60%" height={14} />
                          <Skeleton width="40%" height={10} />
                        </div>
                      </div>
                    ))
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <Icons.Empty />
                      <p className="text-gray-500 text-sm mb-4">
                        Belum ada aktivitas bulan ini
                      </p>
                      <button
                        onClick={() => router.push("/setor-online")}
                        className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-full hover:bg-green-100 transition"
                      >
                        Mulai Setor Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {transactions.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          onClick={() =>
                            router.push(`/transaksi/${transaction.id}`)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
