import { apiGet, apiPost, SUTU_API_KEY } from "./client";
import type {
  Community,
  CommunityDetail,
  DonationIntent,
  DonationQuote,
  DonationRecord,
  DonationTxReport,
  MeResponse,
  Paginated,
  StatsResponse,
  WalletBalance,
  WalletHistoryEntry,
  WalletTransfer,
  WalletTransferRecord,
} from "./types";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
// NOTE: the documented SIWE routes (POST /auth/nonce, POST /auth/verify) are
// NOT deployed on the live backend (404 as of 2026-09-10). Auth is done via
// the X-Wallet-Address header in lib/api/client.ts instead. Re-add the
// requestNonce/verifySignIn functions here once the backend ships SIWE.

export function fetchMe() {
  return apiGet<MeResponse>("/users/me", { auth: true });
}

// ---------------------------------------------------------------------------
// Communities & projects (public)
// ---------------------------------------------------------------------------

export function fetchCommunities() {
  return apiGet<Community[]>("/communities");
}

export function fetchCommunityBySlug(slug: string) {
  return apiGet<CommunityDetail>(`/communities/${encodeURIComponent(slug)}`);
}

// ---------------------------------------------------------------------------
// Donations (on-chain)
// ---------------------------------------------------------------------------

export function quoteDonation(input: { projectSlug: string; amount: string }) {
  return apiPost<DonationQuote>("/donations/quote", input);
}

/** Report a broadcast tx hash so the backend verifies & confirms the intent instantly (4.3b). */
export function reportDonationTx(intentId: string, txHash: string) {
  return apiPost<DonationTxReport>(
    `/donations/intents/${encodeURIComponent(intentId)}/tx`,
    { txHash },
    { auth: true },
  );
}

export function createDonationIntent(input: { projectSlug: string; amount: string }, idempotencyKey: string) {
  return apiPost<DonationIntent>("/donations/intents", input, {
    auth: true,
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function fetchDonationIntent(intentId: string) {
  return apiGet<DonationRecord>(`/donations/intents/${encodeURIComponent(intentId)}`, { auth: true });
}

/** List endpoints unwrap the backend's Paginated envelope into { data, meta }. */
export async function fetchMyDonations(limit = 20, offset = 0) {
  const res = await apiGet<Paginated<DonationRecord>>(`/donations/mine?limit=${limit}&offset=${offset}`, { auth: true });
  return { data: res.data.data ?? [], meta: res.data.meta };
}

// ---------------------------------------------------------------------------
// Demo wallet
// ---------------------------------------------------------------------------

export function fetchWalletBalance() {
  return apiGet<WalletBalance>("/wallet/balance", { auth: true });
}

export function transferFromWallet(input: {
  communitySlug: string;
  projectSlug?: string;
  /** JSON number, positive, max 1,000,000 — NOT a wei string. */
  amountUsd: number;
  donationIntentId?: string;
}) {
  return apiPost<WalletTransfer>("/wallet/transfer", input, { auth: true });
}

export async function fetchWalletHistory(limit = 20, offset = 0) {
  const res = await apiGet<Paginated<WalletHistoryEntry>>(`/wallet/history?limit=${limit}&offset=${offset}`, { auth: true });
  return { data: res.data.data ?? [], meta: res.data.meta };
}

export async function fetchWalletTransfers(limit = 20, offset = 0) {
  const res = await apiGet<Paginated<WalletTransferRecord>>(`/wallet/transfers?limit=${limit}&offset=${offset}`, { auth: true });
  return { data: res.data.data ?? [], meta: res.data.meta };
}

// ---------------------------------------------------------------------------
// Stats (public)
// ---------------------------------------------------------------------------

export function fetchStats() {
  return apiGet<StatsResponse>("/stats");
}

// ---------------------------------------------------------------------------
// Health (public)
// ---------------------------------------------------------------------------

export async function fetchHealth() {
  // /health lives outside /api/v1, so bypass the proxy prefix. It now requires
  // the API key like everything else (backend_update.md §8).
  const res = await fetch("/health", {
    cache: "no-store",
    headers: { "x-api-key": SUTU_API_KEY },
  });
  const json = (await res.json()) as { data?: { status?: string } };
  return json.data ?? { status: res.ok ? "ok" : "unknown" };
}
