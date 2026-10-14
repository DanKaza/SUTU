import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page shell. GlobalNav and this share one width and one padding, so every
 * route's content starts on the same vertical edge as the header — the only
 * thing that varies is the reading measure nested inside it.
 */
const SHELL = "mx-auto w-full max-w-[1200px] px-6 sm:px-12";

type ContainerProps = {
  className?: string;
  children: ReactNode;
};

type ContainerNarrowProps = ContainerProps & {
  /** Tailwind max-w-* class. */
  width?: string;
};

export function Container({ className, children }: ContainerProps) {
  return <div className={cn(SHELL, className)}>{children}</div>;
}

export function ContainerNarrow({ className, children, width = "max-w-3xl" }: ContainerNarrowProps) {
  return <div className={cn("mx-auto w-full", width, className)}>{children}</div>;
}