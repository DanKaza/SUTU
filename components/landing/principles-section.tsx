"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const WHY_SUTU = [
  {
    id: "01",
    title: "Satu pencarian, semua komunitas",
    description:
      "Tidak perlu hafal atau bookmark alamat web tiap komunitas. Cukup cari namanya di SUTU dan profil lengkapnya langsung ketemu.",
    accent: "#FF7A59",
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    id: "02",
    title: "Dukungan dalam satu klik",
    description:
      "Semua kanal support dan donasi komunitas terkumpul di satu halaman, jadi kamu bisa langsung bantu tanpa lompat ke situs lain.",
    accent: "#2563EB",
    span: "lg:col-span-1",
  },
  {
    id: "03",
    title: "Dukunganmu terasa nyata",
    description:
      "Setiap kali kamu support, ada afirmasi dan badge dari komunitas — buktinya kontribusimu diperhatikan, bukan sekadar transaksi.",
    accent: "#F72585",
    span: "lg:col-span-1",
  },
  {
    id: "04",
    title: "Fokus ke komunitas, bukan ribet teknis",
    description:
      "Tampilan yang tenang dan jelas membuat proses menemukan serta mendukung komunitas jadi cepat, tanpa friksi yang tidak perlu.",
    accent: "#C6F135",
    span: "sm:col-span-2 lg:col-span-2",
  },
];

export function PrinciplesSection() {
  return (
    <div>
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="font-display text-3xl font-extrabold tracking-tight text-charcoal dark:text-warm-white sm:text-4xl"
      >
        Kenapa <span className="text-[#F72585]">SUTU</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {WHY_SUTU.map((principle) => (
          <motion.div
            key={principle.id}
            variants={fadeInUp}
            whileHover={{ scale: 1.015 }}
            className={`relative overflow-hidden rounded-3xl bg-warm-white p-6 shadow-xl transition-transform duration-300 ease-quintic-out dark:bg-charcoal ${principle.span}`}
            style={{ boxShadow: `0 20px 45px -20px ${principle.accent}55` }}
          >
            <span
              className="pointer-events-none absolute -bottom-6 -right-2 font-display text-8xl font-extrabold opacity-10"
              style={{ color: principle.accent }}
            >
              {principle.id}
            </span>
            <h3 className="relative font-display text-lg font-bold text-charcoal dark:text-warm-white">
              {principle.title}
            </h3>
            <p className="relative mt-2 font-body text-sm text-graphite dark:text-white/60">
              {principle.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <Link
        href="/about"
        className="mt-6 inline-flex items-center gap-1 font-body text-sm font-medium text-charcoal hover:text-[#F72585] dark:text-warm-white dark:hover:text-[#F72585]"
      >
        Baca lebih lanjut
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
