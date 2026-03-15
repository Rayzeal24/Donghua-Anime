"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: [
    "bg-gradient-to-r from-primary via-violet-500 to-primary bg-[length:200%_100%] text-white",
    "hover:bg-[position:100%_0] hover:shadow-[0_0_30px_rgba(139,92,246,0.35),0_8px_20px_rgba(139,92,246,0.2)]",
    "hover:-translate-y-0.5",
    "active:translate-y-0 active:scale-[0.97] active:shadow-[0_0_15px_rgba(139,92,246,0.2)]",
    "shadow-lg shadow-primary/15",
  ].join(" "),
  secondary: [
    "bg-secondary text-secondary-foreground",
    "hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
    "active:translate-y-0 active:scale-[0.97]",
  ].join(" "),
  ghost: [
    "text-foreground",
    "hover:bg-white/[0.06] hover:text-white",
    "active:bg-white/[0.08] active:scale-[0.97]",
  ].join(" "),
  destructive: [
    "bg-gradient-to-r from-destructive via-red-500 to-destructive bg-[length:200%_100%] text-white",
    "hover:bg-[position:100%_0] hover:shadow-[0_0_25px_rgba(239,68,68,0.3),0_8px_20px_rgba(239,68,68,0.15)]",
    "hover:-translate-y-0.5",
    "active:translate-y-0 active:scale-[0.97]",
    "shadow-lg shadow-destructive/15",
  ].join(" "),
  outline: [
    "border border-white/[0.1] bg-white/[0.02] text-foreground",
    "hover:border-primary/30 hover:bg-primary/[0.06] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]",
    "active:translate-y-0 active:scale-[0.97] active:bg-primary/[0.1]",
  ].join(" "),
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-sm gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base font-semibold gap-2.5",
  icon: "h-10 w-10",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
