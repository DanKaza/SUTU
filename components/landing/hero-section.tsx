"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-aluminum/60 px-6 py-20 dark:bg-white/5 sm:px-12 sm:py-28">
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#FF7A59]/30 blur-3xl dark:bg-[#FF7A59]/15"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#C6F135]/30 blur-3xl dark:bg-[#C6F135]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-4rem] left-1/3 h-64 w-64 rounded-full bg-[#F72585]/20 blur-3xl dark:bg-[#F72585]/10"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-1.5 rounded-full bg-cobalt px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-warm-white shadow-lg shadow-cobalt/30"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Satu pintu untuk semua komunitas
        </motion.span>

        <motion.div
          variants={fadeInUp}
          className="absolute right-2 top-2 hidden -rotate-6 rounded-2xl bg-warm-white px-4 py-2 shadow-xl dark:bg-charcoal sm:block"
        >
          <p className="font-display text-lg font-extrabold text-[#F72585]">100%</p>
          <p className="font-body text-[10px] font-medium text-graphite dark:text-white/60">tanpa ribet</p>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-charcoal dark:text-warm-white sm:text-7xl"
        >
          Cari komunitas.{" "}
          <span className="text-[#FF7A59]">Support</span> tanpa ribet.
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-xl font-body text-base text-graphite dark:text-white/70 sm:text-lg"
        >
          Tidak perlu buka satu-satu alamat web atau link donasi tiap komunitas. Cukup cari di SUTU
          — komunitas Web3 yang kamu cari, beserta cara mendukungnya, ada di satu tempat.
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/discover">
            <Button
              size="lg"
              className="bg-charcoal text-warm-white shadow-xl shadow-charcoal/20 hover:bg-charcoal/90 dark:bg-warm-white dark:text-charcoal dark:hover:bg-warm-white/90"
            >
              Mulai jelajah
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              className="bg-[#C6F135] text-charcoal shadow-xl shadow-[#C6F135]/30 hover:bg-[#C6F135]/90"
            >
              Pelajari SUTU
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
