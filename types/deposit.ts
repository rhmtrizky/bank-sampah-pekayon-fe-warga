/**
 * Deposit request status enumeration
 */
export enum DepositRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Deposit request entity
 */
export interface DepositRequest {
  request_id: number;
  user_id: number;
  rw_id: number;
  photoUrl: string | null;
  status: DepositRequestStatus;
  scheduled_date: string | null;
  created_at: string;
}

/**
 * Deposit request with user and RW information
 */
export interface DepositRequestDetail extends DepositRequest {
  user: {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    alamat: string;
    role: string;
    rt: number | null;
    rw: number | null;
    kelurahan_id: number;
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
  items: Array<{
    item_id: number;
    request_id: number;
    waste_type_id: number;
    weight_kg: string;
    waste_type: {
      waste_type_id: number;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
  }>;
}

/**
 * Waste item in deposit request
 */
export interface DepositRequestItem {
  waste_type_id: string;
  weight_kg: number;
}

/**
 * Create deposit request payload
 */
export interface CreateDepositRequest {
  items: DepositRequestItem[];
  photoUrl?: File;
}

/**
 * Update deposit request status payload (admin only)
 */
export interface UpdateDepositRequestStatus {
  status: DepositRequestStatus;
  tanggal_pickup?: string;
  catatan_admin?: string;
}
