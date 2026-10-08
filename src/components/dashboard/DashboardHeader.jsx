import { useState } from "react";
import { Factory, ChevronDown, Bell, Check } from "lucide-react";
import { PLANTS, FILTERS } from "../../data/mock";
import { Logo, Tag } from "../ui/primitives";

export default function DashboardHeader({ plant, setPlant, filter, setFilter, onLogo }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-md">
      {/* Bar Atas */}
      <div className="flex h-14 items-center justify-between px-4">
        <button onClick={onLogo} className="tap text-left">
          <Logo />
        </button>
        <div className="flex items-center gap-2">
          <Tag tone="ok" dot>
            Shift B • ME Senior Siaga
          </Tag>
          <button
            id="dash-notifications"
            aria-label="Notifikasi"
            className="tap grid h-9 w-9 place-items-center rounded-lg border border-line bg-card text-ink"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>

      {/* Pilihan Pabrik & Lini */}
      <div className="border-t border-line px-4 py-2.5">
        <div className="relative">
          <button
            id="plant-selector"
            onClick={() => setOpen(!open)}
            className="tap flex min-h-10 w-full items-center justify-between rounded-lg border border-line bg-card px-3 text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Factory size={15} className="shrink-0 text-ink-3" />
              <span className="truncate text-[13px] font-medium text-ink">{plant}</span>
            </div>
            <ChevronDown size={15} className={`text-ink-3 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <ul className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-line bg-card shadow-xl animate-rise">
              {PLANTS.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => {
                      setPlant(p);
                      setOpen(false);
                    }}
                    className="flex min-h-10 w-full items-center justify-between px-3 text-left text-[12.5px] hover:bg-canvas"
                  >
                    <span className={p === plant ? "font-semibold text-ink" : "text-ink-2"}>{p}</span>
                    {p === plant && <Check size={14} className="text-ink" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tab Filter Masalah */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-line px-4 py-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              id={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`tap mono-label h-8 shrink-0 rounded-md px-3 text-[11px] transition ${
                active
                  ? "bg-ink text-white font-medium"
                  : "border border-line bg-card text-ink-2 hover:text-ink"
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
