"use client";

import { motion } from "framer-motion";
import { revealUp } from "@/lib/motion";

export function EditorialStatement() {
  return (
    <section className="py-24 text-center">
      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[820px] px-6"
      >
        <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-violet-400">
          SUTU / OUR POINT OF VIEW
        </span>
        <blockquote className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.2] text-white">
          “The strongest communities are not built around noise. They are built around people who keep showing up.”
        </blockquote>
        <p className="mt-6 font-body text-base sm:text-lg text-muted">
          Kami percaya koneksi sejati lahir dari konsistensi, ruang yang tenang, dan keinginan tulus untuk saling mendukung tanpa beban instan.
        </p>
      </motion.div>
    </section>
  );
}
