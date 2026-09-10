import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-aluminum px-3 py-1 text-xs font-medium font-body text-graphite dark:bg-white/10 dark:text-white/70",
        className
      )}
      {...props}
    />
  );
}
