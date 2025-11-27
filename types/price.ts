/**
 * Price list item entity
 */
export interface PriceItem {
  id: string;
  rw_id: string;
  jenis_sampah: string;
  harga_per_kg: number;
  satuan: string;
  deskripsi: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Price list item with RW information
 */
export interface PriceItemWithRW extends PriceItem {
  rw: {
    id: string;
    nama_rw: string;
    kelurahan_id: string;
  };
}

/**
 * Create price item payload (admin only)
 */
export interface CreatePriceItem {
  rw_id: string;
  jenis_sampah: string;
  harga_per_kg: number;
  satuan: string;
  deskripsi?: string;
}

/**
 * Update price item payload (admin only)
 */
export interface UpdatePriceItem {
  jenis_sampah?: string;
  harga_per_kg?: number;
  satuan?: string;
  deskripsi?: string;
  is_active?: boolean;
}
