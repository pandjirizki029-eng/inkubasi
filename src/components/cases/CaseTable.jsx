import { ArrowRight } from "lucide-react";
import { personById, getDisplayStatus } from "../../data/cases";
import { formatDateTime } from "../../lib/format";
import { StatusBadge, SeverityBadge, CategoryBadge } from "./badges";

const COLUMNS = ["ID Kasus", "Tanggal / Waktu", "Kode Mesin", "Lokasi", "Kategori", "Keparahan", "PIC", "Status", "Aksi"];

/** Tampilan tabel — bisa digeser horizontal di layar kecil. */
export default function CaseTable({ cases, onOpen }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-line bg-card">
      <p className="border-b-2 border-line bg-canvas px-4 py-2 text-[13px] font-semibold text-ink-2">
        ← Geser tabel ke kiri / kanan untuk melihat semua kolom →
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left text-[15px]">
          <thead>
            <tr className="bg-ink text-white">
              {COLUMNS.map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap px-3 py-3 text-[13px] font-bold uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => {
              const pic = personById(c.action.pic);
              return (
                <tr key={c.id} className={`border-t-2 border-line ${i % 2 ? "bg-canvas/50" : "bg-card"}`}>
                  <td className="whitespace-nowrap px-3 py-3 font-mono font-bold">{c.id}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[14px]">{formatDateTime(c.reportedAt)}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[16px] font-bold">{c.machine}</td>
                  <td className="whitespace-nowrap px-3 py-3">{c.location}</td>
                  <td className="px-3 py-3"><CategoryBadge category={c.category} /></td>
                  <td className="px-3 py-3"><SeverityBadge severity={c.severity} /></td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">{pic ? pic.name : <span className="text-info-ink">Belum ada</span>}</td>
                  <td className="px-3 py-3"><StatusBadge status={getDisplayStatus(c)} /></td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => onOpen(c.id)}
                      className="tap flex h-11 items-center gap-1.5 whitespace-nowrap rounded-lg bg-ink px-3.5 text-[14px] font-bold text-white"
                    >
                      Proses / Detail <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
