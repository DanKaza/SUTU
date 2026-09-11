"use client";

/**
 * Support flow — wired to the SUTU backend (backend_to_front_end.md).
 *
 * Two payment rails (per user decision):
 * - Demo wallet: POST /wallet/transfer (USD ledger, no gas).
 * - On-chain MON: quote → intent (locks discount) → wallet tx to payout
 *   address with value = payThisWei → poll intent status.
 */

import { use, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useBalance, useSendTransaction, useSwitchChain } from "wagmi";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Coins,
  Loader2,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/lib/community-data";
import { orientationTransition } from "@/lib/motion";
import { useAppState, type SupportRecord } from "@/lib/app-state";
import { AffirmationPop } from "@/components/support/affirmation-pop";
import { useAuth } from "@/lib/web3/auth-context";
import { walletErrorMessage } from "@/lib/web3/wallet-errors";
import { monadTestnet } from "viem/chains";
import { formatUnits } from "viem";
import { formatMon, parseMonToWei } from "@/lib/api/format";
import {
  createDonationIntent,
  fetchDonationIntent,
  quoteDonation,
  reportDonationTx,
  transferFromWallet,
} from "@/lib/api/endpoints";
import type { DonationQuote } from "@/lib/api/types";

type Rail = "demo" | "onchain";
type Step = "amount" | "payment" | "review" | "processing" | "success" | "error";
type TxPhase = "signing" | "broadcasting" | "indexing";

const PRESETS = ["0.1", "0.5", "1", "2"];

const POLL_INTERVAL_MS = 4_000;
/** Background live-status polling cap (UI already shows "submitted" before this). */
const POLL_TIMEOUT_MS = 5 * 60_000;

/** Poll one donation intent until it leaves PENDING_PAYMENT (or timeout). */
async function pollIntentStatus(
  intentId: string,
  onTick: (status: string) => void,
): Promise<string> {
  const started = Date.now();
  for (;;) {
    const { data } = await fetchDonationIntent(intentId);
    onTick(data.status);
    if (data.status !== "PENDING_PAYMENT") return data.status;
    if (Date.now() - started > POLL_TIMEOUT_MS) throw new Error("timeout waiting for confirmation");
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

function QuoteBreakdown({ quote, monLabel }: { quote: DonationQuote; monLabel: string }) {
  return (
    <Card className="mt-4 flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm text-graphite dark:text-white/60">You donate</span>
        <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">
          {formatMon(quote.grossAmountWei)} {monLabel}
        </span>
      </div>
      {quote.discountApplied && (
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-graphite dark:text-white/60">
            Campaign: {quote.campaignName} (−{quote.discountBps / 100}%)
          </span>
          <span className="font-body text-sm font-medium text-cobalt">
            −{formatMon(quote.discountWei)} {monLabel}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-graphite/15 pt-2 dark:border-white/10">
        <span className="font-body text-sm text-graphite dark:text-white/60">You pay</span>
        <span className="font-display text-base font-bold text-charcoal dark:text-warm-white">
          {formatMon(quote.netAmountWei)} {monLabel}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-body text-sm text-graphite dark:text-white/60">
          Community receives (fee {quote.platformFeeBps / 100}%)
        </span>
        <span className="font-body text-sm text-charcoal dark:text-warm-white">
          {formatMon(quote.communityAmountWei)} {monLabel}
        </span>
      </div>
    </Card>
  );
}

/** Fire-and-forget live status poll: flips the record to confirmed/failed. */
function startStatusPolling(
  intentId: string,
  onStatus: (status: "CONFIRMED" | "RECONCILED" | "FAILED") => void,
) {
  const started = Date.now();
  const timer = setInterval(async () => {
    try {
      const { data } = await fetchDonationIntent(intentId);
      if (data.status === "CONFIRMED" || data.status === "RECONCILED") {
        clearInterval(timer);
        onStatus("CONFIRMED");
      } else if (data.status === "FAILED") {
        clearInterval(timer);
        onStatus("FAILED");
      } else if (Date.now() - started > POLL_TIMEOUT_MS) {
        clearInterval(timer);
      }
    } catch {
      // Transient network errors — keep polling until the timeout.
    }
  }, POLL_INTERVAL_MS);
}

export default function SupportFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { community, projects, isLoading, notFound: communityNotFound } = useCommunity(id);
  const router = useRouter();
  const { addSupports, updateSupportStatus } = useAppState();
  const { isAuthenticated, signIn, address, refreshUser } = useAuth();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [step, setStep] = useState<Step>("amount");
  const [rail, setRail] = useState<Rail | null>(null);
  const [preset, setPreset] = useState<string | null>("1");
  const [customAmount, setCustomAmount] = useState("");
  const [quote, setQuote] = useState<DonationQuote | null>(null);
  const [record, setRecord] = useState<SupportRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txPhase, setTxPhase] = useState<TxPhase | null>(null);
  /**
   * One intent per payment attempt (backend gotcha): reused across retries
   * until paid, so cancelled attempts don't pile up PENDING_PAYMENT intents.
   */
  const intentRef = useRef<{ id: string; payThisWei: string } | null>(null);

  // Pick the first active project — the API keys quotes/intents by project slug.
  const project = useMemo(() => projects.find((p) => p.is_active) ?? projects[0], [projects]);

  if (communityNotFound) notFound();

  const amountMon = customAmount || preset || "";
  const isValidAmount = /^\d+(\.\d+)?$/.test(amountMon) && Number(amountMon) > 0;

  const requestQuote = async () => {
    if (!community || !project) return;
    const { data } = await quoteDonation({ projectSlug: project.slug, amount: amountMon });
    setQuote(data);
  };

  const runDemoPayment = async () => {
    if (!community || !project) return;
    setStep("processing");
    setErrorMessage(null);
    try {
      if (!isAuthenticated) await signIn();
      const amountUsd = Number(amountMon);
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) throw new Error("Invalid amount");
      const { data } = await transferFromWallet({
        communitySlug: community.slug,
        projectSlug: project.slug,
        amountUsd,
      });
      const newRecord: SupportRecord = {
        id: data.transferId,
        communityId: community.slug,
        communityName: community.name,
        logoInitial: community.logoInitial,
        category: community.category,
        amount: amountUsd,
        status: "completed",
        date: new Date().toISOString().slice(0, 10),
        txHash: `demo:${data.transferId.slice(0, 8)}`,
      };
      addSupports([newRecord]);
      setRecord(newRecord);
      setStep("success");
      // Update the navbar/profile balance.
      void refreshUser();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Transfer failed";
      // Friendly message for the documented insufficient-balance validation error.
      const message = /insufficient wallet balance/i.test(raw)
        ? "Your demo wallet balance is not enough for this amount."
        : raw;
      setErrorMessage(message);
      setStep("error");
    }
  };

  const runOnChainPayment = async () => {
    if (!community || !project) return;
    setStep("processing");
    setErrorMessage(null);
    try {
      if (!isAuthenticated) await signIn();
      if (!community.payoutAddress) throw new Error("Community payout address unavailable");

      // 0. Make sure the wallet is on Monad testnet — if the network isn't
      // added yet, the wallet shows its own "Add network" popup.
      try {
        await switchChainAsync({ chainId: monadTestnet.id });
      } catch (err) {
        throw new Error(walletErrorMessage(err));
      }

      // 1. Lock the discount with an intent. Reuse the pending one from a
      // previous cancelled attempt (same amount) instead of creating a new one.
      setTxPhase("signing");
      let intent = intentRef.current;
      if (!intent) {
        const idempotencyKey = crypto.randomUUID();
        const { data } = await createDonationIntent(
          { projectSlug: project.slug, amount: amountMon },
          idempotencyKey,
        );
        intent = { id: data.intentId, payThisWei: data.payThisWei };
        intentRef.current = intent;
      }

      // 2. Pay the EXACT intent value on-chain. Never recompute from the quote.
      setTxPhase("broadcasting");
      const txHash = await sendTransactionAsync({
        to: community.payoutAddress as `0x${string}`,
        value: BigInt(intent.payThisWei),
        chainId: monadTestnet.id,
      });
      // Paid — the attempt is spent; the next donation gets a fresh intent.
      intentRef.current = null;

      // 2b. Report the hash so the backend verifies & confirms instantly
      // (backend_update.md §4.3b) instead of waiting for the watcher.
      try {
        await reportDonationTx(intent.id, txHash);
      } catch {
        // Optional endpoint — the watcher is the backstop, keep going.
      }

      // 3. The tx is broadcast — record it and show success NOW.
      // The backend already verified the hash via reportDonationTx above (the
      // watcher remains the backstop); we poll the intent status in the
      // background and flip the record to confirmed when it lands.
      // (Blocking on that here caused the "stuck loading after confirm" bug
      // when the backend's indexer lagged.)
      const newRecord: SupportRecord = {
        id: intent.id,
        communityId: community.slug,
        communityName: community.name,
        logoInitial: community.logoInitial,
        category: community.category,
        amount: Number(formatMon(intent.payThisWei)),
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
        txHash,
      };
      addSupports([newRecord]);
      setRecord(newRecord);
      setStep("success");
      void refreshUser();

      startStatusPolling(intent.id, (finalStatus) => {
        updateSupportStatus(
          intent.id,
          finalStatus === "FAILED" ? "failed" : "completed",
        );
      });
    } catch (err) {
      setErrorMessage(walletErrorMessage(err));
      setStep("error");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <Card className="p-8">
          <div className="h-6 w-48 animate-pulse rounded bg-aluminum dark:bg-white/10" />
          <div className="mt-6 h-24 animate-pulse rounded-2xl bg-aluminum dark:bg-white/10" />
        </Card>
      </div>
    );
  }

  if (communityNotFound || !community) notFound();

  if (!project) {
    // The community exists but has no active project to donate to (e.g. the
    // backend is down and we're on mock data, which carries no projects).
    // Show a friendly state instead of a raw 404.
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={orientationTransition}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <CircleAlert className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-charcoal dark:text-warm-white">
              Support is unavailable right now
            </p>
            <p className="mt-2 max-w-sm font-body text-sm text-graphite dark:text-white/60">
              We couldn&apos;t load the funding projects for {community.name}. The
              service may be temporarily down — please try again later.
            </p>
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={() => router.refresh()}>
              Retry
            </Button>
            <Link href="/discover">
              <Button>Back to Discover</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const monLabel = rail === "onchain" ? "MON" : "USD";
  const effectiveAmount = Number(amountMon) || 0;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      {step !== "success" && step !== "processing" && step !== "error" && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 font-body text-sm font-medium text-graphite hover:text-charcoal dark:hover:text-warm-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === "amount" && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={orientationTransition}
            className="mt-6"
          >
            <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">
              Support {community.name}
            </h1>
            <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">Choose an amount</p>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPreset(p);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-2xl border py-3 font-body text-sm font-medium transition-colors duration-200 ease-quintic-out",
                    preset === p && !customAmount
                      ? "border-cobalt bg-cobalt/10 text-cobalt"
                      : "border-graphite/20 text-charcoal hover:border-cobalt dark:border-white/15 dark:text-warm-white",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Custom amount</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                className="mt-2"
              />
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              disabled={!isValidAmount}
              onClick={async () => {
                setStep("payment");
                try {
                  await requestQuote();
                } catch {
                  // Quote is informational; the intent is authoritative.
                }
              }}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={orientationTransition}
            className="mt-6"
          >
            <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">Payment</h1>
            <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">Select payment method</p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setRail("demo")}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ease-quintic-out",
                  rail === "demo" ? "border-cobalt bg-cobalt/5" : "border-graphite/15 dark:border-white/10",
                )}
              >
                <Coins className="h-5 w-5 text-cobalt" />
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Demo wallet</p>
                  <p className="font-body text-xs text-graphite dark:text-white/50">
                    {isAuthenticated && address
                      ? "Pay instantly from your $1,000 demo balance"
                      : "Sign in to use your $1,000 demo balance"}
                  </p>
                </div>
                {rail === "demo" && <Check className="h-5 w-5 text-cobalt" />}
              </button>

              <button
                onClick={() => setRail("onchain")}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ease-quintic-out",
                  rail === "onchain" ? "border-cobalt bg-cobalt/5" : "border-graphite/15 dark:border-white/10",
                )}
              >
                <Wallet className="h-5 w-5 text-cobalt" />
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Wallet (on-chain)</p>
                  <p className="font-body text-xs text-graphite dark:text-white/50">
                    {balance
                      ? `Send MON on Monad testnet — balance ${formatUnits(balance.value, balance.decimals)} ${balance.symbol}`
                      : "Send MON on Monad testnet from your connected wallet"}
                  </p>
                </div>
                {rail === "onchain" && <Check className="h-5 w-5 text-cobalt" />}
              </button>
            </div>

            {quote && <QuoteBreakdown quote={quote} monLabel="MON" />}

            <Button
              size="lg"
              className="mt-8 w-full"
              disabled={!rail}
              onClick={() => setStep("review")}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={orientationTransition}
            className="mt-6"
          >
            <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">Review Support</h1>

            <Card className="mt-6 flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-graphite dark:text-white/60">Community</span>
                <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">
                  {community.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-graphite dark:text-white/60">Amount</span>
                <span className="font-display text-lg font-bold text-charcoal dark:text-warm-white">
                  {amountMon} {rail === "onchain" ? "MON" : "USD"}
                </span>
              </div>
              {rail === "onchain" && quote && quote.discountApplied && (
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-graphite dark:text-white/60">Campaign discount</span>
                  <span className="font-body text-sm font-medium text-cobalt">
                    −{formatMon(quote.discountWei)} MON
                  </span>
                </div>
              )}
              {rail === "onchain" && quote && (
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-graphite dark:text-white/60">You pay</span>
                  <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">
                    {formatMon(quote.netAmountWei)} MON
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-graphite dark:text-white/60">Payment method</span>
                <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">
                  {rail === "onchain" ? "Wallet (on-chain)" : "Demo wallet"}
                </span>
              </div>
            </Card>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={rail === "onchain" ? runOnChainPayment : runDemoPayment}
            >
              Confirm Support
            </Button>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-24 flex flex-col items-center gap-4 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-cobalt" />
            <div>
              <p className="font-display text-lg font-bold text-charcoal dark:text-warm-white">
                {rail === "onchain"
                  ? txPhase === "signing"
                    ? "Waiting for wallet confirmation…"
                    : "Sending your transaction…"
                  : "Processing support..."}
              </p>
              <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">Please wait.</p>
            </div>
          </motion.div>
        )}

        {step === "success" && record && (
          <AffirmationPop
            category={community.category}
            ctaHref="/discover"
            ctaLabel="Discover more"
            secondaryHref={`/my-supports/${record.id}`}
            secondaryLabel="View My Supports"
          >
            <p className="text-center font-body text-xs text-graphite dark:text-white/50">
              {community.name} · {rail === "onchain" ? `${record.amount} MON` : `$${record.amount}`}
              {rail === "onchain" && " · confirming on Monad"}
            </p>
          </AffirmationPop>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-24 flex flex-col items-center gap-4 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <CircleAlert className="h-8 w-8 text-red-500" />
            </div>
            <p className="font-display text-lg font-bold text-charcoal dark:text-warm-white">Something went wrong</p>
            <p className="max-w-xs break-words font-body text-sm text-graphite dark:text-white/60">{errorMessage}</p>
            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                onClick={() => (rail === "onchain" ? runOnChainPayment() : runDemoPayment())}
              >
                Retry
              </Button>
              <Button onClick={() => setStep("amount")}>Change amount</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
