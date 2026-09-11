"use client";

/**
 * Support Basket — wired to the SUTU backend.
 *
 * - Demo wallet: one POST /wallet/transfer per community (atomic per transfer).
 * - On-chain: per community → intent → wallet tx (payout address, payThisWei)
 *   → poll status. Sequential so each wallet prompt has a single intent.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Check, Coins, Loader2, ShoppingBasket, Trash2, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orientationTransition, fadeInUp, staggerContainer } from "@/lib/motion";
import { useAppState, type SupportRecord } from "@/lib/app-state";
import { useAuth } from "@/lib/web3/auth-context";
import { AffirmationPop, GestureIcon } from "@/components/support/affirmation-pop";
import { getAffirmation } from "@/lib/affirmations";
import { Gamepad2, Music2, Heart, Sparkles, type LucideIcon } from "lucide-react";
import { walletErrorMessage } from "@/lib/web3/wallet-errors";
import { monadTestnet } from "viem/chains";
import { useSendTransaction, useSwitchChain } from "wagmi";
import { createDonationIntent, fetchDonationIntent, transferFromWallet } from "@/lib/api/endpoints";
import { formatMon } from "@/lib/api/format";
import { useCommunity } from "@/lib/community-data";
import { cn } from "@/lib/utils";

type Rail = "demo" | "onchain";
type Step = "basket" | "payment" | "review" | "processing" | "success" | "error";

const POLL_INTERVAL_MS = 4_000;
/** Background live-status polling cap (UI already shows "submitted" before this). */
const POLL_TIMEOUT_MS = 5 * 60_000;

/** Fire-and-forget live status poll: flips records to confirmed/failed as the backend indexes them. */
function startStatusPolling(
  intents: { intentId: string }[],
  onStatus: (intentId: string, status: "CONFIRMED" | "RECONCILED" | "FAILED") => void,
) {
  const started = Date.now();
  const timer = setInterval(async () => {
    let allSettled = true;
    try {
      for (const { intentId } of intents) {
        const { data } = await fetchDonationIntent(intentId);
        if (data.status === "CONFIRMED" || data.status === "RECONCILED") {
          onStatus(intentId, "CONFIRMED");
        } else if (data.status === "FAILED") {
          onStatus(intentId, "FAILED");
        } else {
          allSettled = false;
        }
      }
      if (allSettled || Date.now() - started > POLL_TIMEOUT_MS) clearInterval(timer);
    } catch {
      // Keep polling on transient errors until the timeout.
    }
  }, POLL_INTERVAL_MS);
}

/** Resolve a basket community to live API data (payout address + project slug). */
function useBasketCommunityData(slugs: string[]) {
  const [details, setDetails] = useState<Record<string, { slug: string; payoutAddress: string; projectSlug: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all(
      slugs.map(async (slug) => {
        try {
          return await loadDetail(slug);
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, { slug: string; payoutAddress: string; projectSlug: string | null }> = {};
      for (const d of results) if (d) map[d.slug] = d;
      setDetails(map);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join(",")]);

  return { details, isLoading };
}

async function loadDetail(slug: string) {
  const { fetchCommunityBySlug } = await import("@/lib/api/endpoints");
  const { data } = await fetchCommunityBySlug(slug);
  const project = data.projects?.find((p) => p.is_active) ?? data.projects?.[0] ?? null;
  return { slug, payoutAddress: data.payout_address, projectSlug: project?.slug ?? null };
}

export default function BasketPage() {
  const { basket, removeFromBasket, updateBasketAmount, basketTotal, clearBasket, addSupports, updateSupportStatus } = useAppState();
  const { isAuthenticated, signIn, refreshUser } = useAuth();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  const [step, setStep] = useState<Step>("basket");
  const [rail, setRail] = useState<Rail | null>(null);
  const [completed, setCompleted] = useState<SupportRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [txPhase, setTxPhase] = useState<"signing" | "broadcasting" | null>(null);

  const slugs = basket.map((b) => b.communityId);
  const { details, isLoading: isLoadingDetails } = useBasketCommunityData(slugs);

  const runDemoPayments = async () => {
    setStep("processing");
    setProgress({ done: 0, total: basket.length });
    try {
      if (!isAuthenticated) await signIn();
      const records: SupportRecord[] = [];
      for (const item of basket) {
        const { data } = await transferFromWallet({
          communitySlug: item.communityId,
          amountUsd: item.amount,
        });
        records.push({
          id: data.transferId,
          communityId: item.communityId,
          communityName: item.communityName,
          logoInitial: item.logoInitial,
          category: item.category,
          amount: item.amount,
          status: "completed",
          date: new Date().toISOString().slice(0, 10),
          txHash: `demo:${data.transferId.slice(0, 8)}`,
        });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      addSupports(records);
      setCompleted(records);
      clearBasket();
      setStep("success");
      // Update the navbar/profile balance.
      void refreshUser();
    } catch (err) {
      const raw = walletErrorMessage(err);
      setErrorMessage(/insufficient wallet balance/i.test(raw)
        ? "Your demo wallet balance is not enough for this basket."
        : raw);
      setStep("error");
    }
  };

  const runOnChainPayments = async () => {
    setStep("processing");
    setProgress({ done: 0, total: basket.length });
    try {
      if (!isAuthenticated) await signIn();

      // Make sure the wallet is on Monad testnet before the first signature.
      try {
        await switchChainAsync({ chainId: monadTestnet.id });
      } catch (err) {
        throw new Error(walletErrorMessage(err));
      }

      const records: SupportRecord[] = [];
      const broadcast: string[] = [];

      for (const item of basket) {
        const detail = details[item.communityId];
        if (!detail?.payoutAddress || !detail.projectSlug) {
          throw new Error(`Missing payout/project info for ${item.communityName}`);
        }

        setTxPhase("signing");
        // Basket amounts are USD by design; convert 1 USD ≈ 1 MON for the demo.
        const monAmount = String(item.amount);
        const idempotencyKey = crypto.randomUUID();
        const { data: intent } = await createDonationIntent(
          { projectSlug: detail.projectSlug, amount: monAmount },
          idempotencyKey,
        );

        setTxPhase("broadcasting");
        const txHash = await sendTransactionAsync({
          to: detail.payoutAddress as `0x${string}`,
          value: BigInt(intent.payThisWei),
          chainId: monadTestnet.id,
        });

        // Broadcast done — record as pending; backend confirms asynchronously.
        // (Blocking on the backend watcher here caused the stuck-loading bug.)
        records.push({
          id: intent.intentId,
          communityId: item.communityId,
          communityName: item.communityName,
          logoInitial: item.logoInitial,
          category: item.category,
          amount: item.amount,
          status: "pending",
          date: new Date().toISOString().slice(0, 10),
          txHash,
        });
        broadcast.push(intent.intentId);
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }

      addSupports(records);
      setCompleted(records);
      clearBasket();
      setStep("success");
      void refreshUser();

      startStatusPolling(
        broadcast.map((intentId) => ({ intentId })),
        (intentId, status) => {
          updateSupportStatus(intentId, status === "FAILED" ? "failed" : "completed");
        },
      );
    } catch (err) {
      setErrorMessage(walletErrorMessage(err));
      setStep("error");
    }
  };

  if (step === "basket" && basket.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aluminum dark:bg-white/10">
          <ShoppingBasket className="h-7 w-7 text-graphite dark:text-white/60" />
        </div>
        <h1 className="mt-6 font-display text-xl font-bold text-charcoal dark:text-warm-white">Your basket is empty</h1>
        <p className="mt-2 font-body text-sm text-graphite dark:text-white/60">
          Add communities from Discover to support them together in one payment.
        </p>
        <Link href="/discover">
          <Button size="lg" className="mt-6">
            Discover Communities
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <AnimatePresence mode="wait">
        {step === "basket" && (
          <motion.div key="basket" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={orientationTransition}>
            <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">Your Support Basket</h1>

            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-6 flex flex-col gap-3">
              {basket.map((item) => (
                <motion.div key={item.communityId} variants={fadeInUp}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm font-bold text-warm-white dark:bg-warm-white dark:text-charcoal">
                      {item.logoInitial}
                    </div>
                    <p className="flex-1 font-body text-sm font-medium text-charcoal dark:text-warm-white">
                      {item.communityName}
                    </p>
                    <div className="relative w-24">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-graphite">$</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.amount}
                        onChange={(e) => updateBasketAmount(item.communityId, Math.max(1, Number(e.target.value) || 1))}
                        className="h-9 pl-6 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeFromBasket(item.communityId)}
                      aria-label={`Remove ${item.communityName}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-graphite transition-colors duration-200 ease-quintic-out hover:bg-aluminum hover:text-charcoal dark:hover:bg-white/10 dark:hover:text-warm-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <Card className="mt-6 flex items-center justify-between p-5">
              <span className="font-body text-sm text-graphite dark:text-white/60">Total</span>
              <span className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">${basketTotal}</span>
            </Card>

            <Button size="lg" className="mt-6 w-full" onClick={() => setStep("payment")}>
              Support All
            </Button>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={orientationTransition}>
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
                    Pay all communities from your $1,000 demo balance
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
                    One signed transaction per community on Monad testnet
                  </p>
                </div>
                {rail === "onchain" && <Check className="h-5 w-5 text-cobalt" />}
              </button>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              disabled={!rail || isLoadingDetails}
              onClick={() => setStep("review")}
            >
              {isLoadingDetails ? "Preparing…" : "Continue"}
            </Button>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={orientationTransition}>
            <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">Review Support</h1>

            <Card className="mt-6 flex flex-col gap-3 p-6">
              {basket.map((item) => (
                <div key={item.communityId} className="flex items-center justify-between">
                  <span className="font-body text-sm text-graphite dark:text-white/60">{item.communityName}</span>
                  <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">${item.amount}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-graphite/15 pt-3 dark:border-white/10">
                <span className="font-body text-sm text-graphite dark:text-white/60">Total</span>
                <span className="font-display text-lg font-bold text-charcoal dark:text-warm-white">${basketTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-graphite dark:text-white/60">Payment method</span>
                <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">
                  {rail === "onchain" ? "Wallet (on-chain)" : "Demo wallet"}
                </span>
              </div>
              {rail === "onchain" && (
                <p className="font-body text-xs text-graphite dark:text-white/50">
                  {basket.length} transaction{basket.length > 1 ? "s" : ""} — your wallet will ask to confirm each one.
                </p>
              )}
            </Card>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={rail === "onchain" ? runOnChainPayments : runDemoPayments}
            >
              Confirm Support
            </Button>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-24 flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-cobalt" />
            <div>
              <p className="font-display text-lg font-bold text-charcoal dark:text-warm-white">
                {rail === "onchain"
                  ? txPhase === "signing"
                    ? "Waiting for wallet confirmation…"
                    : "Sending your transaction…"
                  : "Processing support..."}
              </p>
              <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">
                {progress.total > 0 ? `${progress.done} of ${progress.total} submitted` : "Please wait."}
              </p>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <AffirmationPop
            category={completed.length === 1 ? completed[0].category : null}
            ctaHref="/discover"
            ctaLabel="Discover more"
            secondaryHref="/my-supports"
            secondaryLabel="View My Supports"
          >
            <Card className="p-5">
              {completed.map((record) => {
                const gesture = getAffirmation(record.category);
                return (
                  <div key={record.id} className="flex items-center justify-between gap-2 py-1.5">
                    <span className="flex min-w-0 items-center gap-2">
                      <GestureIcon category={record.category} className="h-4 w-4 shrink-0" />
                      <span className="truncate font-body text-sm text-graphite dark:text-white/60">
                        {record.communityName}
                      </span>
                    </span>
                    <span className="shrink-0 font-body text-sm font-medium text-charcoal dark:text-warm-white">
                      ${record.amount}
                    </span>
                  </div>
                );
              })}
              <div className="mt-2 flex items-center justify-between border-t border-graphite/15 pt-3 dark:border-white/10">
                <span className="font-body text-sm text-graphite dark:text-white/60">Total</span>
                <span className="font-display text-lg font-bold text-charcoal dark:text-warm-white">
                  ${completed.reduce((sum, r) => sum + r.amount, 0)}
                </span>
              </div>
              <p className="mt-3 text-center font-body text-xs text-graphite dark:text-white/50">
                {completed.length > 1
                  ? `${completed.map((r) => getAffirmation(r.category).word).join(" · ")} — every gesture counts`
                  : `${getAffirmation(completed[0]?.category).message}`}
              </p>
            </Card>
          </AffirmationPop>
        )}

        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-24 flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <CircleAlert className="h-8 w-8 text-red-500" />
            </div>
            <p className="font-display text-lg font-bold text-charcoal dark:text-warm-white">Something went wrong</p>
            <p className="max-w-xs break-words font-body text-sm text-graphite dark:text-white/60">{errorMessage}</p>
            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                onClick={() => (rail === "onchain" ? runOnChainPayments() : runDemoPayments())}
              >
                Retry
              </Button>
              <Button onClick={() => setStep("basket")}>Back to basket</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
