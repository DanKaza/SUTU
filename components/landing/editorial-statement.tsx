"use client";

import { motion } from "framer-motion";
import { revealUp, staggerGroup, viewportOnce } from "@/lib/motion";

/**
 * The page's fullest pause, carrying one argument.
 *
 * The quote lands before the sentence that explains it: the claim is what the
 * reader meets first, and the caption only makes sense once it is on screen.
 */
export function EditorialStatement() {
  return (
    <section className="text-center">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-[820px]"
      >
        <motion.blockquote
          variants={revealUp}
          className="font-display text-[24px] font-medium leading-[1.2] text-white sm:text-[32px] lg:text-[48px]"
        >
          “The strongest communities are not built around noise. They are built around people who
          keep showing up.”
        </motion.blockquote>
        <motion.p variants={revealUp} className="mt-6 font-body text-[18px] leading-[1.6] text-muted">
          We believe real connection comes from showing up consistently, in a calm space, with no
          pressure to perform.
        </motion.p>
      </motion.div>
    </section>
  );
}