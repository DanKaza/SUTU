"use client";

/**
 * AffirmationPop — animasi momen "support terkirim".
 *
 * Alih-alih struk transaksi (check icon + jumlah besar + tombol tx), momen ini
 * dibingkai sebagai gestur sosial: kata afirmasi per kategori (GG / Encore! /
 * Heartfelt) dengan ikon yang muncul spring dan partikel yang melayang naik.
 * Detail support tetap ada, tapi jadi footnote kecil — bukan headline.
 */

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Music2, Heart, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orientationTransition } from "@/lib/motion";
import { getAffirmation, type Affirmation } from "@/lib/affirmations";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  game: Gamepad2,
  music: Music2,
  charity: Heart,
};

/** Warna aksen ringan per kategori (tailwind class), biar tiap gestur beda rasa. */
const CATEGORY_ACCENTS: Record<string, string> = {
  game: "text-emerald-500",
  music: "text-fuchsia-500",
  charity: "text-rose-500",
};

const FALLBACK_ICON = Sparkles;
const FALLBACK_ACCENT = "text-cobalt";

/** Ikon gestur kecil untuk dipakai di list (mis. ringkasan basket sukses). */
export function GestureIcon({ category, className = "h-4 w-4" }: { category: string | null | undefined; className?: string }) {
  const Icon = (category && CATEGORY_ICONS[category.toLowerCase()]) || FALLBACK_ICON;
  const accent = (category && CATEGORY_ACCENTS[category.toLowerCase()]) || FALLBACK_ACCENT;
  return <Icon className={`${className} ${accent}`} />;
}

/** Partikel kecil yang melayang naik — confetti minim, biar terasa seperti reaksi chat. */
function FloatParticles({ accent }: { accent: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        size: 6 + Math.random() * 6,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, y: 40, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: -90 - Math.random() * 50, scale: [0.5, 1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
          className={`absolute bottom-0 ${accent}`}
          style={{ left: `${p.left}%` }}
        >
          <span className="block rounded-full bg-current" style={{ width: p.size, height: p.size }} />
        </motion.span>
      ))}
    </div>
  );
}

export type AffirmationPopProps = {
  category: string | null | undefined;
  /** Baris detail kecil di bawah gestur, mis. "Pixel Forge · 5 MON" atau daftar basket. */
  children?: React.ReactNode;
  /** Path CTA utama (kembali ke alur support berikutnya). Default /discover. */
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AffirmationPop({
  category,
  children,
  ctaHref = "/discover",
  ctaLabel = "Discover more",
  secondaryHref,
  secondaryLabel,
}: AffirmationPopProps) {
  const affirmation: Affirmation = getAffirmation(category);
  const Icon = (category && CATEGORY_ICONS[category.toLowerCase()]) || FALLBACK_ICON;
  const accent = (category && CATEGORY_ACCENTS[category.toLowerCase()]) || FALLBACK_ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={orientationTransition}
      className="relative mt-12 flex flex-col items-center gap-4 text-center"
    >
      {/* Ikon gestur — muncul spring, seperti reaksi yang "dilempar". */}
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-cobalt/10 ${accent}`}
      >
        <Icon className="h-10 w-10" />
      </motion.div>

      <div className="relative">
        <FloatParticles accent={accent} />
        {/* Kata gestur — headline, seperti pesan. */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 18 }}
          className={`font-display text-5xl font-extrabold tracking-tight ${accent}`}
        >
          {affirmation.word}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-1 font-body text-sm text-graphite dark:text-white/50"
        >
          {affirmation.caption}
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="max-w-sm font-body text-sm text-graphite dark:text-white/60"
      >
        {affirmation.message}
      </motion.p>

      {/* Detail support — footnote kecil, bukan struk. */}
      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 w-full max-w-sm"
        >
          {children}
        </motion.div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref}>
            <Button variant="outline">{secondaryLabel}</Button>
          </Link>
        )}
        <Link href={ctaHref}>
          <Button>{ctaLabel}</Button>
        </Link>
      </div>
    </motion.div>
  );
}
