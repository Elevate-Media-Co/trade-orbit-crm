import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: string;
  tone?: "default" | "accent" | "success" | "danger" | "warning";
  className?: string;
}

const toneMap = {
  default: "text-[var(--foreground)]",
  accent: "text-[var(--navy)]",
  success: "text-emerald-700",
  danger: "text-red-700",
  warning: "text-amber-700",
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "default",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
          {label}
        </p>
        {Icon ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface-muted)] text-[var(--muted-foreground)]">
            <Icon className="h-3.5 w-3.5" />
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className={cn("text-2xl font-semibold tracking-tight tabular-nums", toneMap[tone])}>
          {value}
        </p>
        {trend ? (
          <span className="pb-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
            {trend}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{hint}</p> : null}
    </div>
  );
}
