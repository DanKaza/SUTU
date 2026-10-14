"use client";

import { motion } from "framer-motion";
import { Compass, ShieldCheck, TrendingUp } from "lucide-react";
import { revealUp, iconPop, staggerGroup, staggerGroupImmediate, viewportOnce } from "@/lib/motion";

const BENEFITS = [
  {
    icon: Compass,
    title: "Find it",
    description: "Search by name, cause or category instead of chasing links across the web.",
  },
  {
    icon: TrendingUp,
    title: "Keep it going",
    description: "Small contributions on a rhythm beat one large gesture followed by silence.",
  },
  {
    icon: ShieldCheck,
    title: "Trust it",
    description: "Every contribution is recorded on-chain, so the record is the receipt.",
  },
];

/**
 * A fact strip, not a card grid.
 *
 * Three equal cards would give every item the same weight, which leaves the eye
 * nowhere to land; the decorative orb cluster that used to sit beside the copy
 * was also the page's second accent.
 *
 * The three items are verbs — find, keep, trust — so they arrive on a wider
 * stagger than the other sections. A sequence you can read is the difference
 * between a list of features and an argument.
 *
 * Each item answers the pointer with its glyph only: the mark takes the accent
 * and lifts, the copy stays put. A whole column that moves under the cursor
 * pulls the eye off the sentence it is trying to read.
 */
export function BenefitsSection() {
  return (
    <section>
      <motion.h2
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-[520px] font-display text-[32px] font-semibold leading-[1.15] text-white"
      >
        Support that compounds.
      </motion.h2>
      <motion.p
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-4 max-w-[520px] font-body text-[16px] leading-[1.6] text-muted"
      >
        Back communities that have a rhythm, a purpose and shared values — not another loud channel
        nobody reads.
      </motion.p>

      <motion.ul
        variants={staggerGroupImmediate}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-3"
      >
        {BENEFITS.map((b) => {
          const Icon = b.icon;
          return (
            <motion.li key={b.title} variants={revealUp} className="group">
              <motion.span variants={iconPop} className="inline-flex">
                <Icon
                  className="h-5 w-5 text-muted transition-all duration-200 ease-quintic-out group-hover:-translate-y-0.5 group-hover:text-violet-400"
                  aria-hidden="true"
                />
              </motion.span>
              <h3 className="mt-4 font-display text-[16px] font-semibold text-white">{b.title}</h3>
              <p className="mt-2 font-body text-[16px] leading-[1.6] text-muted">{b.description}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
