"use client";

import { motion } from "framer-motion";
import { revealUp } from "@/lib/motion";

export function EditorialStatement() {
  return (
    <section className="text-center">
      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[820px] px-6"
      >
        <span className="font-mono text-[11px] text-faint">Our point of view</span>
        <blockquote className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.2] text-white">
          “The strongest communities are not built around noise. They are built around people who keep showing up.”
        </blockquote>
        <p className="mt-6 font-body text-base sm:text-lg text-muted">
          We believe real connection comes from showing up consistently, in a calm space, with no
          pressure to perform.
        </p>
      </motion.div>
    </section>
  );
}
