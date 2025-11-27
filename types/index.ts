/**
 * Central type exports for the entire application
 * All types must be imported from this file
 */

// API types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginatedResponse,
} from "./api";

// User types
export type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  JWTPayload,
} from "./user";

export { UserRole, UserStatus } from "./user";

// Wallet types
export type { Wallet, WalletHistory, WalletWithUser } from "./wallet";

export { WalletTransactionType } from "./wallet";

// Deposit request types
export type {
  DepositRequest,
  DepositRequestDetail,
  CreateDepositRequest,
  UpdateDepositRequestStatus,
} from "./deposit";

export { DepositRequestStatus } from "./deposit";

// Transaction types
export type {
  Transaction,
  TransactionWithRelations,
  TransactionItem,
  TransactionItemWithDetails,
  TransactionDetail,
  CreateTransaction,
} from "./transaction";

export { TransactionType, TransactionStatus } from "./transaction";

// Schedule types
export type { Schedule, ScheduleWithRW, CreateSchedule } from "./schedule";

export { ScheduleType } from "./schedule";

// Price types
export type {
  PriceItem,
  PriceItemWithRW,
  CreatePriceItem,
  UpdatePriceItem,
} from "./price";

// Notification types
export type {
  Notification,
  NotificationWithUser,
  CreateNotification,
  MarkNotificationRead,
} from "./notification";

export { NotificationType } from "./notification";
