/**
 * Transaction type enumeration
 */
export enum TransactionType {
  SETOR = "SETOR",
  TARIK = "TARIK",
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  user_id: string;
  rw_id: string;
  transaction_type: TransactionType;
  total_amount: number;
  status: TransactionStatus;
  tanggal_transaksi: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Transaction with user and RW information
 */
export interface TransactionWithRelations extends Transaction {
  user: {
    id: string;
    nama: string;
    email: string;
  };
  rw: {
    id: string;
    nama_rw: string;
  };
}

/**
 * Transaction item (waste type and quantity)
 */
export interface TransactionItem {
  id: string;
  transaction_id: string;
  price_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

/**
 * Transaction item with price list details
 */
export interface TransactionItemWithDetails extends TransactionItem {
  price_item: {
    id: string;
    jenis_sampah: string;
    harga_per_kg: number;
    satuan: string;
  };
}

/**
 * Complete transaction detail with items
 */
export interface TransactionDetail extends TransactionWithRelations {
  admin: {
    id: string;
    name: string;
  };
  items: TransactionItemWithDetails[];
}

/**
 * Create transaction payload
 */
export interface CreateTransaction {
  rw_id: string;
  transaction_type: TransactionType;
  items: {
    price_item_id: string;
    quantity: number;
  }[];
  catatan?: string;
}
