import { Search, X, LayoutList, Table2 } from "lucide-react";
import { CATEGORIES, STATUS_FILTERS } from "../../data/cases";
import { SelectInput } from "../ui/form";

/**
 * Filter sederhana: Search besar + chip Status (dengan jumlah) + dropdown Kategori.
 * filters = { q, status, category, view }
 */
export default function CaseFilterBar({ filters, setFilters, counts }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-3">
      {/* Search besar */}
      <div className="relative">
        <Search size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-2" />
        <input
          id="case-search"
          type="search"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Cari kode mesin, ID kasus, gejala…"
          aria-label="Cari kasus"
          className="h-14 w-full rounded-xl border-2 border-line bg-card pl-12 pr-24 text-[17px] text-ink outline-none placeholder:text-ink-3 focus:border-ink"
        />
        {filters.q && (
          <button
            onClick={() => set({ q: "" })}
            className="tap absolute right-2 top-1/2 flex h-10 -translate-y-1/2 items-center gap-1 rounded-lg border-2 border-line bg-canvas px-2.5 text-[14px] font-semibold text-ink"
          >
            <X size={16} /> Hapus
          </button>
        )}
      </div>

      {/* Filter Status — chip besar dengan jumlah */}
      <div>
        <span className="mb-1.5 block text-[14px] font-semibold text-ink-2">Filter Status</span>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {STATUS_FILTERS.map((s) => {
            const active = filters.status === s.id;
            return (
              <button
                key={s.id}
                id={`status-filter-${s.id}`}
                onClick={() => set({ status: s.id })}
                className={`tap flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 px-3.5 text-[15px] font-semibold transition ${
                  active ? "border-ink bg-ink text-white" : "border-line bg-card text-ink hover:border-ink/50"
                }`}
              >
                {s.label}
                <span
                  className={`grid h-6 min-w-6 place-items-center rounded-md px-1 font-mono text-[13px] font-bold ${
                    active ? "bg-white text-ink" : s.id === "overdue" && counts[s.id] ? "bg-critical-ink text-white" : "bg-canvas text-ink-2"
                  }`}
                >
                  {counts[s.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kategori + Mode Tampilan */}
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <div>
          <label htmlFor="category-filter" className="mb-1.5 block text-[14px] font-semibold text-ink-2">
            Kategori
          </label>
          <SelectInput id="category-filter" value={filters.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </SelectInput>
        </div>
        <div role="group" aria-label="Mode tampilan" className="flex h-12 overflow-hidden rounded-xl border-2 border-line bg-card">
          {[
            { id: "card", label: "Kartu", icon: LayoutList },
            { id: "table", label: "Tabel", icon: Table2 },
          ].map((v) => {
            const Icon = v.icon;
            const active = filters.view === v.id;
            return (
              <button
                key={v.id}
                id={`view-${v.id}`}
                onClick={() => set({ view: v.id })}
                className={`flex items-center gap-1.5 px-3 text-[14px] font-semibold transition ${active ? "bg-ink text-white" : "text-ink-2"}`}
              >
                <Icon size={17} /> {v.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
