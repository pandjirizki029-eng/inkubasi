import { ArrowRight, MapPin, Clock, User, CalendarClock } from "lucide-react";
import { machineByCode, personById, getDisplayStatus } from "../../data/cases";
import { formatDate, timeAgo } from "../../lib/format";
import { StatusBadge, SeverityBadge, CategoryBadge, SEVERITY_STYLE } from "./badges";

/** Kartu kasus — semua info penting terlihat, tombol aksi langsung tampil (tanpa kebab menu). */
export default function CaseCard({ c, onOpen }) {
  const machine = machineByCode(c.machine);
  const pic = personById(c.action.pic);
  const status = getDisplayStatus(c);

  const cta = {
    open: "Proses Kasus Ini",
    in_progress: "Lanjutkan Proses",
    overdue: "Proses Sekarang (Overdue)",
    waiting_verification: "Verifikasi Kasus",
    closed: "Lihat Detail",
  }[status];

  return (
    <article className="relative overflow-hidden rounded-2xl border-2 border-line bg-card animate-rise">
      {/* Strip warna keparahan di kiri */}
      <span className={`absolute inset-y-0 left-0 w-1.5 ${SEVERITY_STYLE[c.severity].bar}`} aria-hidden />

      <div className="space-y-3 py-4 pl-5 pr-4">
        {/* Baris atas: ID + Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[14px] font-bold text-ink-2">{c.id}</span>
          <StatusBadge status={status} />
        </div>

        {/* Mesin & lokasi */}
        <div>
          <h3 className="font-mono text-[22px] font-bold leading-none tracking-tight text-ink">{c.machine}</h3>
          <p className="mt-1 text-[14px] text-ink-2">{machine?.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-ink">
            <MapPin size={15} className="text-ink-2" /> {c.location}
          </p>
        </div>

        {/* Gejala */}
        <p className="line-clamp-2 text-[16px] leading-snug text-ink">{c.symptom}</p>

        {/* Kategori + Keparahan */}
        <div className="flex flex-wrap gap-1.5">
          <CategoryBadge category={c.category} />
          <SeverityBadge severity={c.severity} />
        </div>

        {/* Info grid */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border-2 border-line bg-canvas/60 p-3 text-[14px]">
          <div>
            <dt className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-2"><Clock size={13} /> Dilaporkan</dt>
            <dd className="font-semibold text-ink">{timeAgo(c.reportedAt)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-2"><CalendarClock size={13} /> Deadline</dt>
            <dd className={`font-semibold ${status === "overdue" ? "text-critical-ink" : "text-ink"}`}>
              {c.action.deadline ? formatDate(c.action.deadline) : "Belum diatur"}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-2"><User size={13} /> PIC</dt>
            <dd className={`font-semibold ${pic ? "text-ink" : "text-info-ink"}`}>
              {pic ? `${pic.name} — ${pic.role}` : "Belum ditugaskan"}
            </dd>
          </div>
        </dl>

        {/* Tombol aksi gamblang */}
        <button
          id={`open-case-${c.id}`}
          onClick={() => onOpen(c.id)}
          className={`tap flex h-13 w-full items-center justify-between rounded-xl px-4 text-[16px] font-bold transition ${
            status === "closed" ? "border-2 border-ink bg-card text-ink" : status === "waiting_verification" ? "bg-done text-white" : "bg-ink text-white"
          }`}
        >
          <span>{cta}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </article>
  );
}
