/**
 * Harga page
 * Shows price list for waste types in user's RW
 */

"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceItemCard } from "@/components/cards/PriceItemCard";
import { get } from "@/libs/axios";
import { ApiResponse, PriceItem } from "@/types";
import { useAuthStore } from "@/store/authStore";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function HargaPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch price list for user's RW
  const { data, isLoading, error } = useSWR<ApiResponse<PriceItem[]>>(
    user?.rw ? `/price-list/rw/${user.rw}` : null,
    fetcher
  );

  const priceList = data?.data || [];

  // Filter price list by search query
  const filteredPriceList = useMemo(() => {
    if (!searchQuery) return priceList;
    const query = searchQuery.toLowerCase();
    return priceList.filter((item) =>
      item.jenis_sampah.toLowerCase().includes(query)
    );
  }, [priceList, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (priceList.length === 0) {
      return { total: 0, avgPrice: 0, maxPrice: 0, minPrice: 0 };
    }
    const prices = priceList.map((item) => item.harga_per_kg);
    return {
      total: priceList.length,
      avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
    };
  }, [priceList]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Harga Sampah</h1>
          <p className="text-gray-600 mt-1">Daftar harga sampah di RW Anda</p>
        </div>

        {/* Search */}
        <Card>
          <CardBody>
            <Input
              type="text"
              placeholder="Cari jenis sampah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              fullWidth
            />
          </CardBody>
        </Card>

        {/* Statistics */}
        {!isLoading && priceList.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardBody className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Jenis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <p className="text-sm text-gray-600 mb-1">Rata-rata</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {Math.round(stats.avgPrice).toLocaleString("id-ID")}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <p className="text-sm text-gray-600 mb-1">Tertinggi</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {stats.maxPrice.toLocaleString("id-ID")}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <p className="text-sm text-gray-600 mb-1">Terendah</p>
                <p className="text-2xl font-bold text-orange-600">
                  Rp {stats.minPrice.toLocaleString("id-ID")}
                </p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Content */}
        {!user?.rw ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-yellow-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-500 mb-4">
                  Silakan lengkapi profil Anda untuk melihat harga
                </p>
              </div>
            </CardBody>
          </Card>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <div className="flex gap-3">
                  <Skeleton variant="rectangular" width={56} height={56} />
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
                <p className="text-gray-500">Gagal memuat daftar harga</p>
              </div>
            </CardBody>
          </Card>
        ) : filteredPriceList.length === 0 ? (
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
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                  />
                </svg>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Tidak ada hasil pencarian"
                    : "Belum ada daftar harga tersedia"}
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPriceList.map((item) => (
              <PriceItemCard key={item.id} priceItem={item} />
            ))}
          </div>
        )}

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardBody>
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi Harga</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Harga dapat berubah sewaktu-waktu</li>
                  <li>Pastikan sampah sudah dipilah sebelum disetor</li>
                  <li>Harga yang tertera adalah harga per kilogram (kg)</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
