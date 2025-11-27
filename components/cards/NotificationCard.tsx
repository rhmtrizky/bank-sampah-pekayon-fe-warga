/**
 * Notification Card component
 * Displays notification with type indicator
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Notification, NotificationType } from "@/types";
import { getRelativeTime } from "@/utils/date";

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

/**
 * Get notification type info
 */
function getTypeInfo(type: NotificationType): {
  icon: string;
  color: string;
  bgColor: string;
} {
  const typeMap: Record<
    NotificationType,
    { icon: string; color: string; bgColor: string }
  > = {
    [NotificationType.DEPOSIT_REQUEST_APPROVED]: {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    [NotificationType.DEPOSIT_REQUEST_REJECTED]: {
      icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    [NotificationType.TRANSACTION_COMPLETED]: {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    [NotificationType.WITHDRAWAL_COMPLETED]: {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    [NotificationType.SCHEDULE_REMINDER]: {
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    [NotificationType.SYSTEM_ANNOUNCEMENT]: {
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  };
  return typeMap[type];
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const typeInfo = getTypeInfo(notification.notification_type);

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        !notification.is_read ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 ${typeInfo.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <svg
            className={`w-6 h-6 ${typeInfo.color}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={typeInfo.icon}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`font-medium ${
                !notification.is_read ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {notification.title}
            </h3>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>

          <p
            className={`text-sm mb-2 line-clamp-2 ${
              !notification.is_read ? "text-gray-700" : "text-gray-600"
            }`}
          >
            {notification.message}
          </p>

          <p className="text-xs text-gray-500">
            {getRelativeTime(notification.created_at)}
          </p>
        </div>
      </div>
    </Card>
  );
};
