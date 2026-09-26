/**
 * Formatting helpers for the SUTU API.
 *
 * The backend guide's #1 rule: on-chain wei values are decimal STRINGS.
 * Never parse them as Number/float — all math goes through BigInt.
 */

/** Convert a wei decimal string to a MON display string (e.g. "1.5"). */
export function formatMon(weiStr: string, decimals = 4): string {
  try {
    const wei = BigInt(weiStr);
    const base = 10n ** 18n;
    const negative = wei < 0n;
    const abs = negative ? -wei : wei;
    const whole = abs / base;
    const frac = (abs % base).toString().padStart(18, "0").slice(0, decimals);
    const value = `${whole}${frac ? `.${frac}` : ""}`;
    return negative ? `-${value}` : value;
  } catch {
    return "0";
  }
}

/** Shorten an address/hash for display: 0x1234…abcd */
export function shortHex(hex: string, chars = 4): string {
  if (!hex) return "";
  if (hex.length <= chars * 2 + 2) return hex;
  return `${hex.slice(0, 2 + chars)}…${hex.slice(-chars)}`;
}

/**
 * Read a displayed MON total back as a number. Display strings may carry
 * thousands separators, so strip them before parsing.
 */
export function parseMon(value: string | number): number {
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[,\s]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Format a MON total for display, e.g. 12400 -> "12,400". */
export function displayMon(value: string | number): string {
  return parseMon(value).toLocaleString();
}

/** Map backend donation status to UI state. */
export type SupportStatusUi = "pending" | "confirmed" | "failed";

export function statusToUi(status: string): SupportStatusUi {
  if (status === "CONFIRMED" || status === "RECONCILED") return "confirmed";
  if (status === "FAILED") return "failed";
  return "pending";
}
