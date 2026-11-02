import { Plus, Trash2, ReceiptText, Calculator, Wrench } from "lucide-react";
import { uid } from "../../../data/cases";
import { computeLoss, formatRp } from "../../../lib/format";
import { Panel, Field, NumberInput, CurrencyInput, TextInput, Button } from "../../ui/form";

/**
 * Tab C: Kalkulator Operational Loss (Tahap RESOLVE - Dampak Bisnis)
 * Menghitung dampak finansial secara otomatis saat angka diketik.
 * Dilengkapi Summary Box ala Struk m-Banking (BCA Mobile style).
 */
export default function LossTab({ c, onChange, onToast }) {
  const loss = c.loss;
  const computed = computeLoss(loss);
  const locked = c.status === "closed";

  const setField = (patch) => onChange({ ...loss, ...patch });

  // Dynamic Spare Parts
  const addSparePart = () => {
    const newPart = { id: uid("sp"), name: "", qty: "1", price: 0 };
    setField({ spareParts: [...(loss.spareParts || []), newPart] });
  };

  const updateSparePart = (id, patch) => {
    const updated = (loss.spareParts || []).map((p) =>
      p.id === id ? { ...p, ...patch } : p
    );
    setField({ spareParts: updated });
  };

  const removeSparePart = (id) => {
    const updated = (loss.spareParts || []).filter((p) => p.id !== id);
    setField({ spareParts: updated });
  };

  const handleSaveLoss = () => {
    onToast?.(`Kalkulasi kerugian ${c.id} tersimpan: ${formatRp(computed.total)}`);
  };

  return (
    <div className="space-y-5">
      {/* ── PANEL 1: Parameter Downtime & Kehilangan Produksi ── */}
      <Panel
        step="C1"
        title="Downtime & Kehilangan Produksi"
        subtitle="Hitung waktu terhenti dan perkiraan nilai unit yang gagal diproduksi."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Durasi Machine Downtime"
            htmlFor="loss-downtime"
            hint="Total waktu mesin berhenti beroperasi."
          >
            <NumberInput
              id="loss-downtime"
              unit="Jam"
              disabled={locked}
              value={loss.downtimeHours}
              onChange={(e) => setField({ downtimeHours: e.target.value })}
              placeholder="0"
            />
          </Field>

          <Field
            label="Estimasi Production Loss"
            htmlFor="loss-units"
            hint="Jumlah unit produk yang gagal diproduksi."
          >
            <NumberInput
              id="loss-units"
              unit="Unit"
              disabled={locked}
              value={loss.productionUnits}
              onChange={(e) => setField({ productionUnits: e.target.value })}
              placeholder="0"
            />
          </Field>
        </div>

        <Field
          label="Nilai Kerugian per Unit (HPP / Margin Hilang)"
          htmlFor="loss-unit-val"
          hint="Estimasi nilai kerugian per 1 unit produksi yang tidak tercapai."
        >
          <CurrencyInput
            id="loss-unit-val"
            disabled={locked}
            value={loss.unitValue}
            onChange={(val) => setField({ unitValue: val })}
          />
        </Field>

        {computed.units > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-line bg-canvas p-3 font-mono text-[14px]">
            <span className="text-ink-2">Subtotal Kerugian Produksi:</span>
            <span className="font-bold text-ink">{formatRp(computed.production)}</span>
          </div>
        )}
      </Panel>

      {/* ── PANEL 2: Material Waste & Biaya Labor ── */}
      <Panel
        step="C2"
        title="Material Waste & Biaya Tenaga Kerja (Labor)"
        subtitle="Catat bahan baku terbuang dan jam kerja engineer yang dialokasikan."
      >
        <Field
          label="Biaya Material Waste / Scrap"
          htmlFor="loss-material"
          hint="Bahan baku rusak, scrap, atau cairan pelumas yang terbuang."
        >
          <CurrencyInput
            id="loss-material"
            disabled={locked}
            value={loss.materialWaste}
            onChange={(val) => setField({ materialWaste: val })}
          />
        </Field>

        <div className="space-y-3 border-t-2 border-line pt-4">
          <span className="block text-[15px] font-bold text-ink">
            Alokasi Tenaga Kerja (Labor)
          </span>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jumlah Engineer / Teknisi" htmlFor="labor-count">
              <NumberInput
                id="labor-count"
                unit="Orang"
                disabled={locked}
                value={loss.laborCount}
                onChange={(e) => setField({ laborCount: e.target.value })}
                placeholder="1"
              />
            </Field>

            <Field label="Lama Kerja per Orang" htmlFor="labor-hours">
              <NumberInput
                id="labor-hours"
                unit="Jam"
                disabled={locked}
                value={loss.laborHours}
                onChange={(e) => setField({ laborHours: e.target.value })}
                placeholder="1"
              />
            </Field>
          </div>

          <Field
            label="Tarif Tenaga Kerja per Jam (Opsional)"
            htmlFor="labor-rate"
            hint="Standar internal pabrik (Default: Rp50.000/jam/orang)."
          >
            <CurrencyInput
              id="labor-rate"
              disabled={locked}
              value={loss.laborRate}
              onChange={(val) => setField({ laborRate: val })}
            />
          </Field>

          {computed.labor > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-line bg-canvas p-3 font-mono text-[14px]">
              <span className="text-ink-2">
                Subtotal Labor ({computed.laborCount} org × {computed.laborHours} jam):
              </span>
              <span className="font-bold text-ink">{formatRp(computed.labor)}</span>
            </div>
          )}
        </div>
      </Panel>

      {/* ── PANEL 3: Dynamic List Spare Parts ── */}
      <Panel
        step="C3"
        title="Penggantian Spare Parts & Komponen"
        subtitle="Rincian suku cadang yang digunakan untuk perbaikan mesin."
      >
        <div className="space-y-3">
          {(loss.spareParts || []).length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-line p-5 text-center">
              <Wrench size={28} className="mx-auto text-ink-3" />
              <p className="mt-2 text-[15px] font-bold text-ink">Belum ada suku cadang yang ditambahkan</p>
              <p className="text-[13px] text-ink-2">Klik tombol di bawah jika perbaikan membutuhkan komponen baru.</p>
            </div>
          ) : (
            (loss.spareParts || []).map((part, index) => {
              const partSubtotal = (parseFloat(part.qty) || 0) * (parseFloat(part.price) || 0);
              return (
                <div
                  key={part.id}
                  className="space-y-3 rounded-xl border-2 border-line bg-canvas/70 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-bold text-ink-2">
                      Komponen #{index + 1}
                    </span>
                    {!locked && (
                      <button
                        type="button"
                        onClick={() => removeSparePart(part.id)}
                        className="tap flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-bold text-critical-ink hover:bg-critical/10"
                      >
                        <Trash2 size={15} /> Hapus Baris
                      </button>
                    )}
                  </div>

                  <Field label="Nama Komponen / Spesifikasi" htmlFor={`part-name-${part.id}`}>
                    <TextInput
                      id={`part-name-${part.id}`}
                      disabled={locked}
                      value={part.name}
                      onChange={(e) => updateSparePart(part.id, { name: e.target.value })}
                      placeholder="Misal: Bearing SKF 6204-2RS"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[110px_1fr]">
                    <Field label="Jumlah" htmlFor={`part-qty-${part.id}`}>
                      <NumberInput
                        id={`part-qty-${part.id}`}
                        unit="Pcs"
                        disabled={locked}
                        value={part.qty}
                        onChange={(e) => updateSparePart(part.id, { qty: e.target.value })}
                        placeholder="1"
                      />
                    </Field>

                    <Field label="Harga Satuan (Rp)" htmlFor={`part-price-${part.id}`}>
                      <CurrencyInput
                        id={`part-price-${part.id}`}
                        disabled={locked}
                        value={part.price}
                        onChange={(val) => updateSparePart(part.id, { price: val })}
                      />
                    </Field>
                  </div>

                  <div className="flex items-center justify-between border-t border-line/70 pt-2 font-mono text-[14px]">
                    <span className="text-ink-2">Subtotal Komponen:</span>
                    <span className="font-bold text-ink">{formatRp(partSubtotal)}</span>
                  </div>
                </div>
              );
            })
          )}

          {!locked && (
            <Button
              tone="soft"
              size="md"
              icon={Plus}
              onClick={addSparePart}
              className="w-full border-dashed"
            >
              Tambah Baris Spare Part
            </Button>
          )}
        </div>
      </Panel>

      {/* ── SUMMARY BOX: ALA STRUK M-BANKING (BCA MOBILE INSPIRED) ── */}
      <div className="overflow-hidden rounded-2xl border-4 border-ink bg-night text-white shadow-2xl">
        {/* Header Struk */}
        <div className="border-b-2 border-dashed border-white/30 bg-night-2 p-5 text-center">
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-xl bg-hazard text-night">
            <ReceiptText size={26} strokeWidth={2.5} />
          </div>
          <span className="mono-label text-[11px] tracking-widest text-white/60">
            RINCIAN OPERATIONAL LOSS
          </span>
          <h3 className="mt-1 font-display text-[20px] font-bold text-white">
            SAFETYLOG FINANCIAL IMPACT
          </h3>
          <p className="mt-0.5 font-mono text-[13px] text-white/70">
            KASUS: {c.id} • MESIN: {c.machine}
          </p>
        </div>

        {/* Isi Rincian Struk */}
        <div className="space-y-3 p-5 font-mono text-[14px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-white/70">Waktu Henti (Downtime):</span>
            <span className="font-semibold text-white">
              {computed.downtimeHours > 0 ? `${computed.downtimeHours} Jam` : "0 Jam"}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="text-white/70">Production Loss:</span>
              <span className="block text-[11.5px] text-white/40">
                ({computed.units} unit × {formatRp(loss.unitValue)})
              </span>
            </div>
            <span className="font-semibold text-white">
              {formatRp(computed.production)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-white/70">Material Waste / Scrap:</span>
            <span className="font-semibold text-white">
              {formatRp(computed.material)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="text-white/70">Tenaga Kerja (Labor):</span>
              <span className="block text-[11.5px] text-white/40">
                ({computed.laborCount} org × {computed.laborHours} jam)
              </span>
            </div>
            <span className="font-semibold text-white">
              {formatRp(computed.labor)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="text-white/70">Suku Cadang (Spare Parts):</span>
              <span className="block text-[11.5px] text-white/40">
                ({computed.parts.length} item komponen)
              </span>
            </div>
            <span className="font-semibold text-white">
              {formatRp(computed.spare)}
            </span>
          </div>

          {/* TOTAL OPERATIONAL LOSS - TEGAS, BESAR & KONTRAS */}
          <div className="mt-4 rounded-xl border-2 border-hazard bg-hazard/10 p-4">
            <div className="flex items-baseline justify-between">
              <span className="mono-label text-[12px] font-bold uppercase tracking-wider text-hazard">
                Total Operational Loss
              </span>
              <span className="font-mono text-[11px] text-white/60">Real-time</span>
            </div>
            <div className="mt-1 font-mono text-[32px] font-extrabold tracking-tight text-hazard">
              {formatRp(computed.total)}
            </div>
            <p className="mt-1 text-[12px] text-white/70">
              *Angka diakumulasikan otomatis ke KPI & Executive Dashboard.
            </p>
          </div>
        </div>

        {/* Footer Tombol Struk */}
        {!locked && (
          <div className="border-t-2 border-white/20 bg-night-2 p-4">
            <button
              id="btn-save-loss"
              type="button"
              onClick={handleSaveLoss}
              className="tap flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-hazard text-[16px] font-bold text-night transition hover:brightness-105"
            >
              <Calculator size={20} strokeWidth={2.4} />
              Simpan Kalkulasi Kerugian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
