import { Check, ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Form Kit Week 2 — "Bapak-bapak friendly" (terinspirasi m-BCA)
   • Input/tombol tinggi 48–56 px, font 16 px+
   • Border 2 px yang jelas, fokus = hitam pekat
   • Setiap kontrol WAJIB punya label teks
   ───────────────────────────────────────────────────────────── */

const INPUT =
  "w-full rounded-xl border-2 border-line bg-card text-[16px] text-ink outline-none transition placeholder:text-ink-3 focus:border-ink disabled:bg-canvas disabled:text-ink-3";

/** Label + hint + error untuk satu field */
export function Field({ label, htmlFor, hint, required, error, className = "", children }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-[15px] font-semibold leading-snug text-ink">
          {label}
          {required && <span className="ml-1 text-critical-ink">*</span>}
        </label>
      )}
      {hint && <p className="text-[13.5px] leading-snug text-ink-2">{hint}</p>}
      {children}
      {error && <p className="text-[13.5px] font-semibold text-critical-ink">⚠ {error}</p>}
    </div>
  );
}

export function TextInput({ className = "", ...rest }) {
  return <input className={`${INPUT} h-12 px-3.5 ${className}`} {...rest} />;
}

export function TextArea({ className = "", rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${INPUT} resize-y px-3.5 py-3 leading-relaxed ${className}`} {...rest} />;
}

export function SelectInput({ className = "", children, ...rest }) {
  return (
    <div className="relative">
      <select className={`${INPUT} h-12 appearance-none pl-3.5 pr-10 ${className}`} {...rest}>
        {children}
      </select>
      <ChevronDown size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-2" />
    </div>
  );
}

/** Input angka dengan satuan tegas di kanan (°C, bar, jam, unit) */
export function NumberInput({ unit, className = "", warn = false, ...rest }) {
  return (
    <div className={`flex h-12 overflow-hidden rounded-xl border-2 bg-card transition focus-within:border-ink ${warn ? "border-critical" : "border-line"} ${className}`}>
      <input
        type="text"
        inputMode="decimal"
        className="w-full min-w-0 bg-transparent px-3.5 font-mono text-[16px] text-ink outline-none placeholder:text-ink-3"
        {...rest}
      />
      {unit && (
        <span className="grid shrink-0 place-items-center border-l-2 border-line bg-canvas px-3 font-mono text-[14px] font-semibold text-ink-2">
          {unit}
        </span>
      )}
    </div>
  );
}

/** Input Rupiah: prefix "Rp", pemisah ribuan otomatis saat diketik */
export function CurrencyInput({ value, onChange, className = "", ...rest }) {
  const display = value ? Number(value).toLocaleString("id-ID") : "";
  return (
    <div className={`flex h-12 overflow-hidden rounded-xl border-2 border-line bg-card transition focus-within:border-ink ${className}`}>
      <span className="grid shrink-0 place-items-center border-r-2 border-line bg-canvas px-3 font-mono text-[14px] font-bold text-ink">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        placeholder="0"
        className="w-full min-w-0 bg-transparent px-3.5 font-mono text-[16px] font-semibold text-ink outline-none placeholder:text-ink-3"
        {...rest}
      />
    </div>
  );
}

/**
 * Radio button berbentuk KOTAK BESAR.
 * options: [{ id, label, desc?, icon?, activeCls? }]
 */
export function ChoiceGroup({ name, options, value, onChange, columns = 1, size = "lg" }) {
  const grid = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[columns];
  return (
    <div role="radiogroup" className={`grid gap-2 ${grid}`}>
      {options.map((o) => {
        const active = value === o.id;
        const Icon = o.icon;
        return (
          <label
            key={o.id}
            className={`tap relative flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 transition ${
              size === "lg" ? "min-h-[60px] py-3" : "min-h-12 py-2"
            } ${active ? o.activeCls || "border-ink bg-ink text-white" : "border-line bg-card text-ink hover:border-ink/50"}`}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={active}
              onChange={() => onChange(o.id)}
              className="sr-only"
            />
            {/* Bulatan radio yang terlihat jelas */}
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                active ? "border-current bg-white/20" : "border-ink-3"
              }`}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-current" />}
            </span>
            {Icon && <Icon size={22} strokeWidth={2} className="shrink-0" />}
            <span className="min-w-0">
              <span className="block text-[16px] font-bold leading-tight">{o.label}</span>
              {o.desc && (
                <span className={`mt-0.5 block text-[13px] leading-snug ${active ? "opacity-85" : "text-ink-2"}`}>
                  {o.desc}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** Pertanyaan Ya / Tidak — dua kotak besar */
export function YesNo({ name, value, onChange, yesLabel = "Ya", noLabel = "Tidak", yesTone = "critical" }) {
  const yesCls = yesTone === "critical" ? "border-critical-ink bg-critical-ink text-white" : "border-ink bg-ink text-white";
  return (
    <ChoiceGroup
      name={name}
      value={value}
      onChange={onChange}
      columns={2}
      size="md"
      options={[
        { id: "yes", label: yesLabel, activeCls: yesCls },
        { id: "no", label: noLabel, activeCls: "border-done bg-done text-white" },
      ]}
    />
  );
}

/** Checkbox / toggle besar dengan teks penjelas */
export function BigCheckbox({ id, checked, onChange, label, desc }) {
  return (
    <label
      htmlFor={id}
      className={`tap flex cursor-pointer items-start gap-3.5 rounded-xl border-2 p-4 transition ${
        checked ? "border-hazard-ink bg-hazard/15" : "border-line bg-card hover:border-ink/50"
      }`}
    >
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 transition ${
          checked ? "border-ink bg-ink text-white" : "border-ink-3 bg-card"
        }`}
      >
        {checked && <Check size={18} strokeWidth={3} />}
      </span>
      <span>
        <span className="block text-[16px] font-bold leading-snug text-ink">{label}</span>
        {desc && <span className="mt-1 block text-[13.5px] leading-snug text-ink-2">{desc}</span>}
      </span>
    </label>
  );
}

/** Tombol aksi besar — selalu ikon + teks */
export function Button({ tone = "dark", size = "lg", icon: Icon, iconRight: IconRight, className = "", children, ...rest }) {
  const tones = {
    dark: "bg-ink text-white hover:bg-black",
    ok: "bg-done text-white hover:brightness-110",
    warn: "bg-warn text-white hover:brightness-110",
    danger: "bg-critical-ink text-white hover:brightness-110",
    outline: "border-2 border-ink bg-card text-ink hover:bg-canvas",
    soft: "border-2 border-line bg-card text-ink hover:border-ink",
  };
  const sizes = { md: "h-12 px-4 text-[15px]", lg: "h-14 px-5 text-[16px]" };
  return (
    <button
      type="button"
      className={`tap inline-flex items-center justify-center gap-2 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={20} strokeWidth={2.2} />}
      <span>{children}</span>
      {IconRight && <IconRight size={20} strokeWidth={2.2} />}
    </button>
  );
}

/** Panel berjudul tegas — dipakai untuk setiap bagian form */
export function Panel({ step, title, subtitle, icon: Icon, badge, className = "", children }) {
  return (
    <section className={`overflow-hidden rounded-2xl border-2 border-line bg-card ${className}`}>
      <header className="flex items-start gap-3 border-b-2 border-line bg-canvas/70 px-4 py-3.5">
        {step && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink font-mono text-[15px] font-bold text-white">
            {step}
          </span>
        )}
        {!step && Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-white">
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-bold leading-tight tracking-tight text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{subtitle}</p>}
        </div>
        {badge}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}
