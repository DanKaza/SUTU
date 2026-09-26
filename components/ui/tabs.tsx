"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { orientationTransition } from "@/lib/motion";

export function Tabs({
  options,
  value,
  onChange,
  layoutId,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  layoutId?: string;
}) {
  const autoId = useId();
  const activeLayoutId = layoutId || autoId;

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
              active ? "text-ink-950 font-semibold" : "text-muted hover:text-white"
            )}
          >
            {active && (
              <motion.span
                layoutId={activeLayoutId}
                transition={orientationTransition}
                className="absolute inset-0 rounded-full bg-white shadow-sm"
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
