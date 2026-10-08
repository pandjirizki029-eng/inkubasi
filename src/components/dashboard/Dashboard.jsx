import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PLANTS } from "../../data/mock";
import DashboardHeader from "./DashboardHeader";
import LossSummary from "./LossSummary";
import ReportIssue from "./ReportIssue";
import AICopilot from "./AICopilot";
import ActionFeed from "./ActionFeed";
import BottomNav from "./BottomNav";

export default function Dashboard({ onBack }) {
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
      />

      <main className="flex-1 space-y-6 px-4 pb-12 pt-4">
        {/* Module 2: Dashboard & Operational Loss */}
        <div ref={refs.loss} className="scroll-mt-40">
          <LossSummary onOpenLoss={() => handleTabChange("loss")} />
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
          <ActionFeed filter={filter} onToast={setToast} />
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
