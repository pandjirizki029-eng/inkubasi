import { useEffect, useState } from "react";
import CaseProvider from "./state/CaseProvider";
import LandingPage from "./components/landing/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import CasesPage from "./components/cases/CasesPage";
import CaseDetailPage from "./components/cases/detail/CaseDetailPage";
import QuickReportForm from "./components/cases/QuickReportForm";
import { Logo } from "./components/ui/primitives";
import { Plus, LayoutDashboard, ClipboardList, Stethoscope } from "lucide-react";

function useIsDesktop() {
  const q = "(min-width: 1024px)";
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = (e) => setM(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return m;
}

function PhoneFrame({ children, label, extraBadge }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="hidden items-center gap-2 lg:flex">
        {label && <span className="mono-label text-ink-2 font-bold">{label}</span>}
        {extraBadge}
      </div>
      <div className="relative h-dvh w-full overflow-hidden bg-canvas lg:h-[850px] lg:w-[393px] lg:rounded-[44px] lg:border-[8px] lg:border-[#111111] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]">
        <div className="no-scrollbar h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const isDesktop = useIsDesktop();

  // Screen state
  const [screen, setScreen] = useState("dashboard"); // "landing" | "dashboard" | "cases" | "case-detail"
  const [selectedCaseId, setSelectedCaseId] = useState("SL-0412");
  const [detailTab, setDetailTab] = useState("A");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Filters untuk CasesPage
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    category: "all",
    view: "card",
  });

  const handleOpenCase = (id, tab = "A") => {
    setSelectedCaseId(id);
    setDetailTab(tab);
    setScreen("case-detail");
  };

  const handleOpenCases = () => {
    setScreen("cases");
  };

  const handleSubmittedReport = (newId) => {
    setReportModalOpen(false);
    // Langsung arahkan ke detail kasus baru agar bisa langsung diisi diagnosisnya
    setSelectedCaseId(newId);
    setDetailTab("A");
    setScreen("case-detail");
  };

  // Render view tertentu
  const renderScreenView = (viewKey) => {
    switch (viewKey) {
      case "landing":
        return <LandingPage onOpenDashboard={() => setScreen("dashboard")} />;
      case "cases":
        return (
          <CasesPage
            filters={filters}
            setFilters={setFilters}
            onOpenCase={handleOpenCase}
            onOpenReport={() => setReportModalOpen(true)}
            onBackToDashboard={() => setScreen("dashboard")}
          />
        );
      case "case-detail":
        return (
          <CaseDetailPage
            caseId={selectedCaseId}
            initialTab={detailTab}
            onBack={() => setScreen("cases")}
          />
        );
      case "dashboard":
      default:
        return (
          <Dashboard
            onBack={() => setScreen("landing")}
            onOpenCases={handleOpenCases}
            onOpenCase={handleOpenCase}
            onOpenReport={() => setReportModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#e4e4e0] text-ink antialiased">
      {/* ── HEADER DESKTOP TERPADU ── */}
      <header className="hidden items-center justify-between border-b border-[#d0d0cc] bg-[#f0f0ed] px-8 py-3.5 lg:flex">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="h-5 w-px bg-line" />
          <span className="mono-label text-[11px] font-bold text-ink-2">
            SafetyLog B2B SaaS • Week 2 (Capture & Resolve)
          </span>
        </div>

        {/* Desktop Quick Nav Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border-2 border-line bg-card p-1">
            <button
              onClick={() => setScreen("dashboard")}
              className={`tap flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold transition ${
                screen === "dashboard" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard W1</span>
            </button>
            <button
              onClick={() => setScreen("cases")}
              className={`tap flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold transition ${
                screen === "cases" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              <ClipboardList size={16} />
              <span>Daftar Kasus W2</span>
            </button>
            <button
              onClick={() => handleOpenCase("SL-0412", "A")}
              className={`tap flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold transition ${
                screen === "case-detail" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              <Stethoscope size={16} />
              <span>Detail Kasus (CNC-04)</span>
            </button>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="tap flex h-10 items-center gap-2 rounded-xl bg-hazard px-4 text-[13px] font-bold text-night shadow-sm hover:brightness-105"
          >
            <Plus size={16} strokeWidth={2.6} />
            <span>+ Buat Laporan Baru</span>
          </button>
        </div>
      </header>

      {/* ── WORKSPACE PREVIEW ── */}
      {isDesktop ? (
        <div className="flex justify-center gap-10 px-6 py-6">
          {/* Frame 1: Layar Pembanding (Bisa Landing atau Dashboard) */}
          <PhoneFrame
            label="Layar 1: Dashboard Operasional (W1)"
            extraBadge={
              <button
                onClick={() => setScreen("landing")}
                className="mono-label rounded-md border border-line bg-card px-2 py-0.5 text-[10px] text-ink-2 hover:border-ink hover:text-ink"
              >
                Ke Landing Page
              </button>
            }
          >
            <Dashboard
              onBack={() => setScreen("landing")}
              onOpenCases={() => setScreen("cases")}
              onOpenCase={handleOpenCase}
              onOpenReport={() => setReportModalOpen(true)}
            />
          </PhoneFrame>

          {/* Frame 2: Layar Interaktif Utama Week 2 (Capture / Resolve) */}
          <PhoneFrame
            label="Layar 2: Modul Week 2"
            extraBadge={
              <div className="flex rounded-lg border border-line bg-card p-0.5 font-sans">
                <button
                  id="tab-switch-cases"
                  onClick={() => setScreen("cases")}
                  className={`tap rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                    screen === "cases" || screen === "dashboard"
                      ? "bg-ink text-white"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  Daftar Kasus (Capture)
                </button>
                <button
                  id="tab-switch-detail"
                  onClick={() => handleOpenCase("SL-0412", "A")}
                  className={`tap rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                    screen === "case-detail"
                      ? "bg-ink text-white"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  Detail CNC-04 (Resolve)
                </button>
              </div>
            }
          >
            {renderScreenView(screen === "dashboard" ? "cases" : screen)}
          </PhoneFrame>
        </div>
      ) : (
        /* Mobile Viewport */
        <div className="h-full w-full">
          {renderScreenView(screen)}
        </div>
      )}

      {/* ── MODAL CEPAT BUAT LAPORAN BARU ── */}
      {reportModalOpen && (
        <QuickReportForm
          onClose={() => setReportModalOpen(false)}
          onSubmitted={handleSubmittedReport}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CaseProvider>
      <AppContent />
    </CaseProvider>
  );
}
