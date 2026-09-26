"use client";

import { motion } from "framer-motion";
import type { CommunityView } from "@/lib/community-data";
import { staggerContainer } from "@/lib/motion";
import { DirectoryCard } from "@/components/community/directory-card";

/**
 * Highest ranked by confirmed support count. The API exposes no featured
 * flag, so the order comes from the data rather than a hardcoded list.
 */
export function TopCommunities({ communities }: { communities: CommunityView[] }) {
  const top = [...communities]
    .sort((a, b) => b.supporterCount - a.supporterCount)
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink">Most supported right now</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {top.map((community) => (
          <DirectoryCard key={community.slug} community={community} />
        ))}
      </motion.div>
    </div>
  );
}
