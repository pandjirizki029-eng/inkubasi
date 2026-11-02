import { Plus, Trash2, Gauge } from "lucide-react";
import { STANDARD_PARAMS, uid } from "../../../../data/cases";
import { toDec } from "../../../../lib/format";
import { Panel, Field, NumberInput, TextInput, Button } from "../../../ui/form";

/** Input parameter mesin terstruktur + parameter kustom (bisa tambah baris). */
export default function MachineParams({ data, onChange }) {
  const setParam = (key, value) => onChange({ params: { ...data.params, [key]: value } });
  const setCustom = (id, patch) =>
    onChange({ customParams: data.customParams.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const addCustom = () => onChange({ customParams: [...data.customParams, { id: uid("cp"), label: "", value: "", unit: "" }] });
  const removeCustom = (id) => onChange({ customParams: data.customParams.filter((p) => p.id !== id) });

  return (
    <Panel step="A1" title="Parameter Mesin" subtitle="Catat hasil ukur alat genggam saat pemeriksaan.">
      <div className="grid grid-cols-2 gap-3">
        {STANDARD_PARAMS.map((p) => {
          const val = data.params[p.key];
          const over = p.max && val !== "" && toDec(val) > p.max;
          return (
            <Field
              key={p.key}
              label={p.label}
              htmlFor={`param-${p.key}`}
              hint={p.max ? `Batas normal ≤ ${p.max} ${p.unit}` : "Total jam jalan"}
            >
              <NumberInput
                id={`param-${p.key}`}
                unit={p.unit}
                warn={over}
                value={val}
                onChange={(e) => setParam(p.key, e.target.value)}
                placeholder="0"
              />
              {over && <p className="text-[13px] font-bold text-critical-ink">▲ Melebihi batas normal</p>}
            </Field>
          );
        })}
      </div>

      {/* Parameter kustom */}
      {data.customParams.length > 0 && (
        <div className="space-y-3 border-t-2 border-line pt-4">
          <span className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
            <Gauge size={17} /> Parameter Lainnya
          </span>
          {data.customParams.map((p, i) => (
            <div key={p.id} className="space-y-2 rounded-xl border-2 border-line bg-canvas/60 p-3">
              <TextInput
                aria-label={`Nama parameter ${i + 1}`}
                value={p.label}
                onChange={(e) => setCustom(p.id, { label: e.target.value })}
                placeholder="Nama parameter (misal: Arus Motor)"
              />
              <div className="grid grid-cols-[1fr_96px] gap-2">
                <NumberInput aria-label="Nilai" value={p.value} onChange={(e) => setCustom(p.id, { value: e.target.value })} placeholder="Nilai" />
                <TextInput aria-label="Satuan" value={p.unit} onChange={(e) => setCustom(p.id, { unit: e.target.value })} placeholder="Satuan" />
              </div>
              <button
                type="button"
                onClick={() => removeCustom(p.id)}
                className="tap flex h-10 items-center gap-1.5 rounded-lg px-2 text-[14px] font-bold text-critical-ink"
              >
                <Trash2 size={16} /> Hapus parameter ini
              </button>
            </div>
          ))}
        </div>
      )}

      <Button tone="soft" size="md" icon={Plus} onClick={addCustom} className="w-full border-dashed">
        Tambah Parameter Lain
      </Button>
    </Panel>
  );
}
