import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ClipboardList, PlusCircle } from "lucide-react";
import { PLANTS } from "../../data/mock";
import DashboardHeader from "./DashboardHeader";
import LossSummary from "./LossSummary";
import ReportIssue from "./ReportIssue";
import AICopilot from "./AICopilot";
import ActionFeed from "./ActionFeed";
import BottomNav from "./BottomNav";

export default function Dashboard({ onBack, onOpenCases, onOpenCase, onOpenReport }) {
  const [plant, setPlant] = useState(PLANTS[0]);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const refs = {
    dashboard: useRef(null),
    issues: useRef(null),
    actions: useRef(null),
    knowledge: useRef(null),
    loss: useRef(null),
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleTabChange = (id) => {
    setTab(id);
    if (id === "issues" && onOpenCases) {
      onOpenCases();
      return;
    }
    if (id === "actions" && onOpenCase) {
      onOpenCase("SL-0412", "B");
      return;
    }
    if (id === "loss" && onOpenCase) {
      onOpenCase("SL-0412", "C");
      return;
    }
    refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink selection:bg-hazard selection:text-night">
      <div ref={refs.dashboard} />
      <DashboardHeader
        plant={plant}
        setPlant={setPlant}
        filter={filter}
        setFilter={setFilter}
        onLogo={onBack}
        onOpenCases={onOpenCases}
      />

      <main className="flex-1 space-y-5 px-4 pb-12 pt-3">
        {/* BANNER SHORTCUT WEEK 2: CAPTURE & RESOLVE */}
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-night p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[10px] text-hazard font-bold">
              MODUL WEEK 2 AKTIF
            </span>
            <span className="mono-label rounded bg-white/20 px-1.5 py-0.5 text-[9px] text-white">
              CAPTURE & RESOLVE
            </span>
          </div>
          <h2 className="mt-1 font-display text-[17px] font-bold leading-tight">
            Digital Issue & Engineering Resolve
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-white/80">
            Form bapak-bapak friendly, analisis kerusakan CNC-04, mitigasi K3, dan kalkulator rugi.
          </p>
          <div className="mt-3.5 flex gap-2">
            <button
              id="dash-cta-cases"
              onClick={onOpenCases}
              className="tap flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-hazard py-2.5 text-[13px] font-bold text-night"
            >
              <ClipboardList size={16} /> Daftar Kasus
            </button>
            <button
              id="dash-cta-new-report"
              onClick={onOpenReport}
              className="tap flex items-center justify-center gap-1 rounded-xl border border-white/40 bg-white/10 px-3 py-2.5 text-[13px] font-bold text-white hover:bg-white/20"
            >
              <PlusCircle size={16} /> Lapor Cepat
            </button>
          </div>
        </div>

        {/* Module 2: Dashboard & Operational Loss */}
        <div ref={refs.loss} className="scroll-mt-40">
          <LossSummary
            onOpenLoss={() => {
              if (onOpenCase) onOpenCase("SL-0412", "C");
              else handleTabChange("loss");
            }}
          />
        </div>

        {/* Module 3: Digital Issue Reporting */}
        <div ref={refs.issues} className="scroll-mt-40">
          <ReportIssue onSubmitted={setToast} />
        </div>

        {/* Module 4: Basic AI & Knowledge Base */}
        <div ref={refs.knowledge} className="scroll-mt-40">
          <AICopilot />
        </div>

        {/* Module 5: Corrective Action Feed */}
        <div ref={refs.actions} className="scroll-mt-40">
          <ActionFeed
            filter={filter}
            onToast={setToast}
            onOpenCase={onOpenCase}
          />
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-line bg-card p-3 shadow-xl backdrop-blur-md animate-rise"
        >
          <CheckCircle2 size={16} className="text-ok-ink shrink-0" />
          <span className="text-[12.5px] font-medium text-ink">{toast}</span>
        </div>
      )}

      {/* Docked Bottom Navigation */}
      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
}
