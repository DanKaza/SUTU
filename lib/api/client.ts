/**
 * SUTU backend API client.
 *
 * - Auth: the LIVE backend (tested 2026-09-10) expects an `X-Wallet-Address`
 *   header instead of the documented SIWE Bearer JWT — `/auth/nonce` and
 *   `/auth/verify` are NOT deployed yet (404). We send the connected wallet
 *   address, persisted in localStorage under `sutu_wallet`.
 * - Response envelope: { data, meta? } on success, { error: { code, message } } on failure.
 * - All `/api/v1/*` calls go same-origin through a Next.js rewrite →
 *   https://sutu.tixrouter.my.id (see next.config.ts) to sidestep CORS.
 */

import type { ApiErrorBody, ApiEnvelope } from "./types";

export const API_PROXY_PREFIX = "/api/v1";

const WALLET_KEY = "sutu_wallet";

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

/** @deprecated legacy JWT storage — cleaned up on sign-out. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("sutu_token");
}

export function clearToken() {
  window.localStorage.removeItem("sutu_token");
}

/** Error thrown for every non-2xx backend response. */
export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(`${code}: ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
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
    headers: {
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
