import { useState } from "react";
import { User, Clock, Upload, CheckCircle2, ChevronRight } from "lucide-react";
import { SectionTag, Tag } from "../ui/primitives";
import { CASES } from "../../data/mock";

export default function ActionFeed({ filter, onToast }) {
  const [proofUploaded, setProofUploaded] = useState(false);

  const filteredCases = CASES.filter((c) => filter === "all" || c.category === filter);

  const handleUpload = () => {
    setProofUploaded(true);
    onToast?.("Bukti foto perbaikan telah diunggah untuk Kasus CNC 04");
  };

  return (
    <section className="space-y-3" aria-label="Daftar Tindakan Perbaikan">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <SectionTag n="03">KASUS AKTIF</SectionTag>
        <span className="mono-label text-[10px] text-ink-3">{filteredCases.length} Tindakan Menunggu</span>
      </div>

      <div className="space-y-3">
        {filteredCases.map((c) => {
          if (c.priority) {
            return (
              /* Kartu Rekayasa Prioritas Utama */
              <div
                key={c.id}
                className="overflow-hidden rounded-xl border border-line bg-card shadow-sm"
              >
                {/* Baris Judul Aset */}
                <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-ink">{c.code}</span>
                    <span className="mono-label rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-3">
                      {c.area}
                    </span>
                  </div>
                  <Tag tone="critical">{c.severity}</Tag>
                </div>

                <div className="p-4 space-y-3">
                  {/* Gejala & Parameter Fisik */}
                  <div>
                    <span className="mono-label text-ink-3">Gejala yang Diamati</span>
                    <p className="mt-0.5 text-[14px] font-semibold text-ink">{c.symptom}</p>
                    <div className="mt-2 flex gap-2 font-mono text-[11px]">
                      {c.params.map((p) => (
                        <div key={p.k} className="rounded-md border border-line bg-canvas px-2.5 py-1">
                          <span className="text-ink-3">{p.k}: </span>
                          <span className="font-semibold text-critical-ink">{p.v}</span>
                          <span className="text-ink-3"> ({p.limit})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis Akar Masalah */}
                  <div className="border-t border-line pt-2.5">
                    <span className="mono-label text-ink-3">Diagnosis Akar Masalah</span>
                    <p className="mt-0.5 text-[13px] text-ink-2">{c.rootCause}</p>
                  </div>

                  {/* Kotak Tugas Tindakan Perbaikan */}
                  <div className="rounded-lg border border-line bg-canvas p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] text-ink">
                        <User size={14} className="text-ink-3" />
                        <span className="font-medium">{c.pic.name}</span>
                        <span className="text-ink-3">({c.pic.role})</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-hazard-ink">
                        <Clock size={12} />
                        <span>Batas Waktu 16:00</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[13px] font-medium text-ink">
                      "{c.action}"
                    </div>
                  </div>

                  {/* Status Verifikasi Lapangan */}
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <div>
                      <span className="mono-label text-ink-3">Verifikasi</span>
                      <p className="text-[12.5px] font-medium text-ink">
                        {proofUploaded ? "Bukti Terkirim (Menunggu Persetujuan K3)" : "Menunggu Bukti Foto Selesai"}
                      </p>
                    </div>
                    {proofUploaded ? (
                      <div className="flex items-center gap-1 font-mono text-[11.5px] text-ok-ink">
                        <CheckCircle2 size={16} /> Terverifikasi
                      </div>
                    ) : (
                      <button
                        id="upload-proof-btn"
                        onClick={handleUpload}
                        className="tap mono-label flex h-9 items-center gap-1.5 rounded-lg border border-line bg-ink px-3 text-[11px] font-medium text-white"
                      >
                        <Upload size={13} /> Unggah Bukti
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          /* Baris Kasus Ringkas */
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-line bg-card p-3.5 transition hover:border-ink/30"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-ink">{c.code}</span>
                  <span className="mono-label text-[10px] text-ink-3">{c.area}</span>
                  <Tag tone={c.severity === "Tinggi" ? "hazard" : "neutral"}>
                    {c.severity}
                  </Tag>
                </div>
                <p className="mt-1 text-[13px] text-ink">{c.symptom}</p>
                <div className="mono-label mt-1.5 flex items-center gap-2 text-[10.5px] text-ink-3">
                  <span>PIC: {c.pic.name}</span>
                  <span>•</span>
                  <span>{c.status}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-ink-3" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
