/**
 * Create Deposit Request page
 * Form to submit new deposit request
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DepositRequestForm } from "@/components/forms/DepositRequestForm";
import { post } from "@/libs/axios";
import { ApiResponse, DepositRequest } from "@/types";
import { useAuthStore } from "@/store/authStore";

export default function CreateDepositRequestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (
    data: { items: { waste_type_id: number; weight_kg: number }[] },
    photoUrl: string | undefined
  ): Promise<void> => {
    if (!user?.rw) {
      setError("RW tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("Submitting deposit request:", data, photoUrl);

    try {
      const newDeposit = {
        rw_id: user.rw,
        items: data.items,
        photo_url: photoUrl,
      };
      await post<ApiResponse<DepositRequest>>("/deposit-request", newDeposit);

      // Success - redirect to list
      router.push("/setor-online?success=true");
    } catch (err) {
      setError("Gagal membuat request. Silakan coba lagi.");
      console.error("Failed to create deposit request:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
              Request Setor Sampah
            </h1>
            <p className="text-gray-600 mt-1">
              Isi form untuk request penjemputan
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardBody>
            {user?.rw ? (
              <DepositRequestForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                rwId={user.rw.toString()}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Silakan lengkapi profil Anda terlebih dahulu
                </p>
                <Button onClick={() => router.push("/profil/edit")}>
                  Lengkapi Profil
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
