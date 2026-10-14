/**
 * SUTU backend API client.
 *
 * - Auth (backend_update.md): EVERY request requires an `X-API-Key` header
 *   (missing/wrong key → 401 + counted against the 2 req/min unauthenticated
 *   quota). Identity endpoints additionally send `X-Wallet-Address` from the
 *   connected wallet, persisted in localStorage under `sutu_wallet`.
 * - Response envelope: { data, meta? } on success, { error: { code, message } } on failure.
 * - All `/api/v1/*` calls go same-origin through a Next.js rewrite → the
 *   backend origin in NEXT_PUBLIC_SUTU_API_ORIGIN (see next.config.ts). CORS is
 *   open on the backend, so the proxy is an optimization, not a requirement.
 * - The key is required on EVERY request, `/health` included. Without it the
 *   backend allows 2 requests/minute per IP, then answers 429 for 60s.
 * - A 429 carries `Retry-After` in seconds; it is surfaced as
 *   `ApiError.retryAfterSec` so callers can wait rather than hammer the gate.
 */

import type { ApiErrorBody, ApiEnvelope } from "./types";

export const API_PROXY_PREFIX = "/api/v1";

/**
 * API key for the backend gateway. `NEXT_PUBLIC_SUTU_API_KEY` wins so the key
 * can be rotated per environment without a redeploy of this constant.
 */
export const SUTU_API_KEY = process.env.NEXT_PUBLIC_SUTU_API_KEY ?? "sutu-dev-key";

const WALLET_KEY = "sutu_wallet";

/** Request budget. Past this the caller falls back rather than spinning. */
const REQUEST_TIMEOUT_MS = 8000;

/** Connected wallet address, persisted so API calls can authenticate. */
export function getWalletAddress(): `0x${string}` | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(WALLET_KEY);
  return value && /^0x[0-9a-fA-F]{40}$/.test(value) ? (value as `0x${string}`) : null;
}

export function setWalletAddress(address: string) {
  window.localStorage.setItem(WALLET_KEY, address);
}

export function clearWalletAddress() {
  window.localStorage.removeItem(WALLET_KEY);
}

/** Error thrown for every non-2xx backend response. */
export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;
  /**
   * Seconds to wait before retrying, from the `Retry-After` header. Only the 429
   * responses set it; every other status leaves it undefined rather than 0, so a
   * caller cannot mistake "no header" for "retry immediately".
   */
  retryAfterSec?: number;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
    retryAfterSec?: number,
  ) {
    super(`${code}: ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryAfterSec = retryAfterSec;
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

/**
 * Core request helper. Returns the unwrapped `data` plus the envelope `meta`.
 */
export async function request<T>(
  path: string,
  { method = "GET", body, auth = false, headers = {} }: RequestOptions = {},
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const wallet = auth ? getWalletAddress() : null;
  if (auth && !wallet) {
    throw new ApiError(401, "UNAUTHORIZED", "Connect your wallet first");
  }

  const res = await fetch(`${API_PROXY_PREFIX}${path}`, {
    method,
    // Without a budget a stalled origin leaves the caller on its loading state
    // forever, which reads as an empty screen rather than an error.
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      "x-api-key": SUTU_API_KEY,
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
      ...(wallet ? { "x-wallet-address": wallet } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(res.status, "INTERNAL", `Unexpected non-JSON response (${res.status})`);
  }

  if (!res.ok) {
    const err = (json as ApiErrorBody | undefined)?.error;
    throw new ApiError(
      res.status,
      err?.code ?? "INTERNAL",
      err?.message ?? `Request failed (${res.status})`,
      err?.details,
      Number(res.headers.get("retry-after")) || undefined,
    );
  }

  const envelope = json as ApiEnvelope<T>;
  return { data: envelope.data, meta: envelope.meta };
}

/** Convenience wrappers. */
export const apiGet = <T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}) =>
  request<T>(path, { ...opts, method: "GET" });

export const apiPost = <T>(
  path: string,
  body?: unknown,
  opts: Omit<RequestOptions, "method" | "body"> = {},
) => request<T>(path, { ...opts, method: "POST", body });
