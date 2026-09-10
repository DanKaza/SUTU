"use client";

import { motion } from "framer-motion";
import type { CommunityView } from "@/lib/community-data";
import { staggerContainer } from "@/lib/motion";
import { DirectoryCard } from "@/components/community/directory-card";

export function FeaturedCommunities({ communities }: { communities: CommunityView[] }) {
  const featured = communities.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-charcoal dark:text-warm-white">Featured Communities</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featured.map((community) => (
          <DirectoryCard key={community.slug} community={community} />
        ))}
      </motion.div>
    </div>
  );
}
