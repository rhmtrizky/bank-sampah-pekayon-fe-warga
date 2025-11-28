/**
 * Deposit Request Form component
 * Form to create new deposit request with React Hook Form + Zod
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { get, post } from "@/libs/axios";
import { ApiResponse } from "@/types";

/**
 * Waste type interface
 */
interface WasteType {
  waste_type_id: string;
  name: string;
  category: string;
  price_per_kg: number;
}

interface PriceList {
  price_id: number;
  waste_type_id: number;
  rw_id: number;
  kelurahan_id: number;
  buy_price: string;
  sell_price: string;
  effective_date: string;
  waste_type: {
    waste_type_id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  rw_list: {
    rw_id: number;
    kelurahan_id: number;
    nomor_rw: number;
    name: string;
    phone: string;
    address: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  kelurahan: {
    kelurahan_id: number;
    nama_kelurahan: string;
    kecamatan: string;
    kota: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Deposit request form schema
 */
const depositRequestSchema = z.object({
  items: z
    .array(
      z.object({
        waste_type_id: z.number().positive("Pilih jenis sampah"),
        weight_kg: z.number().positive("Berat harus lebih dari 0"),
      })
    )
    .min(1, "Minimal 1 item sampah"),
});

/**
 * Infer TypeScript type from schema
 */
type DepositRequestFormData = z.infer<typeof depositRequestSchema>;

interface DepositRequestFormProps {
  onSubmit: (data: DepositRequestFormData, photoUrl?: string) => Promise<void>;
  isLoading?: boolean;
  rwId: string;
}

export const DepositRequestForm: React.FC<DepositRequestFormProps> = ({
  onSubmit,
  isLoading = false,
  rwId,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [priceList, setPriceList] = useState<PriceList[]>([]);
  const [isLoadingWasteTypes, setIsLoadingWasteTypes] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositRequestFormData>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      items: [{ waste_type_id: 0, weight_kg: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  /**
   * Fetch waste types on mount
   */
  useEffect(() => {
    const fetchWasteTypes = async (): Promise<void> => {
      try {
        const response = await get<ApiResponse<PriceList[]>>(
          `/price-list?rw_id=${rwId}`
        );
        setPriceList(response.data);
      } catch (error) {
        console.error("Failed to fetch waste types:", error);
      } finally {
        setIsLoadingWasteTypes(false);
      }
    };

    fetchWasteTypes();
  }, [rwId]);

  /**
   * Handle image upload
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  /**
   * Process and upload file
   */
  const processFile = (file: File): void => {
    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Kick off upload to /upload/image
    void (async () => {
      try {
        setIsUploadingPhoto(true);
        const fd = new FormData();
        // Common backend field name for image uploads
        fd.append("file", file);
        const resp = await post<{ url?: string; data?: { url?: string } }>(
          "/upload/image",
          fd
        );
        // Support {url} or {data:{url}}
        const url = (resp as any)?.url ?? (resp as any)?.data?.url;
        if (typeof url === "string" && url.length > 0) {
          setPhotoUrl(url);
        } else {
          console.warn("Upload image: URL not found in response", resp);
        }
      } catch (err) {
        console.error("Upload image failed:", err);
        setPhotoUrl(undefined);
      } finally {
        setIsUploadingPhoto(false);
      }
    })();
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (
    data: DepositRequestFormData
  ): Promise<void> => {
    await onSubmit(data, photoUrl);
  };

  console.log("photoFile", photoFile);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Waste Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Item Sampah <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => append({ waste_type_id: 0, weight_kg: 0 })}
            disabled={isLoadingWasteTypes}
          >
            + Tambah Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-gray-200 rounded-lg mb-3 space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Item #{index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Waste Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Sampah
              </label>
              <select
                {...register(`items.${index}.waste_type_id`, {
                  valueAsNumber: true,
                })}
                disabled={isLoadingWasteTypes}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="0">
                  {isLoadingWasteTypes ? "Memuat..." : "Pilih jenis sampah"}
                </option>
                {priceList.map((item) => (
                  <option key={item.waste_type_id} value={item.waste_type_id}>
                    {item.waste_type.name} - Rp{" "}
                    {Number.parseFloat(item.buy_price).toLocaleString("id-ID")}
                    /kg
                  </option>
                ))}
              </select>
              {errors.items?.[index]?.waste_type_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.waste_type_id?.message}
                </p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat (kg)
              </label>
              <input
                {...register(`items.${index}.weight_kg`, {
                  valueAsNumber: true,
                })}
                type="number"
                step="0.001"
                min="0"
                placeholder="0.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors.items?.[index]?.weight_kg && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.items[index]?.weight_kg?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {errors.items && typeof errors.items.message === "string" && (
          <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
        )}
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto Sampah (Opsional)
        </label>

        {!imagePreview ? (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploadingPhoto}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isUploadingPhoto
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-green-400"
              }`}
            >
              {isUploadingPhoto ? (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-10 h-10 text-green-500 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-gray-600">
                    Mengunggah foto...
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Mohon tunggu sebentar
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-gray-700">
                    <span className="text-green-600">Klik untuk upload</span>{" "}
                    atau drag & drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG (Max 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>
        ) : (
          <div className="relative">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-green-500">
              <img
                src={imagePreview}
                alt="Preview sampah"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <label
                  htmlFor="photo-upload"
                  className="p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  title="Ganti foto"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setPhotoFile(undefined);
                    setPhotoUrl(undefined);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  title="Hapus foto"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              {photoUrl && (
                <div className="absolute bottom-2 left-2 right-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Foto berhasil diunggah
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploadingPhoto}
              className="hidden"
              id="photo-upload"
            />
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Upload 1 foto untuk semua item sampah yang akan disetor
        </p>
      </div>

      {/* Info box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
            <p className="font-medium mb-1">Catatan:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Tambahkan semua jenis sampah dengan berat masing-masing</li>
              <li>Pastikan sampah sudah dipilah sesuai jenis</li>
              <li>RW akan menghubungi untuk jadwal pengepulannya</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading || isUploadingPhoto}
        disabled={isUploadingPhoto}
      >
        Kirim Request
      </Button>
    </form>
  );
};
