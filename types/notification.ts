/**
 * Notification type enumeration
 */
export enum NotificationType {
  DEPOSIT_REQUEST_APPROVED = "DEPOSIT_REQUEST_APPROVED",
  DEPOSIT_REQUEST_REJECTED = "DEPOSIT_REQUEST_REJECTED",
  TRANSACTION_COMPLETED = "TRANSACTION_COMPLETED",
  SCHEDULE_REMINDER = "SCHEDULE_REMINDER",
  WITHDRAWAL_COMPLETED = "WITHDRAWAL_COMPLETED",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
}

/**
 * Notification entity
 */
export interface Notification {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_id: string | null;
  created_at: string;
}

/**
 * Notification with user information
 */
export interface NotificationWithUser extends Notification {
  user: {
    id: string;
    nama: string;
    email: string;
  };
}

/**
 * Create notification payload (system/admin only)
 */
export interface CreateNotification {
  user_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  reference_id?: string;
}

/**
 * Mark notification as read payload
 */
export interface MarkNotificationRead {
  is_read: boolean;
}
