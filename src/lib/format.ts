/** India-first formatting helpers for displaying data in Indian format and context. */

/**
 * Format a number as Indian Rupees with proper formatting and notation.
 * Uses Indian numbering system (e.g., 10,00,000 for 1 million).
 *
 * @param amount - The amount in rupees to format
 * @param opts - Optional configuration
 * @param opts.compact - If true, uses abbreviated notation (K for 1000, L for 100,000, Cr for 10,000,000)
 * @returns Formatted currency string (e.g., "₹1,00,000" or "₹1.00 L")
 *
 * @example
 * formatINR(100000)  // "₹1,00,000"
 * formatINR(100000, { compact: true })  // "₹1.00 L"
 * formatINR(10000000, { compact: true })  // "₹1.00 Cr"
 */
export function formatINR(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (abs >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`;
    if (abs >= 1_000) return `₹${(amount / 1_000).toFixed(1)} K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string in Indian date format (DD MMM YYYY).
 * Uses Intl.DateTimeFormat for localization.
 *
 * @param iso - ISO 8601 date string (e.g., "2026-09-09")
 * @returns Formatted date string (e.g., "09 Sep 2026")
 *
 * @example
 * formatDateIN("2026-09-09")  // "09 Sep 2026"
 */
export function formatDateIN(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Calculate age from date of birth.
 * Accounts for whether birthday has occurred this year.
 *
 * @param iso - ISO 8601 date of birth string (e.g., "1985-06-12")
 * @returns Age in years as integer
 *
 * @example
 * ageFromDOB("1990-06-15")  // 35 (if today is after June 15)
 */
export function ageFromDOB(iso: string): number {
  const dob = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

/**
 * Calculate the number of days until a target date.
 * Useful for countdown displays (e.g., "expires in 15 days").
 *
 * @param iso - ISO 8601 target date string (e.g., "2026-12-31")
 * @returns Number of days until target date (negative if date is in the past)
 *
 * @example
 * daysUntil("2026-12-31")  // 113 (if today is Sep 9, 2026)
 */
export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / 86_400_000);
}

/**
 * Extract initials from a person's name.
 * Takes up to 2 words and uses their first letters.
 *
 * @param name - Full name string (e.g., "Abhishek Rao")
 * @returns Initials in uppercase (e.g., "AR")
 *
 * @example
 * initials("Abhishek Rao")  // "AR"
 * initials("John Fitzgerald Kennedy")  // "JF"
 * initials("Madonna")  // "M"
 */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
