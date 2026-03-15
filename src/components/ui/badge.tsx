import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/15 text-primary border border-primary/10",
  secondary: "bg-white/[0.06] text-secondary-foreground border border-white/[0.04]",
  outline: "border border-white/[0.08] text-foreground/80",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/10",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
