import { useState } from "react";
import { ArrowLeft, Stethoscope, ClipboardCheck, Calculator, AlertTriangle, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { machineByCode, getDisplayStatus } from "../../../data/cases";
import { formatDateTime } from "../../../lib/format";
import { useCaseStore } from "../../../state/caseStore";
import { StatusBadge, SeverityBadge, CategoryBadge } from "../badges";
import DiagnosisTab from "./DiagnosisTab";
import ActionTab from "./ActionTab";
import LossTab from "./LossTab";

const TABS = [
  { id: "A", label: "Tab A: Diagnosis Engineering", shortLabel: "Diagnosis", icon: Stethoscope },
  { id: "B", label: "Tab B: Tindakan & Verifikasi", shortLabel: "Tindakan & Verif", icon: ClipboardCheck },
  { id: "C", label: "Tab C: Operational Loss", shortLabel: "Kalkulator Loss", icon: Calculator },
];

/**
 * Halaman Detail Kasus (Tahap RESOLVE)
 * Navigasi Tab Besar & Tegas sesuai prinsip UI Bapak-bapak Friendly & m-BCA.
 */
export default function CaseDetailPage({ caseId, onBack, initialTab = "A" }) {
  const { cases, updateCase, updateSection } = useCaseStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toast, setToast] = useState(null);

  const c = cases.find((item) => item.id === caseId);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!c) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={48} className="text-critical-ink" />
        <h2 className="mt-3 text-[20px] font-bold text-ink">Kasus Tidak Ditemukan</h2>
        <p className="mt-1 text-[15px] text-ink-2">ID Kasus {caseId} tidak terdaftar di sistem.</p>
        <button
          onClick={onBack}
          className="tap mt-5 flex h-12 items-center gap-2 rounded-xl bg-ink px-5 text-[15px] font-bold text-white"
        >
          <ArrowLeft size={18} /> Kembali ke Daftar Kasus
        </button>
      </div>
    );
  }

  const machine = machineByCode(c.machine);
  const currentStatus = getDisplayStatus(c);

  return (
    <div className="flex flex-col pb-16">
      {/* ── STICKY TOP HEADER ── */}
      <header className="sticky top-0 z-30 border-b-2 border-line bg-canvas/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <button
            id="btn-back-to-cases"
            onClick={onBack}
            className="tap flex h-11 items-center gap-2 rounded-xl border-2 border-line bg-card px-3.5 text-[15px] font-bold text-ink"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Daftar Kasus</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-ink-2">{c.id}</span>
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* ── RINGKASAN IDENTITAS KASUS DI BAWAH NAV ── */}
        <div className="border-t border-line bg-card px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-[22px] font-bold tracking-tight text-ink">
                  {c.machine}
                </h1>
                <CategoryBadge category={c.category} />
                <SeverityBadge severity={c.severity} />
              </div>
              <p className="text-[14px] text-ink-2">{machine?.name}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
              <Clock size={14} />
              <span>{formatDateTime(c.reportedAt)}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[14px] font-medium text-ink">
            <MapPin size={16} className="shrink-0 text-ink-2" />
            <span>Lokasi: {c.location}</span>
          </div>

          <div className="mt-2 rounded-xl border border-line bg-canvas p-2.5">
            <span className="mono-label text-[10px] text-ink-3">GEJALA AWAL LAPORAN:</span>
            <p className="mt-0.5 text-[14.5px] font-medium leading-snug text-ink">
              "{c.symptom}"
            </p>
          </div>
        </div>

        {/* ── TAB NAVIGATOR BESAR (BAPAK-BAPAK FRIENDLY & M-BCA STYLE) ── */}
        <div className="border-t-2 border-line bg-card px-2 py-2">
          <div className="grid grid-cols-3 gap-1.5" role="tablist">
            {TABS.map((t) => {
              const active = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  id={`tab-btn-${t.id}`}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(t.id)}
                  className={`tap flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-1.5 text-center transition ${
                    active
                      ? "border-ink bg-ink text-white font-bold"
                      : "border-line bg-canvas text-ink-2 hover:border-ink/50 hover:text-ink font-semibold"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[12.5px] leading-none sm:text-[14px]">
                    {t.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── ISI TAB AKTIF ── */}
      <main className="flex-1 px-4 pt-5">
        {activeTab === "A" && (
          <DiagnosisTab
            c={c}
            onChange={(patch) => updateSection(c.id, "diagnosis", patch)}
            onUpdateCase={(patch) => updateCase(c.id, patch)}
            onToast={showToast}
            onNext={() => setActiveTab("B")}
          />
        )}

        {activeTab === "B" && (
          <ActionTab
            c={c}
            onChange={(patch) => updateSection(c.id, "action", patch)}
            onUpdateVerification={(patch) => updateSection(c.id, "verification", patch)}
            onUpdateCase={(patch) => updateCase(c.id, patch)}
            onToast={showToast}
          />
        )}

        {activeTab === "C" && (
          <LossTab
            c={c}
            onChange={(patch) => updateSection(c.id, "loss", patch)}
            onToast={showToast}
          />
        )}
      </main>

      {/* ── TOAST NOTIFICATION REAL-TIME ── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl border-2 border-done bg-night p-4 text-white shadow-2xl animate-rise"
        >
          <CheckCircle2 size={24} className="shrink-0 text-done" />
          <span className="text-[15px] font-bold leading-snug">{toast}</span>
        </div>
      )}
    </div>
  );
}
