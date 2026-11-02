import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Panel, Field, YesNo, ChoiceGroup, TextArea } from "../../../ui/form";

const RISK_LEVELS = [
  { id: "Rendah", label: "Rendah", activeCls: "border-ok-ink bg-ok-ink text-white" },
  { id: "Sedang", label: "Sedang", activeCls: "border-hazard bg-hazard text-night" },
  { id: "Tinggi", label: "Tinggi", activeCls: "border-critical-ink bg-critical-ink text-white" },
];

/** Integrasi K3 — apakah masalah mesin berdampak pada keselamatan kerja? */
export default function HseRisk({ data, onChange }) {
  return (
    <Panel
      step="A3"
      title="Risiko K3 (HSE Risk Assessment)"
      subtitle="Wajib diisi untuk menjaga keselamatan tim di lapangan."
    >
      <Field label="Apakah masalah ini berdampak pada keselamatan kerja?" required>
        <YesNo
          name="hse-impact"
          value={data.hseImpact}
          onChange={(v) => onChange({ hseImpact: v })}
          yesLabel="Ya, ada risiko"
          noLabel="Tidak ada risiko"
        />
      </Field>

      {data.hseImpact === "yes" && (
        <div className="space-y-4 rounded-xl border-2 border-critical-ink/40 bg-critical/5 p-3.5 animate-rise">
          <p className="flex items-center gap-2 text-[15px] font-bold text-critical-ink">
            <ShieldAlert size={20} /> Isi tingkat risiko & langkah pengamanan
          </p>
          <Field label="Tingkat Risiko K3" required>
            <ChoiceGroup
              name="hse-level"
              columns={3}
              size="md"
              value={data.hseRiskLevel}
              onChange={(v) => onChange({ hseRiskLevel: v })}
              options={RISK_LEVELS}
            />
          </Field>
          <Field label="Catatan Mitigasi Risiko" htmlFor="hse-mitigation" required hint="Contoh: LOTO, garis pembatas, APD wajib.">
            <TextArea
              id="hse-mitigation"
              value={data.hseMitigation}
              onChange={(e) => onChange({ hseMitigation: e.target.value })}
              placeholder="Langkah pengamanan yang sudah/akan dilakukan…"
            />
          </Field>
        </div>
      )}

      {data.hseImpact === "no" && (
        <p className="flex items-center gap-2 rounded-xl border-2 border-done/40 bg-done/10 p-3 text-[15px] font-semibold text-done">
          <ShieldCheck size={20} /> Tidak ada dampak keselamatan. Tetap gunakan APD standar.
        </p>
      )}
    </Panel>
  );
}
