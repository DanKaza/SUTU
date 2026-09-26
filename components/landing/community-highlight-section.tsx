"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCommunities } from "@/lib/community-data";
import { communities as mockCommunities } from "@/lib/mock-data";
import { fadeInUp, staggerContainer, orientationTransition } from "@/lib/motion";

const ACCENTS = ["#7C5CFF", "#22D3EE", "#7C5CFF"];

export function CommunityHighlightSection() {
  const { communities } = useCommunities();
  const source = communities.length > 0 ? communities : mockCommunities.map((c) => ({
    id: c.id,
    slug: c.id,
    name: c.name,
    description: c.description,
    categoryLabel: c.category,
    logoInitial: c.logoInitial,
    supporterCount: c.supporterCount,
    totalSupported: c.totalSupported.toLocaleString(),
  }));
  const highlighted = source.slice(0, 3);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Sudah ada di <span className="text-iridescent">SUTU</span>
        </motion.h2>
        <Link
          href="/discover"
          className="flex items-center gap-1 font-body text-sm font-medium text-ink hover:text-cyan"
        >
          Lihat semua komunitas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 sm:grid-cols-3"
      >
        {highlighted.map((community, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <motion.div
              key={community.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={orientationTransition}
              className="h-full"
            >
              <div className="glass group h-full rounded-3xl p-6 transition-colors duration-300">
              <span
                className="inline-block rounded-full px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wide text-ink"
                style={{ backgroundColor: `${accent}40` }}
              >
                {community.categoryLabel}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">
                {community.name}
              </h3>
              <p className="mt-1.5 font-body text-sm text-muted">
                {community.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-bold text-ink"
                  style={{ backgroundColor: `${accent}30` }}
                >
                  {community.logoInitial}
                </div>
                <span className="font-body text-xs text-muted">
                  {community.supporterCount.toLocaleString()} supporters
                </span>
              </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
