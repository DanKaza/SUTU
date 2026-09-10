"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, hoverInteraction, orientationTransition, staggerContainer } from "@/lib/motion";

const WHY_SUTU = [
  {
    id: "01",
    title: "Satu pencarian, semua komunitas",
    description:
      "Alih-alih hafal atau bookmark alamat web tiap komunitas, cukup cari namanya di SUTU dan profil lengkapnya langsung ketemu.",
  },
  {
    id: "02",
    title: "Dukungan dalam satu klik",
    description:
      "Semua kanal support dan donasi komunitas terkumpul di satu halaman, jadi kamu bisa langsung bantu tanpa lompat ke situs lain.",
  },
  {
    id: "03",
    title: "Dukunganmu terasa nyata",
    description:
      "Setiap kali kamu support, ada afirmasi dan badge dari komunitas — buktinya kontribusimu diperhatikan, bukan sekadar transaksi.",
  },
  {
    id: "04",
    title: "Fokus ke komunitas, bukan ribet teknis",
    description:
      "Tampilan yang tenang dan jelas membuat proses menemukan serta mendukung komunitas jadi cepat, tanpa friksi yang tidak perlu.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-charcoal dark:text-warm-white sm:text-5xl">
          About SUTU
        </h1>
        <p className="mt-4 font-body text-graphite dark:text-white/60">
          Mendukung komunitas Web3 sering kali berarti berpindah-pindah dari satu situs ke situs
          lain hanya untuk mencari alamat donasi atau kanal supportnya. SUTU menyatukan itu semua:
          cukup cari nama komunitasnya di SUTU, dan kamu langsung menemukan profil serta semua cara
          untuk mendukungnya dalam satu tempat — tanpa ribet, tanpa harus tahu alamat web mereka
          sebelumnya.
        </p>
      </motion.div>

      <div className="mt-14">
        <h2 className="font-display text-xl font-bold text-charcoal dark:text-warm-white">Kenapa SUTU</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-5 grid gap-5 sm:grid-cols-2"
        >
          {WHY_SUTU.map((p) => (
            <motion.div key={p.id} variants={fadeInUp} whileHover={hoverInteraction} transition={orientationTransition}>
              <Card className="h-full p-6">
                <span className="font-body text-xs font-medium text-graphite dark:text-white/40">{p.id}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-charcoal dark:text-warm-white">{p.title}</h3>
                <p className="mt-2 font-body text-sm text-graphite dark:text-white/60">{p.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Card className="mt-14 flex flex-col items-start justify-between gap-4 bg-aluminum/60 p-8 dark:bg-white/5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-warm-white">Siap bergabung?</h3>
            <p className="mt-1 font-body text-sm text-graphite dark:text-white/60">
              Temukan komunitas yang tepat dan mulai berkontribusi hari ini.
            </p>
          </div>
          <Button size="lg">Join community</Button>
        </Card>
      </motion.div>
    </div>
  );
}
