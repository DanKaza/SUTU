import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card border border-graphite/15 bg-warm-white transition-colors duration-300 ease-quintic-out dark:border-white/10 dark:bg-charcoal",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
