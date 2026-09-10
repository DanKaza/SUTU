"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CommunityView } from "@/lib/community-data";
import { fadeInUp, hoverInteraction, orientationTransition } from "@/lib/motion";

function formatCount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
}

export function DirectoryCard({ community }: { community: CommunityView }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverInteraction}
      transition={orientationTransition}
      className="h-full"
    >
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal font-display text-sm font-bold text-warm-white dark:bg-warm-white dark:text-charcoal">
            {community.logoInitial}
          </div>
          <Badge>{community.categoryLabel}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold text-charcoal dark:text-warm-white">{community.name}</h3>
          <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">{community.description}</p>
        </div>
        <div className="flex items-center gap-4 font-body text-xs text-graphite dark:text-white/50">
          <span>{formatCount(community.supporterCount)} supporters</span>
          <span>{community.totalSupported} MON supported</span>
        </div>
        <Link href={`/communities/${community.slug}`}>
          <Button variant="outline" className="w-full">
            View Community
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
