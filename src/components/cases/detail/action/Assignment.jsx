import { AlertTriangle } from "lucide-react";
import { PEOPLE, personById, dateOffset } from "../../../../data/cases";
import { formatDate } from "../../../../lib/format";
import { Panel, Field, SelectInput } from "../../../ui/form";
import ActionList from "./ActionList";

const QUICK_DEADLINES = [
  { label: "Hari Ini", days: 0 },
  { label: "Besok", days: 1 },
  { label: "+3 Hari", days: 3 },
  { label: "+7 Hari", days: 7 },
];

/** Penugasan PIC, deadline, dan daftar Corrective & Preventive Action. */
export default function Assignment({ data, onChange, overdue }) {
  const pic = personById(data.pic);

  return (
    <Panel step="B1" title="Penugasan & Tindakan" subtitle="Siapa yang mengerjakan, kapan selesai, dan apa saja yang dikerjakan.">
      <Field label="PIC (Person in Charge)" htmlFor="pic" required>
        <SelectInput id="pic" value={data.pic} onChange={(e) => onChange({ pic: e.target.value })}>
          <option value="">— Pilih penanggung jawab —</option>
          {PEOPLE.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.role}</option>
          ))}
        </SelectInput>
        {pic && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-line bg-canvas/60 p-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-mono text-[15px] font-bold text-white">{pic.initials}</span>
            <div>
              <div className="text-[16px] font-bold text-ink">{pic.name}</div>
              <div className="text-[14px] text-ink-2">{pic.role}</div>
            </div>
          </div>
        )}
      </Field>

      <Field label="Deadline" htmlFor="deadline" required>
        <input
          id="deadline"
          type="date"
          value={data.deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          className="h-12 w-full rounded-xl border-2 border-line bg-card px-3.5 font-mono text-[16px] text-ink outline-none focus:border-ink"
        />
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_DEADLINES.map((q) => {
            const val = dateOffset(q.days);
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => onChange({ deadline: val })}
                className={`tap h-11 rounded-lg border-2 text-[13.5px] font-bold ${
                  data.deadline === val ? "border-ink bg-ink text-white" : "border-line bg-card text-ink"
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
        {data.deadline && (
          <p className={`flex items-center gap-1.5 text-[15px] font-bold ${overdue ? "text-critical-ink" : "text-ink"}`}>
            {overdue && <AlertTriangle size={17} />}
            {formatDate(data.deadline)} {overdue && "— SUDAH LEWAT DEADLINE"}
          </p>
        )}
      </Field>

      <div className="space-y-5 border-t-2 border-line pt-4">
        <ActionList
          id="add-corrective"
          title="Corrective Action"
          desc="Perbaikan untuk masalah saat ini."
          items={data.corrective}
          onChange={(corrective) => onChange({ corrective })}
          placeholder="Contoh: Ganti bearing spindle"
          accent="bg-critical-ink"
        />
        <ActionList
          id="add-preventive"
          title="Preventive Action"
          desc="Pencegahan agar tidak terulang."
          items={data.preventive}
          onChange={(preventive) => onChange({ preventive })}
          placeholder="Contoh: Grease bearing tiap minggu"
          accent="bg-info"
        />
      </div>
    </Panel>
  );
}
