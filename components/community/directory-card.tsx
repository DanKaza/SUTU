"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CommunityView } from "@/lib/community-data";
import { displayMon } from "@/lib/api/format";
import { fadeInUp, softSpring } from "@/lib/motion";

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

/**
 * Fluid column count. Cards hold a comfortable floor and the number of columns
 * follows the available width.
 *
 * The previous `xl:grid-cols-5` forced five cards into the 1200px shell, which
 * left 224px each once the gaps are taken out — narrower than this card's own
 * header row needs, since the logo and the category badge sit side by side.
 * At that floor the badge wrapped out of alignment with the logo. `auto-fill`
 * lands on four columns inside the shell and two on a phone, without a
 * breakpoint per column count.
 */
export const DIRECTORY_GRID =
  "grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]";

/**
 * The logo tile resolves as the card rises. It is the one element on the card
 * that carries a colour, so it is the one that answers the pointer — the rest
 * of the surface stays still.
 */
const tileSettle: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

export function DirectoryCard({ community }: { community: CommunityView }) {
  const accent = accentFor(community.slug);
  return (
    <motion.div
      variants={fadeInUp}
      // Lift rather than scale: scaling the card scales the text inside it, and
      // at 1.01 the body copy is visibly soft for the whole duration of hover.
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={softSpring}
      className="h-full"
    >
      <Card className="flex h-full flex-col gap-4 p-5 transition-colors duration-300 ease-quintic-out hover:border-violet-400">
        <div className="flex items-start justify-between">
          <motion.span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-sm font-bold"
            style={{ backgroundColor: `${accent}1f`, color: accent }}
            variants={tileSettle}
          >
            {community.logoInitial}
          </motion.span>
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
