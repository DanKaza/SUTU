"use client";

/**
 * My Supports — fed by the SUTU backend.
 *
 * - Totals from GET /users/me (demo wallet stats).
 * - Demo transfers from GET /wallet/transfers.
 * - On-chain donations from GET /donations/mine (wei strings → BigInt only).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useAuth } from "@/lib/web3/auth-context";
import { fetchDonationIntent, fetchMyDonations, fetchWalletTransfers } from "@/lib/api/endpoints";
import { formatMon, statusToUi } from "@/lib/api/format";
import type { DonationRecord, WalletTransferRecord } from "@/lib/api/types";

type SupportRow = {
  id: string;
  kind: "demo" | "onchain";
  title: string;
  amountLabel: string;
  date: string;
  statusUi: "pending" | "confirmed" | "failed";
};

function transferRow(t: WalletTransferRecord): SupportRow {
  return {
    id: `demo-${t.id}`,
    kind: "demo",
    title: t.community_name,
    amountLabel: `$${t.amount_usd}`,
    date: new Date(t.created_at).toLocaleDateString(),
    statusUi: t.status === "COMPLETED" ? "confirmed" : "pending",
  };
}

function donationRow(d: DonationRecord): SupportRow {
  return {
    id: `chain-${d.id}`,
    kind: "onchain",
    title: `Donation ${formatMon(d.net_amount_wei, 2)} MON`,
    amountLabel: `${formatMon(d.net_amount_wei, 2)} MON`,
    date: new Date(d.created_at).toLocaleDateString(),
    statusUi: statusToUi(d.status),
  };
}

function StatusBadge({ statusUi }: { statusUi: SupportRow["statusUi"] }) {
  if (statusUi === "confirmed") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-cobalt/10 px-2 py-1 font-body text-[11px] font-medium text-cobalt">
        <Check className="h-3 w-3" />
        Completed
      </span>
    );
  }
  if (statusUi === "failed") {
    return (
      <span className="rounded-full bg-red-500/10 px-2 py-1 font-body text-[11px] font-medium text-red-500">Failed</span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 font-body text-[11px] font-medium text-amber-500">
      <Clock className="h-3 w-3" />
      Pending
    </span>
  );
}

const PENDING_POLL_MS = 5_000;

export default function MySupportsPage() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [transfers, setTransfers] = useState<WalletTransferRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [transfersRes, donationsRes] = await Promise.all([
      fetchWalletTransfers(50, 0).catch(() => null),
      fetchMyDonations(50, 0).catch(() => null),
    ]);
    return { transfersRes, donationsRes };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    load().then(({ transfersRes, donationsRes }) => {
      if (cancelled) return;
      setTransfers(transfersRes?.data ?? []);
      setDonations(donationsRes?.data ?? []);
      if (!transfersRes && !donationsRes) setError("Could not load your supports. Try again later.");
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, load]);

  // Live-refresh: while any on-chain donation is still PENDING_PAYMENT, poll
  // it individually so rows flip to Completed without a manual reload.
  const pendingIds = useMemo(
    () => donations.filter((d) => d.status === "PENDING_PAYMENT").map((d) => d.id),
    [donations],
  );
  const pendingKey = pendingIds.join(",");
  const pollTimers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    pollTimers.current.forEach(clearInterval);
    pollTimers.current = [];
    if (!isAuthenticated || pendingIds.length === 0) return;

    for (const intentId of pendingIds) {
      const timer = setInterval(async () => {
        try {
          const { data } = await fetchDonationIntent(intentId);
          if (data.status !== "PENDING_PAYMENT") {
            setDonations((prev) => prev.map((d) => (d.id === intentId ? { ...d, status: data.status, tx_hash: data.tx_hash ?? d.tx_hash } : d)));
            // Donation counters/balance may have changed too.
            void refreshUser();
          }
        } catch {
          // Keep polling on transient errors.
        }
      }, PENDING_POLL_MS);
      pollTimers.current.push(timer);
    }

    return () => {
      pollTimers.current.forEach(clearInterval);
      pollTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey, isAuthenticated]);

  const rows = [
    ...transfers.map(transferRow),
    ...donations.map(donationRow),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const totalLabel = user
    ? `$${user.wallet.totalDonatedUsd}`
    : `$${transfers.reduce((sum, t) => sum + Number(t.amount_usd), 0).toFixed(2)}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="font-display text-4xl font-bold tracking-tight text-charcoal dark:text-warm-white sm:text-5xl"
      >
        My Supports
      </motion.h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:w-80">
        <Card className="p-5">
          <p className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">
            {isAuthenticated ? totalLabel : "—"}
          </p>
          <p className="mt-1 font-body text-xs text-graphite dark:text-white/50">Total Supported</p>
        </Card>
        <Card className="p-5">
          <p className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">
            {isAuthenticated ? rows.length : "—"}
          </p>
          <p className="mt-1 font-body text-xs text-graphite dark:text-white/50">Supports</p>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-charcoal dark:text-warm-white">Recent Supports</h2>

        {!isAuthenticated ? (
          <div className="mt-6 py-16 text-center">
            <p className="font-body text-sm text-graphite dark:text-white/60">
              Connect your wallet to see your support history.
            </p>
          </div>
        ) : isLoading ? (
          <div className="mt-5 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-aluminum dark:bg-white/10" />
                <div className="h-4 w-40 animate-pulse rounded bg-aluminum dark:bg-white/10" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 py-12 text-center">
            <p className="font-body text-sm text-graphite dark:text-white/60">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6 py-16 text-center">
            <p className="font-body text-sm text-graphite dark:text-white/60">
              You haven&apos;t supported any communities yet.
            </p>
            <Link href="/discover">
              <Button size="lg" className="mt-5">
                Discover Communities
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-5 flex flex-col gap-3">
            {rows.map((row) => (
              <motion.div key={row.id} variants={fadeInUp}>
                <Link href={row.kind === "onchain" ? `/my-supports/${row.id}` : `/my-supports/${row.id}`}>
                  <Card className="flex items-center gap-4 p-4 transition-colors duration-200 ease-quintic-out hover:border-cobalt">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm font-bold text-warm-white dark:bg-warm-white dark:text-charcoal">
                      {row.kind === "demo" ? "$" : "⛓"}
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium text-charcoal dark:text-warm-white">{row.title}</p>
                      <p className="font-body text-xs text-graphite dark:text-white/50">{row.date}</p>
                    </div>
                    <span className="font-display text-base font-bold text-charcoal dark:text-warm-white">
                      {row.amountLabel}
                    </span>
                    <StatusBadge statusUi={row.statusUi} />
                    <ArrowRight className="h-4 w-4 text-graphite" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
