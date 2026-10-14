"use client";

import { motion } from "framer-motion";
import { revealUp, staggerGroup, viewportOnce } from "@/lib/motion";

const BLOCKS = [
  {
    title: "The gap",
    body: "The internet feels loud, but plenty of people still feel alone. Platforms compete for attention, not for connection.",
  },
  {
    title: "The approach",
    body: "SUTU puts intentional support first, keeps context clear, and leaves room to contribute without a metric chasing you.",
  },
  {
    title: "The result",
    body: "Communities become easier to find and easier to back. Real support compounds, it does not go viral.",
  },
  {
    title: "Made with care",
    body: "Design, engineering and moderation work together to keep the space safe, inclusive and alive.",
  },
];

export function NarrativeSection() {
  return (
    <section>
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-[720px]"
      >
        <motion.h2
          variants={revealUp}
          className="font-display text-[24px] font-semibold leading-[1.15] text-white sm:text-[32px] lg:text-[48px]"
        >
          What we believe
        </motion.h2>

        <div className="mt-14 space-y-12">
          {BLOCKS.map((block, index) => {
            // The first block leads the list, so the eye has an entry point
            // instead of four blocks of equal weight.
            const lead = index === 0;
            return (
              <motion.div key={block.title} variants={revealUp}>
                <h3
                  className={`font-display font-semibold text-white ${
                    lead ? "text-[24px]" : "text-[18px]"
                  }`}
                >
                  {block.title}
                </h3>
                <p className={`font-body text-[16px] leading-[1.6] text-muted ${lead ? "mt-4" : "mt-2"}`}>
                  {block.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
