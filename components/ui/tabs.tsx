"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { orientationTransition } from "@/lib/motion";

export function Tabs({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium font-body transition-colors duration-200 ease-quintic-out",
              active ? "text-warm-white dark:text-charcoal" : "text-graphite hover:text-charcoal dark:text-white/60 dark:hover:text-warm-white"
            )}
          >
            {active && (
              <motion.span
                layoutId="tabs-active-pill"
                transition={orientationTransition}
                className="absolute inset-0 rounded-full bg-charcoal dark:bg-warm-white"
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
