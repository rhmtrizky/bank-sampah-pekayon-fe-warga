/**
 * Date formatting and parsing utilities
 */

/**
 * Format ISO date string to Indonesian locale
 * @param isoDate - ISO date string
 * @param format - Format type ('short' | 'long' | 'datetime')
 * @returns Formatted date string
 */
export function formatDate(
  isoDate: string,
  format: "short" | "long" | "datetime" = "short"
): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  switch (format) {
    case "short":
      // e.g., 26/11/2025
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

    case "long":
      // e.g., 26 November 2025
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

    case "datetime":
      // e.g., 26 Nov 2025, 14:30
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);

    default:
      return date.toLocaleDateString("id-ID");
  }
}

/**
 * Format time from ISO date string
 * @param isoDate - ISO date string
 * @returns Time string (e.g., "14:30")
 */
export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "Invalid time";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param isoDate - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Baru saja";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} menit yang lalu`;
  }
  if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  }
  if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu yang lalu`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan yang lalu`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} tahun yang lalu`;
}

/**
 * Check if date is today
 * @param isoDate - ISO date string
 * @returns true if date is today
 */
export function isToday(isoDate: string): boolean {
  const date = new Date(isoDate);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Parse date string to ISO format for API
 * @param dateString - Date string in various formats
 * @returns ISO date string
 */
export function toISODate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date.toISOString();
}
