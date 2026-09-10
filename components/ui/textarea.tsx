import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-graphite/25 bg-warm-white px-4 py-3 text-sm font-body text-charcoal placeholder:text-graphite/70 outline-none transition-colors duration-200 ease-quintic-out focus:border-cobalt dark:border-white/15 dark:bg-white/5 dark:text-warm-white dark:placeholder:text-white/40",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
