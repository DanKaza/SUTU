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
        className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
      >
        Contact
      </motion.h1>
      <p className="mt-3 max-w-xl font-body text-muted">
        Questions, feedback, or an idea for working together? Send a message and we will get back to
        you as soon as we can.
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
                <h3 className="font-display text-lg font-bold text-ink">Message sent</h3>
                <p className="font-body text-sm text-muted">
                  Thank you. We will reply to your email shortly.
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
                    <label className="font-body text-sm font-medium text-ink">Name</label>
                    <Input required placeholder="Your name" className="mt-2" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-ink">Email</label>
                    <Input required type="email" placeholder="you@example.com" className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-ink">Message</label>
                  <Textarea required rows={5} placeholder="Tell us what you need..." className="mt-2" />
                </div>
                <Button type="submit" size="lg" className="w-fit">
                  Send message
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        <Card className="flex flex-col gap-4 bg-white/[0.04] p-6 bg-white/5">
          <h3 className="font-display text-lg font-bold text-ink">Other channels</h3>
          {CHANNELS.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
                <c.icon className="h-4 w-4 text-muted text-white/70" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-ink">{c.label}</p>
                <p className="font-body text-xs text-muted">{c.value}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
