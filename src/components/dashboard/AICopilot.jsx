import { useState } from "react";
import { Search, Sparkles, BookOpen, ArrowUpRight } from "lucide-react";
import { SectionTag, Tag } from "../ui/primitives";

const KNOWLEDGE_CASES = [
  { id: "#204", query: "getaran cnc 04 vibration", solution: "Penggantian Bantalan 6204 menyelesaikan 85% masalah getaran berulang.", match: 94 },
  { id: "#187", query: "tabrakan spindel collision", solution: "Kalibrasi ulang sumbu spindel dengan pemeriksaan dial gauge ganda.", match: 72 },
  { id: "#098", query: "titik buta forklift blind spot", solution: "Pemasangan cermin cembung dan marka zebra kuning di lantai.", match: 65 },
];

export default function AICopilot() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? KNOWLEDGE_CASES.filter((k) =>
        k.solution.toLowerCase().includes(search.toLowerCase()) ||
        k.query.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <section className="space-y-3" aria-label="Kopilot Rekayasa AI">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <SectionTag n="02">MESIN PENGETAHUAN</SectionTag>
        <span className="mono-label text-[10px] text-ink-3">412 Kasus Terindeks</span>
      </div>

      <div className="rounded-xl border border-line bg-card p-4">
        {/* Header Asisten */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded bg-ink text-white">
              <Sparkles size={13} />
            </span>
            <span className="text-[13px] font-semibold text-ink">AI Engineering Copilot</span>
          </div>
          <span className="mono-label text-[10px] text-ink-3">Indeks v1.2</span>
        </div>

        {/* Input Pencarian */}
        <div className="relative mt-3">
          <Search size={15} className="absolute left-3 top-3 text-ink-3" />
          <input
            id="ai-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari gejala kegagalan (misal: 'getaran tidak normal CNC 04')..."
            className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-[12.5px] outline-none placeholder:text-ink-3 focus:border-ink"
          />
        </div>

        {/* Hasil Pencarian Dinamis */}
        {filtered.length > 0 && (
          <div className="mt-2 divide-y divide-line rounded-lg border border-line bg-canvas">
            {filtered.map((item) => (
              <div key={item.id} className="p-2.5 text-[12px]">
                <div className="flex items-center justify-between font-mono text-[10.5px]">
                  <span className="font-semibold text-ink">Kasus {item.id}</span>
                  <span className="text-ok-ink">{item.match}% kecocokan</span>
                </div>
                <p className="mt-1 text-ink-2">{item.solution}</p>
              </div>
            ))}
          </div>
        )}

        {/* Rekomendasi Instan */}
        <div className="mt-3 rounded-lg border border-line bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="mono-label text-ink-3">SOLUSI REKOMENDASI</span>
            <Tag tone="ok">85% Cocok</Tag>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-snug text-ink">
            <strong className="font-semibold">Kasus #204:</strong> Penggantian Bantalan <code className="font-mono text-ink">6204</code> menyelesaikan 85% getaran berulang pada unit CNC.
          </p>
        </div>

        {/* Tombol Pintasan */}
        <div className="mt-3 flex gap-2">
          <button className="tap mono-label flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line text-[10.5px] text-ink-2 hover:text-ink">
            <BookOpen size={13} /> Lihat SOP Bantalan
          </button>
          <button className="tap mono-label flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line text-[10.5px] text-ink-2 hover:text-ink">
            <span>Riwayat CNC 04</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
