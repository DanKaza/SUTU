import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium font-body transition-all duration-200 ease-quintic-out active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // App ini dark-only, jadi filled berarti violet (aksen utama), bukan
      // surface gelap. `text-ink` = foreground terang, bukan "ink" gelap.
      // #7C3AED dipilih karena teks terang di atasnya = 5.27:1 (AA body);
      // violet-500 #8B5CF6 hanya 3.91:1 dan gagal.
      variant: {
        primary: "bg-[#7C3AED] text-ink hover:bg-[#6D28D9] hover:shadow-glow-violet",
        subtle: "bg-white/10 text-ink hover:bg-white/15",
        outline: "border border-white/20 text-ink hover:border-violet-400 hover:bg-white/5",
        ghost: "text-ink hover:bg-white/10",
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
