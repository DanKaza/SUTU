"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, hoverInteraction, orientationTransition, staggerContainer } from "@/lib/motion";

const WHY_SUTU = [
  {
    id: "01",
    title: "One search, every community",
    description:
      "Instead of memorising or bookmarking each community's site, search its name in SUTU and the full profile is right there.",
  },
  {
    id: "02",
    title: "Support in one flow",
    description:
      "Every support and donation channel sits on a single page, so you can back a community without jumping to another site.",
  },
  {
    id: "03",
    title: "Support that lands",
    description:
      "Every time you back a community you get an affirmation back — proof your contribution was seen, not just settled.",
  },
  {
    id: "04",
    title: "Built for the community, not the plumbing",
    description:
      "A calm, legible interface makes finding and backing a community fast, with none of the friction that gets in the way.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          About SUTU
        </h1>
        <p className="mt-4 font-body text-muted">
          Backing a Web3 community usually means hopping between sites just to find a donation
          address or a support channel. SUTU puts all of it in one place: search for a community by
          name and you land on its profile, with every way to support it already on the page — no
          bookmarks, no having to know their links in advance.
        </p>
      </motion.div>

      <div className="mt-14">
        <h2 className="font-display text-xl font-bold text-ink">Why SUTU</h2>
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
                <span className="font-body text-xs font-medium text-muted/70">{p.id}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 font-body text-sm text-muted">{p.description}</p>
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
        <Card className="mt-14 flex flex-col items-start justify-between gap-4 bg-white/5 p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Ready to back something?</h3>
            <p className="mt-1 font-body text-sm text-muted">
              Find a community you care about and make your first contribution today.
            </p>
          </div>
          <Link href="/discover" className="shrink-0">
            <Button size="lg">Explore communities</Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
