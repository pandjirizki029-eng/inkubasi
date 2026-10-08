import { useState } from "react";
import { Plus, Camera, ScanBarcode, X, Send } from "lucide-react";
import { PillButton } from "../ui/primitives";

const CATEGORIES = [
  { id: "safety", label: "K3 / Keselamatan", code: "K3" },
  { id: "machine", label: "Masalah Mesin", code: "MESIN" },
  { id: "ops", label: "Kendala Operasional", code: "OPS" },
];

const SEVERITIES = [
  { id: "Rendah", label: "Rendah" },
  { id: "Sedang", label: "Sedang" },
  { id: "Tinggi", label: "Tinggi" },
  { id: "Kritis", label: "Kritis" },
];

export default function ReportIssue({ onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("machine");
  const [severity, setSeverity] = useState("Tinggi");

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    onSubmitted?.("Masalah SL 0413 berhasil dicatat ke sistem");
  };

  return (
    <section aria-label="Pelaporan Masalah Digital" className="space-y-2">
      {/* Tombol Pemicu Utama — Classic Dark Pill with Clean Action Inset */}
      <PillButton
        tone="dark"
        icon={Plus}
        onClick={() => setOpen(true)}
      >
        Laporkan Masalah (K3 / Mesin / Ops)
      </PillButton>

      {/* Tombol Sub-Aksi Cepat — Minimal Hairline Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setOpen(true)}
          className="tap mono-label flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-card text-[10.5px] text-ink-2 hover:border-ink hover:text-ink"
        >
          <Camera size={14} /> Lampirkan Foto
        </button>
        <button
          onClick={() => setOpen(true)}
          className="tap mono-label flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-card text-[10.5px] text-ink-2 hover:border-ink hover:text-ink"
        >
          <ScanBarcode size={14} /> Pindai Barcode
        </button>
      </div>

      {/* Formulir Modal Lembut */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl border-t border-line bg-card p-5 shadow-2xl animate-rise"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="mono-label text-[9.5px] text-ink-3">FORMULIR LAPANGAN</span>
                <h3 className="headline text-[19px] text-ink">Catat Insiden Teknis</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="tap grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-2 hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            {/* Pilihan Kategori */}
            <div className="space-y-1.5">
              <span className="mono-label text-[9.5px] text-ink-3">Kategori Insiden</span>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`tap flex h-12 flex-col items-center justify-center rounded-lg border text-[11px] transition ${
                      category === c.id
                        ? "border-ink bg-ink text-white font-medium"
                        : "border-line bg-canvas text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className="mono-label text-[8.5px] opacity-60">{c.code}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kode Aset & Catatan Kerusakan */}
            <div className="mt-3.5 space-y-2">
              <span className="mono-label text-[9.5px] text-ink-3">Kode Aset & Detail</span>
              <div className="flex gap-2">
                <input
                  defaultValue="CNC 04"
                  placeholder="ID Aset"
                  className="font-mono h-10 w-28 rounded-lg border border-line bg-canvas px-3 text-[12.5px] outline-none focus:border-ink"
                />
                <input
                  placeholder="Lokasi (Lini 2)"
                  defaultValue="Lini 2"
                  className="h-10 flex-1 rounded-lg border border-line bg-canvas px-3 text-[12.5px] outline-none focus:border-ink"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Gejala teknis yang diamati..."
                defaultValue="Getaran tidak normal pada bantalan spindel"
                className="w-full resize-none rounded-lg border border-line bg-canvas p-2.5 text-[12.5px] outline-none focus:border-ink"
              />
            </div>

            {/* Tingkat Keparahan */}
            <div className="mt-3 space-y-1.5">
              <span className="mono-label text-[9.5px] text-ink-3">Tingkat Keparahan</span>
              <div className="grid grid-cols-4 gap-1.5">
                {SEVERITIES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className={`tap mono-label h-8 rounded-lg border text-[10.5px] ${
                      severity === s.id
                        ? "border-ink bg-ink text-white font-medium"
                        : "border-line bg-canvas text-ink-2"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="mt-4">
              <button
                type="submit"
                className="tap mono-label flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-[11px] font-medium text-white"
              >
                <Send size={14} /> Simpan Catatan ke Sistem
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
