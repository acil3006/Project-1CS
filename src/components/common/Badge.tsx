import { statusClass, statusLabel } from "../../utils/status";
import type { ReactNode } from "react";

interface BadgeProps {
  children?: ReactNode;
  status?: string;
  tone?: "blue" | "green" | "amber" | "rose" | "slate";
}

const toneMap = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700"
};

export function Badge({ children, status, tone }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        status ? statusClass(status) : toneMap[tone ?? "slate"]
      }`}
    >
      {children ?? (status ? statusLabel(status) : null)}
    </span>
  );
}
