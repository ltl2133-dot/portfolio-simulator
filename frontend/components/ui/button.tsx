import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "ghost" | "outline" | "secondary" | "accent";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
};

const variantStyles: Record<Variant, string> = {
  default:
    "bg-emerald-500/90 text-emerald-50 hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-slate-500",
  outline:
    "border border-white/10 bg-transparent text-white hover:bg-white/5",
  secondary:
    "bg-slate-800/80 text-slate-100 hover:bg-slate-700",
  accent:
    "bg-sky-500/90 text-white hover:bg-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400",
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
          "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
