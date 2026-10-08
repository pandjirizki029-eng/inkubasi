import { useState } from "react";
import { Search, BookOpen, ArrowUpRight } from "lucide-react";
import { SectionTag } from "../ui/primitives";

const KNOWLEDGE_CASES = [
  { id: "#204", query: "getaran cnc 04 vibration", solution: "Penggantian Bantalan 6204 menyelesaikan 85% masalah getaran berulang.", match: 94 },
  { id: "#187", query: "tabrakan spindel collision", solution: "Kalibrasi ulang sumbu spindel dengan dial gauge ganda.", match: 72 },
  { id: "#098", query: "titik buta forklift blind spot", solution: "Pemasangan cermin cembung dan marka zebra di lantai.", match: 65 },
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
    <section className="space-y-2.5" aria-label="Kopilot Rekayasa AI">
      <div className="flex items-center justify-between">
        <SectionTag n="02">BASIS PENGETAHUAN</SectionTag>
        <span className="mono-label text-[9.5px] text-ink-3">412 Kasus</span>
      </div>

      <div className="rounded-xl border border-line bg-card p-4 transition hover:border-ink/20">
        {/* Header Asisten — Classic Monochrome */}
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <span className="mono-label text-[10.5px] font-semibold text-ink">AI Copilot</span>
            <span className="mono-label text-[9px] text-ink-3">• Riwayat Mesin</span>
          </div>
          <span className="mono-label text-[9px] text-ink-3">v1.2</span>
        </div>

        {/* Input Pencarian Minimalis */}
        <div className="relative mt-2.5">
          <Search size={14} className="absolute left-3 top-2.5 text-ink-3" />
          <input
            id="ai-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari gejala kerusakan (misal: 'getaran CNC 04')..."
            className="h-9 w-full rounded-lg border border-line bg-canvas pl-8 pr-3 text-[12px] outline-none placeholder:text-ink-3 focus:border-ink"
          />
        </div>

        {/* Hasil Pencarian Dinamis */}
        {filtered.length > 0 && (
          <div className="mt-2 divide-y divide-line rounded-lg border border-line bg-canvas">
            {filtered.map((item) => (
              <div key={item.id} className="p-2 text-[11.5px]">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-medium text-ink">Kasus {item.id}</span>
                  <span className="text-ok-ink">{item.match}% cocok</span>
                </div>
                <p className="mt-0.5 text-ink-2">{item.solution}</p>
              </div>
            ))}
          </div>
        )}

        {/* Rekomendasi Instan — Clean Document Excerpt */}
        <div className="mt-2.5 rounded-lg border border-line bg-canvas p-2.5">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[9px] text-ink-3">KASUS SERUPA #204</span>
            <span className="mono-label text-[9px] text-ok-ink font-semibold">85% KECOCOKAN</span>
          </div>
          <p className="mt-1 text-[12px] leading-snug text-ink">
            Penggantian Bantalan <span className="font-mono font-medium">6204</span> menyelesaikan 85% getaran berulang pada unit spindel CNC.
          </p>
        </div>

        {/* Tombol Pintasan */}
        <div className="mt-2.5 flex gap-2">
          <button className="tap mono-label flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-[10px] text-ink-2 hover:border-ink hover:text-ink">
            <BookOpen size={12} /> SOP Bantalan
          </button>
          <button className="tap mono-label flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line text-[10px] text-ink-2 hover:border-ink hover:text-ink">
            <span>Riwayat CNC 04</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </section>
  );
}
