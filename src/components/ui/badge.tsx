import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--navy)] text-white",
        secondary: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]",
        outline: "border-[var(--border)] text-[var(--foreground)]",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        danger: "border-red-200 bg-red-50 text-red-800",
        accent: "border-amber-200/80 bg-[var(--accent-soft)] text-[var(--navy)]",
        info: "border-sky-200 bg-sky-50 text-sky-800",
        muted: "border-transparent bg-[var(--surface-muted)] text-[var(--muted-foreground)]",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
