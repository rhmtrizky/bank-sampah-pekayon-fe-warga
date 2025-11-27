/**
 * Currency formatting utilities
 */

/**
 * Format number to Indonesian Rupiah currency
 * @param amount - Amount in number
 * @param includeSymbol - Include Rp symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, includeSymbol = true): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: includeSymbol ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted;
}

/**
 * Format number to compact Indonesian Rupiah (e.g., 1.5M, 200K)
 * @param amount - Amount in number
 * @returns Compact formatted currency string
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1)}K`;
  }
  return `Rp ${amount}`;
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string (e.g., "Rp 100.000")
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
}
