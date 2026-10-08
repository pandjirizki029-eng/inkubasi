import { useState } from "react";
import { User, Clock, Upload, CheckCircle2, ChevronRight } from "lucide-react";
import { SectionTag } from "../ui/primitives";
import { CASES } from "../../data/mock";

export default function ActionFeed({ filter, onToast }) {
  const [proofUploaded, setProofUploaded] = useState(false);

  const filteredCases = CASES.filter((c) => filter === "all" || c.category === filter);

  const handleUpload = () => {
    setProofUploaded(true);
    onToast?.("Bukti foto perbaikan telah diunggah untuk CNC 04");
  };

  return (
    <section className="space-y-2.5" aria-label="Daftar Tindakan Perbaikan">
      <div className="flex items-center justify-between">
        <SectionTag n="03">KASUS AKTIF</SectionTag>
        <span className="mono-label text-[9.5px] text-ink-3">{filteredCases.length} Kasus</span>
      </div>

      <div className="space-y-2.5">
        {filteredCases.map((c) => {
          if (c.priority) {
            return (
              /* Kartu Rekayasa Prioritas Utama — Classic Engineering Card */
              <div
                key={c.id}
                className="overflow-hidden rounded-xl border border-line bg-card shadow-xs transition hover:border-ink/20"
              >
                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-line bg-canvas/60 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-bold text-ink">{c.code}</span>
                    <span className="mono-label text-[9.5px] text-ink-3">• {c.area}</span>
                  </div>
                  <span className="mono-label rounded border border-critical/30 bg-critical/10 px-1.5 py-0.5 text-[9px] text-critical-ink font-semibold">
                    {c.severity}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Gejala & Parameter Fisik */}
                  <div>
                    <span className="mono-label text-[9.5px] text-ink-3">Gejala Diamati</span>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-ink">{c.symptom}</p>
                    <div className="mt-1.5 flex gap-2 font-mono text-[10.5px]">
                      {c.params.map((p) => (
                        <div key={p.k} className="rounded border border-line bg-canvas px-2 py-0.5">
                          <span className="text-ink-3">{p.k}: </span>
                          <span className="font-semibold text-ink">{p.v}</span>
                          <span className="text-ink-3 text-[9.5px]"> ({p.limit})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis Akar Masalah */}
                  <div className="border-t border-line/70 pt-2">
                    <span className="mono-label text-[9.5px] text-ink-3">Akar Masalah</span>
                    <p className="mt-0.5 text-[12.5px] text-ink-2">{c.rootCause}</p>
                  </div>

                  {/* Kotak Tugas Tindakan Perbaikan — Clean Inset */}
                  <div className="rounded-lg border border-line bg-canvas p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11.5px] text-ink">
                        <User size={13} className="text-ink-3" />
                        <span className="font-medium">{c.pic.name}</span>
                        <span className="text-ink-3">({c.pic.role})</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px] text-ink-2">
                        <Clock size={11} />
                        <span>Batas 16:00</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[12px] font-medium text-ink">
                      "{c.action}"
                    </div>
                  </div>

                  {/* Status Verifikasi Lapangan */}
                  <div className="flex items-center justify-between border-t border-line pt-2.5">
                    <div>
                      <span className="mono-label text-[9.5px] text-ink-3">Status Verifikasi</span>
                      <p className="text-[12px] font-medium text-ink">
                        {proofUploaded ? "Bukti Terkirim (Menunggu K3)" : "Menunggu Foto Bukti"}
                      </p>
                    </div>
                    {proofUploaded ? (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-ok-ink font-medium">
                        <CheckCircle2 size={14} /> Terverifikasi
                      </div>
                    ) : (
                      <button
                        id="upload-proof-btn"
                        onClick={handleUpload}
                        className="tap mono-label flex h-8 items-center gap-1.5 rounded-lg border border-line bg-ink px-2.5 text-[10px] font-medium text-white hover:bg-black"
                      >
                        <Upload size={12} /> Unggah Bukti
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          /* Baris Kasus Ringkas — Classic Ledger Entry */
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-line bg-card p-3 transition hover:border-ink/20"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-ink">{c.code}</span>
                  <span className="mono-label text-[9.5px] text-ink-3">{c.area}</span>
                  <span className="mono-label rounded border border-line px-1.5 py-0.2 text-[8.5px] text-ink-2">
                    {c.severity}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-ink">{c.symptom}</p>
                <div className="mono-label mt-1 flex items-center gap-2 text-[9.5px] text-ink-3">
                  <span>PIC: {c.pic.name}</span>
                  <span>•</span>
                  <span>{c.status}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-ink-3" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
