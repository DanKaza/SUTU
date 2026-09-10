import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium font-body transition-all duration-200 ease-quintic-out active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-charcoal text-warm-white hover:bg-charcoal/90 dark:bg-warm-white dark:text-charcoal dark:hover:bg-warm-white/90",
        accent: "bg-cobalt text-warm-white hover:bg-cobalt/90",
        subtle: "bg-aluminum text-charcoal hover:bg-aluminum/70 dark:bg-white/10 dark:text-warm-white dark:hover:bg-white/15",
        outline: "border border-graphite/30 text-charcoal hover:border-cobalt dark:border-white/20 dark:text-warm-white",
        ghost: "text-charcoal hover:bg-aluminum dark:text-warm-white dark:hover:bg-white/10",
      },
      size: {
        sm: "h-8 px-3.5",
        md: "h-10 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
