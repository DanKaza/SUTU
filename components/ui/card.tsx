import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-card transition-colors duration-300 ease-quintic-out",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
