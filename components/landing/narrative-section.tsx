"use client";

import { motion } from "framer-motion";
import { revealUp, staggerGroup } from "@/lib/motion";

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
    <section className="">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[860px] px-6"
      >
        <motion.h2
          variants={revealUp}
          className="font-display text-3xl sm:text-4xl lg:text-[48px] font-semibold leading-[1.05] text-white"
        >
          What we believe
        </motion.h2>

        <div className="mt-14 space-y-12">
          {BLOCKS.map((block) => (
            <motion.div 
              key={block.title}
              variants={revealUp}
              className="flex gap-6"
            >
              <div className="hidden sm:block w-0.5 shrink-0 rounded-full bg-violet-500/50" />
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                  {block.title}
                </h3>
                <p className="mt-3 font-body text-base sm:text-lg leading-relaxed text-muted">
                  {block.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
