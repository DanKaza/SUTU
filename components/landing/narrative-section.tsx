"use client";

import { motion } from "framer-motion";
import { revealUp, staggerGroup } from "@/lib/motion";

const BLOCKS = [
  {
    title: "The gap",
    body: "Internet terasa ramai, tetapi banyak orang tetap merasa sendiri. Platform berkompetisi untuk atensi, bukan untuk kebersamaan.",
  },
  {
    title: "The approach",
    body: "SUTU memprioritaskan percakapan yang berniat, konteks yang jelas, dan ruang untuk berkontribusi tanpa tekanan metrik.",
  },
  {
    title: "The result",
    body: "Komunitas menjadi lebih mudah ditemukan, diikuti, dan dirawat. Koneksi tumbuh dari konsistensi, bukan viralitas.",
  },
  {
    title: "Made with care",
    body: "Desain, teknologi, dan moderasi bekerja bersama untuk membuat ruang yang aman, inklusif, dan tetap hidup.",
  },
];

export function NarrativeSection() {
  return (
    <section className="py-20">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[860px] px-6"
      >
        <motion.span 
          variants={revealUp}
          className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-violet-400"
        >
          WHY SUTU
        </motion.span>
        <motion.h2 
          variants={revealUp}
          className="mt-4 font-display text-3xl sm:text-4xl lg:text-[48px] font-semibold leading-[1.05] text-white"
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
