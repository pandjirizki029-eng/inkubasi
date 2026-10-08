import { ArrowRight } from "lucide-react";

/* Shared primitives — kept deliberately few and quiet. */

const TONES = {
  critical: "text-critical-ink bg-critical/10",
  hazard: "text-hazard-ink bg-hazard/15",
  ok: "text-ok-ink bg-ok/10",
  ai: "text-ai-ink bg-ai/10",
  neutral: "text-ink-2 bg-black/5",
};

/** Small mono status tag */
export function Tag({ tone = "neutral", dot = false, className = "", children }) {
  return (
    <span className={`mono-label inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] ${TONES[tone]} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />}
      {children}
    </span>
  );
}

export function Card({ className = "", children, ...rest }) {
  return (
    <div className={`rounded-xl bg-card ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** [ S.01 ] [ LABEL ] — section index + label pair */
export function SectionTag({ n, children, dark = false }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
      <span className={`mono-label rounded-md border px-2 py-1 text-[10px] ${dark ? "border-white/25 text-white/70" : "border-ink/25 text-ink-2"}`}>
        [ S.{n} ]
      </span>
      <span className={`mono-label rounded-md px-2 py-1 text-[10px] ${dark ? "bg-white text-night font-medium" : "bg-ink text-white font-medium"}`}>
        [ {children} ]
      </span>
    </div>
  );
}

/** Pill button with inset arrow box (tone: dark | light | amber | ghost) */
export function PillButton({ tone = "dark", icon: Icon = ArrowRight, className = "", children, ...rest }) {
  const styles = {
    dark: ["bg-ink text-white", "bg-white text-ink"],
    amber: ["bg-hazard text-night", "bg-night text-white"],
    light: ["bg-white text-ink", "bg-ink text-white"],
    ghost: ["border border-white/30 text-white", "bg-white/10 text-white"],
  }[tone];
  return (
    <button
      className={`tap mono-label flex h-[52px] w-full items-center justify-between rounded-xl pl-5 pr-1.5 text-[12px] font-medium ${styles[0]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${styles[1]}`}>
        <Icon size={16} />
      </span>
    </button>
  );
}

/** ≥ 44 px circular icon button */
export function RoundButton({ icon: Icon, label, dark = false, className = "", ...rest }) {
  return (
    <button
      aria-label={label}
      className={`tap grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
        dark ? "border-white/30 text-white" : "border-ink/20 text-ink"
      } ${className}`}
      {...rest}
    >
      <Icon size={18} strokeWidth={1.5} />
    </button>
  );
}

/** Logo: outlined box + wordmark */
export function Logo({ dark = false }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1.5 ${dark ? "border-white/30 text-white" : "border-ink/25 text-ink"}`}>
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.8 4.5 6v5.5c0 4.4 3.1 7.6 7.5 8.7 4.4-1.1 7.5-4.3 7.5-8.7V6L12 2.8Z" />
        <path d="M8.2 12h2.2l1.1-2.6 2 5.2 1.1-2.6h1.2" />
      </svg>
      <span className="font-display text-[14px] font-semibold uppercase tracking-[0.04em]">SafetyLog</span>
    </div>
  );
}
