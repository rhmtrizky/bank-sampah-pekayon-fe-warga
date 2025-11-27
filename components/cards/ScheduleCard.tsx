/**
 * Schedule Card component
 * Displays schedule information with type indicator
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Schedule, ScheduleType } from "@/types";
import { formatDate, formatTime } from "@/utils/date";

interface ScheduleCardProps {
  schedule: Schedule;
}

/**
 * Get schedule type info
 */
function getTypeInfo(type: ScheduleType): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  if (type === ScheduleType.PENGUMPULAN) {
    return {
      label: "Pengumpulan",
      color: "text-green-700",
      bgColor: "bg-green-100",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    };
  }
  return {
    label: "Pencairan",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const typeInfo = getTypeInfo(schedule.schedule_type);

  return (
    <Card hover>
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`w-14 h-14 ${typeInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <svg
            className={`w-7 h-7 ${typeInfo.color}`}
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
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {typeInfo.label} Sampah
            </h3>
            <span
              className={`px-2 py-1 ${typeInfo.bgColor} ${typeInfo.color} rounded-full text-xs font-medium whitespace-nowrap`}
            >
              {typeInfo.label}
            </span>
          </div>

          {/* Date and time */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(schedule.tanggal, "long")}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {formatTime(schedule.jam_mulai)} -{" "}
                {formatTime(schedule.jam_selesai)}
              </span>
            </div>

            {schedule.lokasi && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{schedule.lokasi}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {schedule.deskripsi && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {schedule.deskripsi}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
