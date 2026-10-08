import { TrendingUp, ChevronRight } from "lucide-react";
import { LOSS_BREAKDOWN, DOWNTIME_TREND, RECURRING, formatRp } from "../../data/mock";
import { SectionTag } from "../ui/primitives";

export default function LossSummary({ onOpenLoss }) {
  const total = LOSS_BREAKDOWN.reduce((s, b) => s + b.value, 0);

  return (
    <section className="space-y-3" aria-label="Ringkasan Kerugian Operasional">
      <div className="flex items-center justify-between">
        <SectionTag n="01">DETAK OPERASIONAL</SectionTag>
        <span className="mono-label text-[9.5px] text-ink-3">Shift Aktif</span>
      </div>

      {/* Kartu Utama Kerugian Operasional — Classic Editorial Style */}
      <div className="rounded-xl border border-line bg-card p-4 transition hover:border-ink/20">
        <div className="flex items-start justify-between">
          <div>
            <span className="mono-label text-[10px] text-ink-3">Estimasi Kerugian Operasional</span>
            <div className="mt-1 font-mono text-[30px] font-semibold leading-none tracking-tight text-ink">
              {formatRp(total)}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-hazard-ink">
              <TrendingUp size={12} />
              <span>+18% dari rata rata 7 hari</span>
            </div>
          </div>
          <button
            onClick={onOpenLoss}
            aria-label="Buka Rincian Kerugian"
            className="tap grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-2 hover:border-ink hover:text-ink"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Minimal Thin Progress Bar */}
        <div className="mt-4 flex h-1 overflow-hidden rounded-full bg-canvas">
          {LOSS_BREAKDOWN.map((b) => (
            <div
              key={b.key}
              className={`${b.color} h-full`}
              style={{ width: `${(b.value / total) * 100}%` }}
            />
          ))}
        </div>

        {/* 4 Komponen Biaya — Minimal Hairline Rows */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-line pt-2.5">
          {LOSS_BREAKDOWN.map((b) => (
            <div key={b.key} className="flex items-center justify-between font-mono text-[10.5px]">
              <span className="text-ink-3">{b.key}</span>
              <span className="font-medium text-ink">
                {(b.value / 1e6).toFixed(2)} Jt
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Waktu Henti & Gangguan Berulang — Classic Industrial Card */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Waktu Henti */}
        <div className="rounded-xl border border-line bg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[9.5px] text-ink-3">Waktu Henti</span>
            <span className="mono-label rounded border border-hazard/30 bg-hazard/10 px-1.5 py-0.5 text-[9px] text-hazard-ink font-medium">Aktif</span>
          </div>
          <div className="mt-2 font-mono text-[24px] font-semibold tracking-tight text-ink">
            3j 15m
          </div>
          <div className="mt-2.5 flex h-5 items-end gap-1">
            {DOWNTIME_TREND.map((v, idx) => (
              <span
                key={idx}
                className={`flex-1 rounded-xs ${
                  idx === DOWNTIME_TREND.length - 1 ? "bg-ink" : "bg-line"
                }`}
                style={{ height: `${(v / 195) * 100}%` }}
              />
            ))}
          </div>
          <span className="mono-label mt-2 block text-[9px] text-ink-3">Tren 7 Hari</span>
        </div>

        {/* Masalah Berulang */}
        <div className="rounded-xl border border-line bg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[9.5px] text-ink-3">Berulang</span>
            <span className="mono-label rounded border border-critical/30 bg-critical/10 px-1.5 py-0.5 text-[9px] text-critical-ink font-medium">2 Mesin</span>
          </div>
          <div className="mt-2 font-mono text-[24px] font-semibold tracking-tight text-ink">
            2
          </div>
          <div className="mt-1.5 space-y-0.5 border-t border-line/60 pt-1.5">
            {RECURRING.map((r) => (
              <div key={r.code} className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-ink font-medium">{r.code}</span>
                <span className="text-ink-3">{r.count}x / 30h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Keselamatan K3 — Minimal Ledger Strip */}
      <div className="flex items-center justify-between rounded-xl border border-line bg-card px-3.5 py-2.5">
        <div>
          <div className="text-[12.5px] font-medium tracking-tight text-ink">Nol Kecelakaan Kerja (LTI)</div>
          <div className="mono-label text-[9.5px] text-ink-3">2 Kejadian Nyaris Celaka Dicatat</div>
        </div>
        <div className="text-right">
          <span className="mono-label rounded border border-ok/30 bg-ok/10 px-2 py-0.5 text-[9.5px] text-ok-ink font-semibold">
            128 Hari Bebas
          </span>
        </div>
      </div>
    </section>
  );
}
