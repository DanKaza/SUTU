"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CommunityView } from "@/lib/community-data";
import { displayMon } from "@/lib/api/format";
import { fadeInUp, hoverInteraction, orientationTransition } from "@/lib/motion";

// Trio aksen DESIGN.MD — dipetakan stabil per kartu (indeks tidak dipakai, jadi
// pakai hash sederhana dari slug biar warna konsisten antar render).
const ACCENTS = ["#7C5CFF", "#22D3EE", "#F472B6"];
function accentFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

function formatCount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
}

export function DirectoryCard({ community }: { community: CommunityView }) {
  const accent = accentFor(community.slug);
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverInteraction}
      transition={orientationTransition}
      className="h-full"
    >
      <Card className="flex h-full flex-col gap-4 p-5 transition-colors duration-300 ease-quintic-out hover:border-violet-400">
        <div className="flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-sm font-bold"
            style={{ backgroundColor: `${accent}1f`, color: accent }}
          >
            {community.logoInitial}
          </div>
          <Badge>{community.categoryLabel}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold text-ink">{community.name}</h3>
          <p className="mt-1 font-body text-sm text-muted">{community.description}</p>
        </div>
        {/* Stat mono kecil — angka = mono (DESIGN.MD §2) */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-muted">
          <span>{formatCount(community.supporterCount)} supporters</span>
          <span>{displayMon(community.totalSupported)} MON</span>
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
