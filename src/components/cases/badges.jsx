import { ShieldAlert, Cog, Factory } from "lucide-react";
import { STATUSES, categoryById, severityById, getDisplayStatus } from "../../data/cases";

/* Badge "lampu indikator" — bisa dipahami sekilas dari jauh */

export function StatusBadge({ c, status, size = "md" }) {
  const key = status || getDisplayStatus(c);
  const s = STATUSES[key];
  const sz = size === "lg" ? "h-9 px-3.5 text-[14px]" : "h-8 px-3 text-[13px]";
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-lg font-bold ${sz} ${s.cls}`}>
      <span className={`h-2.5 w-2.5 rounded-full bg-current ${key === "overdue" || key === "open" ? "animate-pulse-dot" : ""}`} />
      {s.label}
    </span>
  );
}

export const SEVERITY_STYLE = {
  low: { badge: "border-ok-ink/40 bg-ok/10 text-ok-ink", bar: "bg-ok" },
  medium: { badge: "border-hazard-ink/40 bg-hazard/15 text-hazard-ink", bar: "bg-hazard" },
  high: { badge: "border-warn-ink/50 bg-warn/15 text-warn-ink", bar: "bg-warn" },
  critical: { badge: "border-critical-ink bg-critical-ink text-white", bar: "bg-critical-ink" },
};

export function SeverityBadge({ severity }) {
  const s = severityById(severity);
  if (!s) return null;
  return (
    <span className={`inline-flex h-7 shrink-0 items-center rounded-md border-2 px-2 text-[12.5px] font-bold uppercase tracking-wide ${SEVERITY_STYLE[severity].badge}`}>
      {s.label}
    </span>
  );
}

export const CATEGORY_ICON = { safety: ShieldAlert, machine: Cog, ops: Factory };

export function CategoryBadge({ category }) {
  const c = categoryById(category);
  if (!c) return null;
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border-2 border-line bg-canvas px-2 text-[12.5px] font-semibold text-ink">
      <Icon size={14} strokeWidth={2.2} />
      {c.label}
    </span>
  );
}
