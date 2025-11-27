/**
 * Notifikasi page
 * Shows all notifications with mark as read functionality
 */

"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { NotificationCard } from "@/components/cards/NotificationCard";
import { get, patch } from "@/libs/axios";
import { ApiResponse, Notification, NotificationType } from "@/types";

const fetcher = <T,>(url: string): Promise<T> => get<T>(url);

export default function NotifikasiPage() {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  // Fetch notifications
  const { data, isLoading, error, mutate } = useSWR<
    ApiResponse<Notification[]>
  >("/notifications/me", fetcher);

  const notifications = data?.data || [];

  // Filter notifications
  const filteredNotifications =
    filter === "UNREAD"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  // Count unread
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /**
   * Mark notification as read
   */
  const handleMarkAsRead = async (notificationId: string): Promise<void> => {
    setMarkingAsRead(notificationId);
    try {
      await patch(`/notifications/${notificationId}/read`, {});
      // Refresh data
      await mutate();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = async (): Promise<void> => {
    setMarkingAsRead("all");
    try {
      // Mark all unread notifications
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => patch(`/notifications/${n.id}/read`, {}))
      );
      // Refresh data
      await mutate();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca`
                : "Tidak ada notifikasi baru"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              isLoading={markingAsRead === "all"}
            >
              Tandai Semua Terbaca
            </Button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "ALL"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Semua ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "UNREAD"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <div className="flex gap-3">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1">
                    <Skeleton width="80%" />
                    <Skeleton width="100%" className="mt-2" />
                    <Skeleton width="30%" className="mt-2" />
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
                <p className="text-gray-500">Gagal memuat notifikasi</p>
              </div>
            </CardBody>
          </Card>
        ) : filteredNotifications.length === 0 ? (
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-gray-500">
                  {filter === "UNREAD"
                    ? "Tidak ada notifikasi yang belum dibaca"
                    : "Belum ada notifikasi"}
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={
                  notification.is_read
                    ? undefined
                    : () => handleMarkAsRead(notification.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
