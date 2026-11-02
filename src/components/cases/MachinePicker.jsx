import { useState } from "react";
import { Search, CheckCircle2, X } from "lucide-react";
import { MACHINES } from "../../data/cases";

/**
 * Autocomplete mesin — ketik kode / nama, pilih dari daftar besar.
 * Memilih mesin otomatis mengisi lokasi (via onSelect).
 */
export default function MachinePicker({ id, value, onSelect, error }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const selected = MACHINES.find((m) => m.code === value);

  const q = query.trim().toLowerCase();
  const matches = MACHINES.filter(
    (m) => !q || m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q)
  );

  const choose = (m) => {
    onSelect(m);
    setQuery(m.code);
    setOpen(false);
  };

  if (selected && !open) {
    return (
      <div className="flex items-center gap-3 rounded-xl border-2 border-done bg-done/10 p-3">
        <CheckCircle2 size={24} className="shrink-0 text-done" />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[19px] font-bold leading-tight text-ink">{selected.code}</div>
          <div className="truncate text-[14px] text-ink-2">{selected.name}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setOpen(true);
          }}
          className="tap h-11 shrink-0 rounded-lg border-2 border-ink bg-card px-3 text-[14px] font-bold text-ink"
        >
          Ganti
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`flex h-12 items-center overflow-hidden rounded-xl border-2 bg-card focus-within:border-ink ${error ? "border-critical" : "border-line"}`}>
        <Search size={20} className="ml-3.5 shrink-0 text-ink-2" />
        <input
          id={id}
          value={query}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Ketik kode mesin, misal: CNC-04"
          className="h-full w-full bg-transparent px-3 font-mono text-[16px] uppercase text-ink outline-none placeholder:normal-case placeholder:font-sans placeholder:text-ink-3"
        />
        {query && (
          <button type="button" aria-label="Kosongkan" onClick={() => setQuery("")} className="mr-2 grid h-9 w-9 place-items-center text-ink-2">
            <X size={18} />
          </button>
        )}
      </div>

      {open && (
        <ul className="mt-1.5 max-h-64 overflow-y-auto rounded-xl border-2 border-ink bg-card shadow-xl">
          {matches.length === 0 && <li className="p-4 text-[15px] text-ink-2">Mesin tidak ditemukan. Periksa kode di plat mesin.</li>}
          {matches.map((m) => (
            <li key={m.code} className="border-b border-line last:border-0">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(m)}
                className="flex min-h-14 w-full items-center gap-3 px-3.5 py-2 text-left hover:bg-canvas"
              >
                <span className="w-[76px] shrink-0 font-mono text-[16px] font-bold text-ink">{m.code}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium text-ink">{m.name}</span>
                  <span className="block truncate text-[13px] text-ink-2">{m.location}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
