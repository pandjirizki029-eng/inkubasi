import { LayoutDashboard, AlertTriangle, ClipboardCheck, BookOpen, BarChart2 } from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "issues", label: "Masalah", icon: AlertTriangle, count: 4 },
  { id: "actions", label: "Tindakan", icon: ClipboardCheck, count: 1 },
  { id: "knowledge", label: "Pengetahuan", icon: BookOpen },
  { id: "loss", label: "Kerugian", icon: BarChart2 },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      aria-label="Navigasi Bawah"
      className="sticky bottom-0 z-30 grid grid-cols-5 border-t border-line bg-canvas/95 px-1 py-1 backdrop-blur-md"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onChange(item.id)}
            className="tap relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-1"
          >
            <div className="relative">
              <Icon
                size={17}
                className={isActive ? "text-ink" : "text-ink-3"}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              {item.count && (
                <span className="mono-label absolute -right-2.5 -top-1 grid h-3 min-w-3 place-items-center rounded-full bg-ink px-0.5 text-[8px] font-bold text-white">
                  {item.count}
                </span>
              )}
            </div>
            <span
              className={`mono-label text-[9px] ${
                isActive ? "font-semibold text-ink" : "text-ink-3"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
