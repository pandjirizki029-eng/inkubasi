import { useState } from "react";
import { Save, ArrowRight } from "lucide-react";
import { Button } from "../../ui/form";
import MachineParams from "./diagnosis/MachineParams";
import FailureAnalysis from "./diagnosis/FailureAnalysis";
import HseRisk from "./diagnosis/HseRisk";
import AlternativeSolution from "./diagnosis/AlternativeSolution";

function validateDiagnosis(d) {
  const missing = [];
  if (!d.failureCategory) missing.push("Failure Category");
  if (!d.rootCause.trim()) missing.push("Root Cause");
  if (!d.hseImpact) missing.push("Dampak K3 (Ya/Tidak)");
  if (d.hseImpact === "yes" && !d.hseRiskLevel) missing.push("Tingkat Risiko K3");
  if (d.hseImpact === "yes" && !d.hseMitigation.trim()) missing.push("Catatan Mitigasi");
  if (d.altMethod && (!d.altSolution.trim() || !d.altReason.trim() || !d.altCondition.trim()))
    missing.push("3 isian Solusi Alternatif");
  return missing;
}

/** Tab A — Form Parameter & Diagnosis Engineering */
export default function DiagnosisTab({ c, onChange, onUpdateCase, onToast, onNext }) {
  const d = c.diagnosis;
  const [missing, setMissing] = useState([]);
  const locked = c.status === "closed";

  const save = (goNext) => {
    const m = validateDiagnosis(d);
    setMissing(m);
    if (m.length) return;
    onChange({ saved: true });
    if (c.status === "open") onUpdateCase({ status: "in_progress" });
    onToast(`Diagnosis ${c.id} tersimpan`);
    if (goNext) onNext();
  };

  return (
    <fieldset disabled={locked} className="space-y-4">
      <MachineParams data={d} onChange={onChange} />
      <FailureAnalysis data={d} onChange={onChange} />
      <HseRisk data={d} onChange={onChange} />
      <AlternativeSolution data={d} onChange={onChange} recommendation={c.recommendation} />

      {!locked && (
        <div className="space-y-2 rounded-2xl border-2 border-line bg-card p-4">
          {missing.length > 0 && (
            <div className="rounded-xl bg-critical/10 p-3 text-[14px] text-critical-ink">
              <p className="font-bold">⚠ Lengkapi dulu isian berikut:</p>
              <ul className="mt-1 list-inside list-disc">
                {missing.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          )}
          <Button icon={Save} tone="soft" className="w-full" onClick={() => save(false)}>
            Simpan Diagnosis
          </Button>
          <Button iconRight={ArrowRight} className="w-full" onClick={() => save(true)}>
            Simpan & Lanjut ke Tindakan
          </Button>
        </div>
      )}
    </fieldset>
  );
}
