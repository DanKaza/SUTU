"use client";

/**
 * Support Detail — resolves a support record by id.
 *
 * - On-chain donations: id is the intent UUID → GET /donations/intents/:id
 *   (authoritative status, polled once on load).
 * - Demo transfers: looked up in local session records (the API has no
 *   single-transfer endpoint).
 */

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/motion";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/web3/auth-context";
import { fetchDonationIntent } from "@/lib/api/endpoints";
import { formatMon, shortHex, statusToUi } from "@/lib/api/format";
import type { DonationRecord } from "@/lib/api/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { supports } = useAppState();
  const { isAuthenticated } = useAuth();

  const local = supports.find((s) => s.id === id || `demo-${s.id}` === id || `chain-${s.id}` === id);
  const isIntentId = UUID_RE.test(id);

  const [donation, setDonation] = useState<DonationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(isIntentId && isAuthenticated);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isIntentId || !isAuthenticated) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(false);

    fetchDonationIntent(id)
      .then(({ data }) => {
        if (!cancelled) setDonation(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isIntentId, isAuthenticated]);

  if (!isLoading && !donation && !local && !loadError) notFound();

  const amountLabel = donation
    ? `${formatMon(donation.net_amount_wei, 2)} MON`
    : local
      ? `$${local.amount}`
      : "—";

  const title = donation
    ? "On-chain donation"
    : (local?.communityName ?? "Support");

  const status = donation ? statusToUi(donation.status) : ("confirmed" as const);
  const txHash = donation?.tx_hash ?? local?.txHash ?? null;
  const createdAt = donation?.created_at ?? (local?.date ? new Date(local.date).toISOString() : null);

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Link
        href="/my-supports"
        className="flex items-center gap-1 font-body text-sm font-medium text-graphite hover:text-charcoal dark:hover:text-warm-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Supports
      </Link>

      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="mt-6">
        <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">Support Detail</h1>

        <Card className="mt-6 flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-graphite dark:text-white/50">Support</p>
              <p className="font-body text-sm font-medium text-charcoal dark:text-warm-white">{title}</p>
            </div>
            <Badge>{donation ? "On-chain" : "Demo wallet"}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-graphite/15 pt-4 dark:border-white/10">
            <div>
              <p className="font-body text-xs text-graphite dark:text-white/50">Amount</p>
              <p className="mt-1 font-display text-lg font-bold text-charcoal dark:text-warm-white">{amountLabel}</p>
            </div>
            <div>
              <p className="font-body text-xs text-graphite dark:text-white/50">Status</p>
              <p className="mt-1 flex items-center gap-1 font-body text-sm font-medium text-cobalt">
                {status === "confirmed" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Completed
                  </>
                ) : status === "failed" ? (
                  <>
                    <CircleAlert className="h-4 w-4 text-red-500" />
                    Failed
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-amber-500" />
                    Pending
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-graphite dark:text-white/50">Date</p>
              <p className="mt-1 font-body text-sm text-charcoal dark:text-warm-white">
                {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-graphite dark:text-white/50">Transaction</p>
              <p className="mt-1 break-all font-body text-sm text-charcoal dark:text-warm-white">
                {txHash ? shortHex(txHash, 6) : "—"}
              </p>
            </div>
          </div>

          <Button variant="outline" disabled className="mt-2">
            View on Explorer (coming soon)
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
