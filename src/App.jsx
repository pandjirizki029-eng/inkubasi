import { useEffect, useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import { Logo } from "./components/ui/primitives";

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

function PhoneFrame({ children, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="mono-label hidden text-ink-3 lg:block">
          {label}
        </span>
      )}
      <div className="relative h-dvh w-full overflow-hidden bg-canvas lg:h-[844px] lg:w-[393px] lg:rounded-[44px] lg:border-[8px] lg:border-[#111111] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">
        <div className="no-scrollbar h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const isDesktop = useIsDesktop();

  return (
    <div className="min-h-screen bg-[#e8e8e5] text-ink antialiased">
      {/* Header Desktop */}
      <header className="hidden items-center justify-between border-b border-[#d8d8d4] px-10 py-5 lg:flex">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="mono-label text-ink-3">
            Arsitektur Industri Seluler • Spesifikasi 393px
          </span>
        </div>
        <div className="mono-label text-ink-2">
          Gaya Desain: Industrial Minimalis
        </div>
      </header>

      {/* Tampilan Desktop Studio: Pratinjau berdampingan */}
      {isDesktop ? (
        <div className="flex justify-center gap-12 py-10">
          <PhoneFrame label="Layar 1: Halaman Depan (Terinspirasi CoMinVi)">
            <LandingPage onOpenDashboard={() => setScreen("dashboard")} />
          </PhoneFrame>
          <PhoneFrame label="Layar 2: Dashboard Operasional (7 Modul MVP)">
            <Dashboard onBack={() => setScreen("landing")} />
          </PhoneFrame>
        </div>
      ) : (
        /* Tampilan Mobile */
        <div className="h-full w-full">
          {screen === "landing" ? (
            <LandingPage onOpenDashboard={() => setScreen("dashboard")} />
          ) : (
            <Dashboard onBack={() => setScreen("landing")} />
          )}
        </div>
      )}
    </div>
  );
}
