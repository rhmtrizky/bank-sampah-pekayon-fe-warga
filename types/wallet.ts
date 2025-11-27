/**
 * Wallet transaction type enumeration
 */
export enum WalletTransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  ADJUSTMENT = "ADJUSTMENT",
}

/**
 * Wallet entity
 */
export interface Wallet {
  id: string;
  user_id: string;
  saldo: number;
  total_transactions?: number;
  total_deposits?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Wallet history/transaction record
 */
export interface WalletHistory {
  id: string;
  wallet_id: string;
  transaction_type: WalletTransactionType;
  amount: number;
  saldo_before: number;
  saldo_after: number;
  description: string;
  reference_id: string | null;
  tanggal: string;
  created_at: string;
}

/**
 * Wallet with user information
 */
export interface WalletWithUser extends Wallet {
  user: {
    id: string;
    nama: string;
    email: string;
  };
}
