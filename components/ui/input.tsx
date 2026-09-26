import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-full border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-body text-ink placeholder:text-muted/70 outline-none transition-colors duration-200 ease-quintic-out focus:border-violet-400",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
