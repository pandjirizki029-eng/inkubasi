import { useMemo } from "react";
import { Plus, Inbox, ArrowLeft } from "lucide-react";
import { getDisplayStatus, machineByCode, STATUS_FILTERS } from "../../data/cases";
import { useCaseStore } from "../../state/caseStore";
import { Logo } from "../ui/primitives";
import CaseFilterBar from "./CaseFilterBar";
import CaseCard from "./CaseCard";
import CaseTable from "./CaseTable";

/** Halaman Daftar Kasus & Pelaporan Cepat — tahap CAPTURE */
export default function CasesPage({ filters, setFilters, onOpenCase, onOpenReport, onBackToDashboard }) {
  const { cases } = useCaseStore();

  // Jumlah per status (setelah filter kategori & search) agar angka di chip jujur
  const { list, counts } = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const base = cases.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category) return false;
      if (!q) return true;
      const hay = `${c.id} ${c.machine} ${machineByCode(c.machine)?.name ?? ""} ${c.location} ${c.symptom}`.toLowerCase();
      return hay.includes(q);
    });
    const counts = Object.fromEntries(STATUS_FILTERS.map((s) => [s.id, 0]));
    base.forEach((c) => {
      counts.all++;
      counts[getDisplayStatus(c)]++;
    });
    const list = filters.status === "all" ? base : base.filter((c) => getDisplayStatus(c) === filters.status);
    return { list, counts };
  }, [cases, filters]);

  const resetFilters = () => setFilters((f) => ({ ...f, q: "", status: "all", category: "all" }));

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-line bg-canvas/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          <button
            onClick={onBackToDashboard}
            className="tap flex h-11 items-center gap-1.5 rounded-xl border-2 border-line bg-card px-3 text-[14px] font-semibold text-ink"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          <Logo />
        </div>
      </header>

      <main className="flex-1 space-y-5 px-4 pb-10 pt-5">
        {/* Judul halaman */}
        <div>
          <span className="font-mono text-[12px] font-semibold uppercase tracking-widest text-ink-2">Tahap 1 • Capture</span>
          <h1 className="headline mt-1 text-[30px] text-ink">Laporan & Kasus</h1>
          <p className="mt-1 text-[15px] leading-snug text-ink-2">
            Semua laporan masalah K3, mesin, dan operasional di pabrik.
          </p>
        </div>

        {/* CTA lapor — paling menonjol */}
        <button
          id="btn-new-report"
          onClick={onOpenReport}
          className="tap flex w-full items-center gap-4 rounded-2xl bg-ink p-4 text-left text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-hazard text-night">
            <Plus size={30} strokeWidth={2.6} />
          </span>
          <span>
            <span className="block text-[19px] font-bold leading-tight">Buat Laporan Baru</span>
            <span className="mt-0.5 block text-[14px] text-white/75">Cepat, kurang dari 1 menit</span>
          </span>
        </button>

        {/* Ringkasan status cepat */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "open", label: "Open", cls: "border-info bg-info/10 text-info-ink" },
            { id: "overdue", label: "Overdue", cls: "border-critical-ink bg-critical/10 text-critical-ink" },
            { id: "waiting_verification", label: "Tunggu Verif.", cls: "border-warn bg-warn/10 text-warn-ink" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilters((f) => ({ ...f, status: s.id }))}
              className={`tap rounded-xl border-2 p-3 text-left ${s.cls}`}
            >
              <span className="block font-mono text-[28px] font-bold leading-none">{counts[s.id]}</span>
              <span className="mt-1 block text-[13px] font-bold">{s.label}</span>
            </button>
          ))}
        </div>

        <CaseFilterBar filters={filters} setFilters={setFilters} counts={counts} />

        {/* Hasil */}
        <div className="flex items-center justify-between border-t-2 border-line pt-4">
          <span className="text-[16px] font-bold text-ink">{list.length} kasus ditemukan</span>
          {(filters.q || filters.status !== "all" || filters.category !== "all") && (
            <button onClick={resetFilters} className="tap h-10 rounded-lg px-2 text-[14px] font-semibold text-info-ink underline underline-offset-4">
              Reset Filter
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-line bg-card p-8 text-center">
            <Inbox size={40} className="mx-auto text-ink-3" />
            <p className="mt-3 text-[17px] font-bold text-ink">Tidak ada kasus yang cocok</p>
            <p className="mt-1 text-[14px] text-ink-2">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : filters.view === "table" ? (
          <CaseTable cases={list} onOpen={onOpenCase} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((c) => (
              <CaseCard key={c.id} c={c} onOpen={onOpenCase} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
