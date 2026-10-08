import { TrendingUp, ShieldCheck, ChevronRight } from "lucide-react";
import { LOSS_BREAKDOWN, DOWNTIME_TREND, RECURRING, formatRp } from "../../data/mock";
import { SectionTag, Tag } from "../ui/primitives";

export default function LossSummary({ onOpenLoss }) {
  const total = LOSS_BREAKDOWN.reduce((s, b) => s + b.value, 0);

  return (
    <section className="space-y-4" aria-label="Ringkasan Kerugian Operasional">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <SectionTag n="01">DETAK OPERASIONAL</SectionTag>
        <span className="mono-label text-[10px] text-ink-3">Data Shift Terkini</span>
      </div>

      {/* Kartu Utama Kerugian Operasional */}
      <div className="rounded-xl bg-night p-5 text-white shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <span className="mono-label text-white/50">Estimasi Kerugian Operasional</span>
            <div className="mt-1 font-mono text-[32px] font-semibold leading-none tracking-tight text-white">
              {formatRp(total)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-hazard">
              <TrendingUp size={13} />
              <span>+18% dibandingkan rata rata 7 hari</span>
            </div>
          </div>
          <button
            onClick={onOpenLoss}
            aria-label="Buka Rincian Kerugian"
            className="tap grid h-9 w-9 place-items-center rounded-lg border border-white/20 text-white/80 hover:bg-white/10"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Indikator Komposisi Biaya */}
        <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-night-2">
          {LOSS_BREAKDOWN.map((b) => (
            <div
              key={b.key}
              className={`${b.color} h-full`}
              style={{ width: `${(b.value / total) * 100}%` }}
            />
          ))}
        </div>

        {/* 4 Komponen Biaya */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-night-line pt-3">
          {LOSS_BREAKDOWN.map((b) => (
            <div key={b.key} className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-white/60">{b.key}</span>
              <span className="font-semibold text-white">
                {(b.value / 1e6).toFixed(2)} Jt
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Waktu Henti & Mesin Bermasalah Berulang */}
      <div className="grid grid-cols-2 gap-3">
        {/* Waktu Henti */}
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="mono-label text-ink-3">Waktu Henti</span>
            <Tag tone="hazard">Aktif</Tag>
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold tracking-tight text-ink">
            3j 15m
          </div>
          <div className="mt-3 flex h-6 items-end gap-1">
            {DOWNTIME_TREND.map((v, idx) => (
              <span
                key={idx}
                className={`flex-1 rounded-sm ${
                  idx === DOWNTIME_TREND.length - 1 ? "bg-hazard" : "bg-line"
                }`}
                style={{ height: `${(v / 195) * 100}%` }}
              />
            ))}
          </div>
          <span className="mono-label mt-2 block text-[9.5px] text-ink-3">Tren Kejadian 7 Hari</span>
        </div>

        {/* Masalah Berulang */}
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="mono-label text-ink-3">Gangguan Berulang</span>
            <Tag tone="critical">2 Mesin</Tag>
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold tracking-tight text-critical">
            2
          </div>
          <div className="mt-2 space-y-1">
            {RECURRING.map((r) => (
              <div key={r.code} className="flex items-center justify-between font-mono text-[10.5px]">
                <span className="font-semibold text-ink">{r.code}</span>
                <span className="text-ink-3">{r.count}x per 30 hari</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Keselamatan K3 */}
      <div className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-ok/10 text-ok-ink">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">Nol Kecelakaan Kerja Hilang Waktu (LTI)</div>
            <div className="mono-label text-[10px] text-ink-3">2 Kejadian Nyaris Celaka • Pengawasan Diperketat</div>
          </div>
        </div>
        <Tag tone="ok">128 Hari Bebas LTI</Tag>
      </div>
    </section>
  );
}
