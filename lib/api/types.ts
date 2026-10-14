/**
 * SUTU backend API types.
 * Source of truth: implementation_backend.md
 *
 * Rules from the guide:
 * - All on-chain wei values are decimal STRINGS. Never parseFloat them; use BigInt.
 * - Demo wallet USD balances come back as strings; `amountUsd` in transfer requests is a JSON number.
 */

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

/**
 * The codes the backend actually returns.
 *
 * `CONFLICT` is deliberately absent: the API documents 409 as unused, because a
 * repeated request is answered with the same result through idempotency rather
 * than with an error. `RATE_LIMITED` (429) is the one callers should branch on —
 * it carries `Retry-After`, surfaced as `ApiError.retryAfterSec`.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL";

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export type MeResponse = {
  id: string;
  walletAddress: string;
  memberSince: string;
  wallet: {
    balanceUsd: string;
    totalDonatedUsd: string;
    donationCount: number;
  };
};

// Communities & projects (public)

export type CommunityCategory = "music" | "game" | "charity" | null;

export type CommunityProject = {
  id: string;
  community_id: string;
  slug: string;
  name: string;
  description: string;
  funding_goal_wei: string;
  is_active: boolean;
  created_at: string;
};

export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CommunityCategory;
  payout_address: string;
  is_active: boolean;
  created_at: string;
};

export type CommunityDetail = Community & {
  projects: CommunityProject[];
};

// Donations (on-chain)

export type DonationQuote = {
  projectId: string;
  campaignId: string | null;
  campaignName: string | null;
  grossAmountWei: string;
  discountWei: string;
  netAmountWei: string;
  discountBps: number;
  platformFeeBps: number;
  platformFeeWei: string;
  communityAmountWei: string;
  discountApplied: boolean;
};

export type DonationIntent = {
  intentId: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "RECONCILED" | "FAILED";
  /** The EXACT msg.value to send on-chain. Never recompute from a quote. */
  payThisWei: string;
  discountWei: string;
  campaignId: string | null;
  createdAt: string;
};

export type DonationRecord = {
  id: string;
  user_id: string;
  community_id: string;
  project_id: string;
  campaign_id: string | null;
  gross_amount_wei: string;
  discount_wei: string;
  net_amount_wei: string;
  platform_fee_wei: string;
  community_amount_wei: string;
  status: DonationIntent["status"];
  tx_hash: string | null;
  idempotency_key: string | null;
  created_at: string;
  confirmed_at: string | null;
};

/** Response of POST /donations/intents/:id/tx (report a broadcast tx hash). */
export type DonationTxReport = {
  intentId: string;
  status: DonationIntent["status"];
  txHash: string;
  /** Present when status is still PENDING_PAYMENT (e.g. value mismatch, not yet indexed). */
  reason?: string;
};

/**
 * Envelope shape of every list endpoint: the page sits in `data`, the counters
 * sit beside it in `meta`.
 *
 *   { "data": [ ... ], "meta": { "limit": 20, "offset": 0 } }
 *
 * `request()` already unwraps that envelope, so a list call resolves to
 * `{ data: T[], meta }` — reading `res.data.data` finds nothing, because
 * `res.data` is the array itself.
 */
export type Paginated<T> = {
  data: T[];
  meta?: { limit: number; offset: number; total?: number };
};

// Demo wallet (USD, off-chain ledger)

export type WalletBalance = {
  /** String with 2 decimals — render as-is, never do float math on it. */
  balanceUsd: string;
};

export type WalletTransfer = {
  transferId: string;
  amountUsd: string;
  community: string;
  newBalanceUsd: string;
};

export type WalletHistoryEntry = {
  id: string;
  amount_usd: string;
  balance_after: string;
  kind: "SIGNUP_BONUS" | "DONATION" | "REFUND" | "ADJUSTMENT";
  description: string;
  created_at: string;
};

export type WalletTransferRecord = {
  id: string;
  amount_usd: string;
  status: string;
  created_at: string;
  community_slug: string;
  community_name: string;
  project_slug: string | null;
};

// Stats (public)

export type CommunityStats = {
  community_slug: string;
  total_donations: string;
  total_gross_wei: string;
  total_discount_wei: string;
  total_community_wei: string;
};

export type StatsResponse = {
  communities: CommunityStats[];
  generatedAt: string;
};
