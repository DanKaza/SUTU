"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCommunities } from "@/lib/community-data";
import { communities as mockCommunities } from "@/lib/mock-data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const ACCENTS = ["#FF7A59", "#C6F135", "#F72585"];
const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1"];

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
          className="font-display text-3xl font-extrabold tracking-tight text-charcoal dark:text-warm-white sm:text-4xl"
        >
          Sudah ada di <span className="text-[#2563EB]">SUTU</span>
        </motion.h2>
        <Link
          href="/discover"
          className="flex items-center gap-1 font-body text-sm font-medium text-charcoal hover:text-[#FF7A59] dark:text-warm-white dark:hover:text-[#FF7A59]"
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
              whileHover={{ rotate: 0, scale: 1.02 }}
              className={`rounded-3xl bg-warm-white p-6 shadow-xl transition-transform duration-300 ease-quintic-out dark:bg-charcoal ${ROTATIONS[i % ROTATIONS.length]}`}
              style={{ boxShadow: `0 20px 45px -20px ${accent}55` }}
            >
              <span
                className="inline-block rounded-full px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wide text-charcoal dark:text-warm-white"
                style={{ backgroundColor: `${accent}40` }}
              >
                {community.categoryLabel}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-charcoal dark:text-warm-white">
                {community.name}
              </h3>
              <p className="mt-1.5 font-body text-sm text-graphite dark:text-white/60">
                {community.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-bold text-charcoal dark:text-warm-white"
                  style={{ backgroundColor: `${accent}30` }}
                >
                  {community.logoInitial}
                </div>
                <span className="font-body text-xs text-graphite dark:text-white/50">
                  {community.supporterCount.toLocaleString()} supporters
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
