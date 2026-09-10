"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fadeInUp, orientationTransition } from "@/lib/motion";

const CHANNELS = [
  { icon: Mail, label: "Email", value: "hello@commons.xyz" },
  { icon: MessageCircle, label: "Discord", value: "discord.gg/commons" },
  { icon: Github, label: "GitHub", value: "github.com/commons" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="font-display text-4xl font-bold tracking-tight text-charcoal dark:text-warm-white sm:text-5xl"
      >
        Contact
      </motion.h1>
      <p className="mt-3 max-w-xl font-body text-graphite dark:text-white/60">
        Ada pertanyaan, feedback, atau ide kolaborasi? Kirim pesan, tim kami akan merespons secepat
        mungkin.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={orientationTransition}
                className="flex flex-col items-start gap-2 py-10"
              >
                <h3 className="font-display text-lg font-bold text-charcoal dark:text-warm-white">Pesan terkirim</h3>
                <p className="font-body text-sm text-graphite dark:text-white/60">
                  Terima kasih! Kami akan membalas ke email kamu segera.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={orientationTransition}
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Nama</label>
                    <Input required placeholder="Nama kamu" className="mt-2" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Email</label>
                    <Input required type="email" placeholder="you@example.com" className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-charcoal dark:text-warm-white">Pesan</label>
                  <Textarea required rows={5} placeholder="Ceritakan kebutuhan kamu..." className="mt-2" />
                </div>
                <Button type="submit" size="lg" className="w-fit">
                  Kirim pesan
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        <Card className="flex flex-col gap-4 bg-aluminum/60 p-6 dark:bg-white/5">
          <h3 className="font-display text-lg font-bold text-charcoal dark:text-warm-white">Kanal lain</h3>
          {CHANNELS.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-white dark:bg-dark-base">
                <c.icon className="h-4 w-4 text-graphite dark:text-white/70" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-charcoal dark:text-warm-white">{c.label}</p>
                <p className="font-body text-xs text-graphite dark:text-white/50">{c.value}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
