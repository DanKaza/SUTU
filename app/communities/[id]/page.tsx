"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingBasket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommunity } from "@/lib/community-data";
import { formatMon } from "@/lib/api/format";
import { fadeInUp } from "@/lib/motion";
import { useAppState } from "@/lib/app-state";

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { community, projects, isLoading, notFound: communityNotFound } = useCommunity(id);
  const { basket, addToBasket } = useAppState();

  if (communityNotFound) notFound();

  if (isLoading || !community) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-aluminum dark:bg-white/10" />
            <div className="h-6 w-40 animate-pulse rounded bg-aluminum dark:bg-white/10" />
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-aluminum dark:bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-aluminum dark:bg-white/10" />
          </div>
        </Card>
      </div>
    );
  }

  const inBasket = basket.some((b) => b.communityId === community.slug);
  const activeProjects = projects.filter((p) => p.is_active);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/discover"
        className="flex items-center gap-1 font-body text-sm font-medium text-graphite hover:text-charcoal dark:hover:text-warm-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="mt-6">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal font-display text-xl font-bold text-warm-white dark:bg-warm-white dark:text-charcoal">
              {community.logoInitial}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-charcoal dark:text-warm-white">{community.name}</h1>
              <Badge className="mt-1">{community.categoryLabel}</Badge>
            </div>
          </div>

          <p className="mt-6 font-body text-graphite dark:text-white/60">{community.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:w-64">
            <div>
              <p className="font-display text-xl font-bold text-charcoal dark:text-warm-white">
                {community.supporterCount.toLocaleString()}
              </p>
              <p className="font-body text-xs text-graphite dark:text-white/50">Supporters</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-charcoal dark:text-warm-white">
                {community.totalSupported} MON
              </p>
              <p className="font-body text-xs text-graphite dark:text-white/50">Total Supported</p>
            </div>
          </div>

          {activeProjects.length > 0 && (
            <div className="mt-6 border-t border-graphite/15 pt-5 dark:border-white/10">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-graphite dark:text-white/50">
                Active projects
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {activeProjects.map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-4">
                    <span className="font-body text-sm font-medium text-charcoal dark:text-warm-white">{p.name}</span>
                    <span className="shrink-0 font-body text-xs text-graphite dark:text-white/50">
                      Goal {formatMon(p.funding_goal_wei, 2)} MON
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/communities/${community.slug}/support`}>
              <Button size="lg">Support</Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              disabled={inBasket}
              onClick={() =>
                addToBasket({
                  communityId: community.slug,
                  communityName: community.name,
                  logoInitial: community.logoInitial,
                  category: community.category,
                })
              }
            >
              {inBasket ? (
                <>
                  <Check className="h-4 w-4" />
                  In Basket
                </>
              ) : (
                <>
                  <ShoppingBasket className="h-4 w-4" />
                  Add to Basket
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
