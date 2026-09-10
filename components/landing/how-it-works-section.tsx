"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, HeartHandshake, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const STEPS = [
  {
    id: "01",
    icon: Search,
    title: "Cari",
    description: "Ketik topik atau nama komunitas yang kamu minati langsung di SUTU.",
    accent: "#FF7A59",
    rotate: "-rotate-2",
  },
  {
    id: "02",
    icon: Compass,
    title: "Temukan",
    description: "Lihat profil komunitas beserta semua kanal dukungannya di satu halaman.",
    accent: "#C6F135",
    rotate: "rotate-1",
  },
  {
    id: "03",
    icon: HeartHandshake,
    title: "Support",
    description: "Bantu komunitas pilihanmu langsung dari SUTU, tanpa pindah-pindah situs.",
    accent: "#2563EB",
    rotate: "-rotate-1",
  },
  {
    id: "04",
    icon: PartyPopper,
    title: "Afirmasi",
    description: "Dapat ucapan terima kasih dan badge komunitas — bukti kamu bagian dari mereka.",
    accent: "#F72585",
    rotate: "rotate-2",
  },
] as const;

export function HowItWorksSection() {
  const [showAffirmation, setShowAffirmation] = useState(false);

  const runSimulation = () => {
    setShowAffirmation(true);
    setTimeout(() => setShowAffirmation(false), 2600);
  };

  return (
    <div className="relative">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="font-display text-3xl font-extrabold tracking-tight text-charcoal dark:text-warm-white sm:text-4xl"
      >
        Cara kerja <span className="text-[#FF7A59]">SUTU</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isAffirmation = step.id === "04";
          return (
            <motion.div
              key={step.id}
              variants={fadeInUp}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className={`relative overflow-hidden rounded-3xl bg-warm-white p-6 shadow-xl transition-transform duration-300 ease-quintic-out dark:bg-charcoal ${step.rotate}`}
              style={{ boxShadow: `0 20px 45px -20px ${step.accent}66` }}
            >
              <span
                className="pointer-events-none absolute -right-3 -top-6 font-display text-7xl font-extrabold opacity-10"
                style={{ color: step.accent }}
              >
                {step.id}
              </span>

              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${step.accent}26` }}
              >
                <Icon className="h-5 w-5" style={{ color: step.accent }} />
              </div>
              <h3 className="relative mt-4 font-display text-lg font-bold text-charcoal dark:text-warm-white">
                {step.title}
              </h3>
              <p className="relative mt-1.5 font-body text-sm text-graphite dark:text-white/60">
                {step.description}
              </p>

              {isAffirmation && (
                <div className="relative mt-4">
                  <Button
                    size="sm"
                    className="bg-[#F72585] text-warm-white hover:bg-[#F72585]/90"
                    onClick={runSimulation}
                  >
                    Coba simulasi
                  </Button>

                  <AnimatePresence>
                    {showAffirmation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9, rotate: -3 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-2 bottom-14 z-10 rounded-2xl bg-[#F72585] p-3 text-warm-white shadow-xl shadow-[#F72585]/40"
                      >
                        <p className="font-display text-sm font-bold">Thanks! 🎉</p>
                        <p className="mt-0.5 font-body text-xs text-warm-white/80">
                          Badge diperoleh: Supporter of Web3 Builders
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
