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
import { Container, ContainerNarrow } from "@/components/layout/container";
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
  const { isAuthenticated, isRestoring } = useAuth();

  const local = supports.find((s) => s.id === id || `demo-${s.id}` === id || `chain-${s.id}` === id);
  const isIntentId = UUID_RE.test(id);

  const [donation, setDonation] = useState<DonationRecord | null>(null);
  // A state rather than a boolean: "idle" is a real state on a deep link, and
  // collapsing it into `false` is what made notFound() fire before the fetch
  // had even been queued.
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!isIntentId || !isAuthenticated) return;
    let cancelled = false;
    setLoadState("loading");

    fetchDonationIntent(id)
      .then(({ data }) => {
        if (cancelled) return;
        setDonation(data);
        setLoadState("done");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, isIntentId, isAuthenticated]);

  const loadError = loadState === "error";

  /* Still resolving, and therefore not a 404 yet. Three windows have to be
     excluded, not one:
       - the persisted session is being restored, during which
         `isAuthenticated` is false for a signed-in visitor too;
       - auth just resolved, but the effect that starts the fetch has not run
         yet, so the record is neither loading nor absent;
       - the fetch is in flight.
     Missing the middle one still replaced a real donation with a 404. */
  const resolving =
    isRestoring ||
    loadState === "loading" ||
    (isIntentId && isAuthenticated && loadState === "idle");

  if (!resolving && !donation && !local && !loadError) notFound();

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
    <Container className="py-16">
      <ContainerNarrow width="max-w-lg">
      <Link
        href="/my-supports"
        className="flex items-center gap-1 font-body text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Supports
      </Link>

      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="mt-6">
        <h1 className="font-display text-2xl font-bold text-ink">Support Detail</h1>

        <Card className="mt-6 flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-muted">Support</p>
              <p className="font-body text-sm font-medium text-ink">{title}</p>
            </div>
            <Badge>{donation ? "On-chain" : "Demo wallet"}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="font-body text-xs text-muted">Amount</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{amountLabel}</p>
            </div>
            <div>
              <p className="font-body text-xs text-muted">Status</p>
              <p className="mt-1 flex items-center gap-1 font-body text-sm font-medium text-violet">
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
              <p className="font-body text-xs text-muted">Date</p>
              <p className="mt-1 font-body text-sm text-ink">
                {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-muted">Transaction</p>
              <p className="mt-1 break-all font-body text-sm text-ink">
                {txHash ? shortHex(txHash, 6) : "—"}
              </p>
            </div>
          </div>

          <Button variant="outline" disabled className="mt-2">
            View on Explorer (coming soon)
          </Button>
        </Card>
      </motion.div>
      </ContainerNarrow>
    </Container>
  );
}
