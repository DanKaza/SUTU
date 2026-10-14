"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCommunities } from "@/lib/community-data";
import { formatNumber } from "@/lib/api/format";
import { CountUp } from "@/components/ui/count-up";
import { revealUp, softSpring, staggerGroup, viewportOnce } from "@/lib/motion";

/**
 * The app's own communities, as a rail of three columns.
 *
 * Live rows, not a picture of a list: the same query the /discover grid reads,
 * so a community that goes inactive disappears from here too. No card — a
 * hairline above each community is enough to group it, and the rows are links.
 *
 * Each row answers the pointer: it lifts, the mark takes an accent ring, the
 * name steps aside, and the count runs to its figure as the row arrives. The
 * count only animates when the figures are real — on the seed fallback the
 * numbers are rendered flat, because a number that counts reads as measured and
 * a seeded figure did not measure anything.
 *
 * There is deliberately no "showing sample data" banner any more: the live host
 * answers, so the rail is real, and a standing notice about a state that no
 * longer occurs is just noise above the fold.
 */
/**
 * The figure and its unit, together.
 *
 * The singular matters: the live ledger has communities sitting at exactly 1,
 * and "1 supporters" is the kind of thing a reader notices before anything else
 * on the page. Zero keeps the sentence rather than reading "0 supporters",
 * which is a number where a state belongs.
 *
 * `animate` is false on the bundled fallback — a count-up reads as a measured
 * figure, and seeded figures measured nothing.
 */
function SupporterCount({ count, animate }: { count: number; animate: boolean }) {
  if (count === 0) return <>No supporters yet</>;
  return (
    <>
      {animate ? <CountUp value={count} /> : formatNumber(count)}{" "}
      {count === 1 ? "supporter" : "supporters"}
    </>
  );
}

export function ShowcasePanel() {
  const { communities, isLoading, isFallback } = useCommunities();
  const rail = communities.slice(0, 3);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <motion.h2
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-[420px] font-display text-[32px] font-semibold leading-[1.15] text-white"
        >
          Everything you need to back a community.
        </motion.h2>
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <Link
            href="/about"
            className="group flex min-h-11 items-center gap-2 font-body text-[16px] font-medium text-muted transition-colors duration-200 ease-quintic-out hover:text-white"
          >
            How SUTU works
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-quintic-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>

      <motion.ul
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3"
      >
        {isLoading
          ? // Reserved, not hidden: the rail is below the fold, but a collapse
            // here still reads as the page jumping once the data lands.
            [0, 1, 2].map((i) => (
              <li key={i} aria-hidden="true" className="min-h-[184px] border-t border-white/11 pt-6">
                <div className="h-11 w-11 rounded-full bg-white/[0.06]" />
                <div className="mt-5 h-6 w-2/3 rounded bg-white/[0.06]" />
                <div className="mt-2 h-4 w-full rounded bg-white/[0.06]" />
                <div className="mt-1 h-4 w-4/5 rounded bg-white/[0.06]" />
              </li>
            ))
          : rail.map((c) => (
              <motion.li
                key={c.id}
                variants={revealUp}
                whileHover={{ y: -4 }}
                transition={softSpring}
              >
                <Link
                  href={`/communities/${c.slug}`}
                  className="group block border-t border-white/11 pt-6 transition-colors duration-200 ease-quintic-out hover:border-white/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-800 font-display text-[14px] font-bold text-ink ring-1 ring-transparent transition-all duration-200 ease-quintic-out group-hover:ring-violet-400/60">
                    {c.logoInitial}
                  </div>
                  <p className="mt-5 font-display text-[24px] font-semibold text-white transition-transform duration-300 ease-quintic-out group-hover:translate-x-1">
                    {c.name}
                  </p>
                  <p className="mt-2 font-body text-[16px] leading-[1.5] text-muted">{c.description}</p>
                  <p className="mt-4 font-mono text-[12px] text-faint">
                    <SupporterCount count={c.supporterCount} animate={!isFallback} />
                  </p>
                </Link>
              </motion.li>
            ))}
      </motion.ul>
    </section>
  );
}
