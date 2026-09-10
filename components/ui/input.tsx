import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-full border border-graphite/25 bg-warm-white px-4 text-sm font-body text-charcoal placeholder:text-graphite/70 outline-none transition-colors duration-200 ease-quintic-out focus:border-cobalt dark:border-white/15 dark:bg-white/5 dark:text-warm-white dark:placeholder:text-white/40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
