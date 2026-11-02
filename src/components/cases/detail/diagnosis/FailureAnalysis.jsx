import { FAILURE_CATEGORIES } from "../../../../data/cases";
import { Panel, Field, SelectInput, TextInput, TextArea } from "../../../ui/form";

/** Analisis kerusakan: kategori, mode, dan dugaan akar masalah. */
export default function FailureAnalysis({ data, onChange }) {
  return (
    <Panel step="A2" title="Analisis Kerusakan" subtitle="Apa yang rusak, bagaimana rusaknya, dan kenapa.">
      <Field label="Failure Category" htmlFor="failure-category" required>
        <SelectInput id="failure-category" value={data.failureCategory} onChange={(e) => onChange({ failureCategory: e.target.value })}>
          <option value="">— Pilih kategori kerusakan —</option>
          {FAILURE_CATEGORIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Failure Mode" htmlFor="failure-mode" hint="Bentuk kerusakan yang terlihat.">
        <TextInput
          id="failure-mode"
          value={data.failureMode}
          onChange={(e) => onChange({ failureMode: e.target.value })}
          placeholder="Contoh: Keausan bearing spindle depan"
        />
      </Field>

      <Field label="Root Cause (Dugaan Penyebab Utama)" htmlFor="root-cause" required>
        <TextArea
          id="root-cause"
          rows={4}
          value={data.rootCause}
          onChange={(e) => onChange({ rootCause: e.target.value })}
          placeholder="Contoh: Pelumasan kurang karena jadwal grease terlewat 2 minggu"
        />
      </Field>
    </Panel>
  );
}
