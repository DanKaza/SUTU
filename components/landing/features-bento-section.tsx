"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Layers, ShieldCheck, Zap, Users, Award, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, orientationTransition } from "@/lib/motion";

export const FEATURES_DATA = [
  {
    id: "01",
    icon: Search,
    title: "Satu Pintu Semua Komunitas",
    description: "Temukan semua komunitas Web3 favoritmu dalam satu peta. Tidak perlu bookmark puluhan situs atau membuka tab beruntun.",
    gradient: "from-violet to-cyan",
    span: "col-span-1 lg:col-span-2 row-span-1",
    badge: "ALL-IN-ONE"
  },
  {
    id: "02",
    icon: Layers,
    title: "Direct & On-Chain Support",
    description: "Bantu komunitas langsung dari SUTU. Penerimaan donasi transparan, catatan on-chain, dan afirmasi otomatis untuk setiap kontribusi.",
    gradient: "from-cyan to-emerald",
    span: "col-span-1 lg:col-span-1 row-span-1",
    badge: "DIRECT"
  },
  {
    id: "03",
    icon: Zap,
    title: "Low-Medium Fee",
    description: "Ringan untuk kontributor, transparan untuk komunitas. Kami hanya mengambil 2% fee platform — sisanya langsung ke komunitas.",
    gradient: "from-magenta to-violet",
    span: "col-span-1 lg:col-span-1 row-span-1",
    badge: "0.02 MON"
  },
  {
    id: "04",
    icon: Users,
    title: "Mudah & Tanpa Geeky",
    description: "Meskipun Web3, tetap mudah untuk pemula. Sari tulang teknis tiap komunitas — tindakan yang perlu kamu lakukan tetap jelas.",
    gradient: "from-emerald to-violet",
    span: "col-span-1 lg:col-span-2 row-span-1",
    badge: "CARTESIAN"
  },
  {
    id: "05",
    icon: Award,
    title: "Affirmation Provenance",
    description: "Setiap kontribusi diberi bukti — badge atau NFT afimas. Riwayat on-chain yang tervalidasi, bukan sekadar angka di atas tulang.",
    gradient: "from-violet to-magenta",
    span: "col-span-1 lg:col-span-1 row-span-1",
    badge: "PROVENANCE"
  }
] as const;

export function FeaturesBentoSection() {
  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          Kenapa <span className="text-iridescent">SUTU</span>?
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-4 mx-auto max-w-lg font-body text-base text-muted sm:text-lg"
        >
          Memudahkan Anda menemukan, mendukung, dan tumbuh bersama komunitas Web3 favorit Anda — tanpa friksi.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES_DATA.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-[28px] glass border-white/10 bg-white/[0.04] p-6 shadow-sm transition-all duration-300 min-h-[220px] ${feature.span}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/20 to-cyan/20 sm:from-violet/10 sm:to-cyan/10"
                >
                  <Icon className={`h-5 w-5 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                </div>
                <span className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white/70 bg-white/5 backdrop-blur-sm">
                  {feature.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                {feature.description}
              </p>

              {/* Footer Action */}
              <div className="mt-5 flex items-center gap-1.5 text-muted transition-colors hover:text-ink">
                <span className="font-body text-xs font-semibold uppercase tracking-wider">Learn more</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}