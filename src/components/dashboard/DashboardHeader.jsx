import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { PLANTS, FILTERS } from "../../data/mock";
import { Logo } from "../ui/primitives";

export default function DashboardHeader({ plant, setPlant, filter, setFilter, onLogo }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-md">
      {/* Bar Navigasi Atas — Classic Minimalist */}
      <div className="flex h-14 items-center justify-between px-4">
        <button onClick={onLogo} className="tap text-left">
          <Logo />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-dot" />
            <span className="mono-label text-[9.5px] text-ink-2">Shift B • ME Siaga</span>
          </div>
        </div>
      </div>

      {/* Pilihan Pabrik & Lini — Subtle Hairline Bar */}
      <div className="border-t border-line px-4 py-2">
        <div className="relative">
          <button
            id="plant-selector"
            onClick={() => setOpen(!open)}
            className="tap flex min-h-9 w-full items-center justify-between rounded-md px-1 text-left hover:bg-black/5"
          >
            <div className="flex items-baseline gap-2 truncate">
              <span className="mono-label text-[9.5px] text-ink-3">LOKASI:</span>
              <span className="truncate text-[12.5px] font-medium tracking-tight text-ink">{plant}</span>
            </div>
            <ChevronDown size={14} className={`text-ink-3 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <ul className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-line bg-card shadow-lg animate-rise">
              {PLANTS.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => {
                      setPlant(p);
                      setOpen(false);
                    }}
                    className="flex min-h-10 w-full items-center justify-between px-3 text-left text-[12px] hover:bg-canvas"
                  >
                    <span className={p === plant ? "font-semibold text-ink" : "text-ink-2"}>{p}</span>
                    {p === plant && <Check size={13} className="text-ink" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Filter Masalah — Classic Underline / Pill Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line px-4 py-1.5">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              id={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`tap mono-label h-7 shrink-0 rounded px-2.5 text-[10px] transition ${
                active
                  ? "bg-ink text-white font-medium"
                  : "text-ink-2 hover:text-ink hover:bg-black/5"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
