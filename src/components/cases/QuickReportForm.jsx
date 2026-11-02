import { useState } from "react";
import { X, Send, Clock, Camera } from "lucide-react";
import {
  CATEGORIES, SEVERITIES, LOCATIONS, COMMON_SYMPTOMS,
  emptyDiagnosis, emptyAction, emptyVerification, emptyLoss, uid,
} from "../../data/cases";
import { useCaseStore } from "../../state/caseStore";
import { toLocalInput } from "../../lib/format";
import { Field, TextArea, SelectInput, ChoiceGroup, Button } from "../ui/form";
import { CATEGORY_ICON } from "./badges";
import MachinePicker from "./MachinePicker";

const SEVERITY_ACTIVE = {
  low: "border-ok-ink bg-ok-ink text-white",
  medium: "border-hazard bg-hazard text-night",
  high: "border-warn bg-warn text-white",
  critical: "border-critical-ink bg-critical-ink text-white",
};

const initialForm = () => ({
  machine: "",
  location: "",
  occurredAt: toLocalInput(),
  category: "",
  symptom: "",
  severity: "",
  photos: [],
});

/** Modal "Buat Laporan Baru" — dirancang selesai < 1 menit. */
export default function QuickReportForm({ onClose, onSubmitted }) {
  const { addCase, nextId } = useCaseStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  const addSymptom = (s) =>
    set({ symptom: form.symptom ? (form.symptom.includes(s) ? form.symptom : `${form.symptom.trim()}, ${s.toLowerCase()}`) : s });

  const addPhotos = (files) =>
    set({ photos: [...form.photos, ...Array.from(files).map((f) => ({ id: uid("ph"), name: f.name, url: URL.createObjectURL(f), type: f.type }))] });

  const validate = () => {
    const e = {};
    if (!form.machine) e.machine = "Pilih mesin terlebih dahulu";
    if (!form.location) e.location = "Pilih lokasi area";
    if (!form.category) e.category = "Pilih kategori masalah";
    if (form.symptom.trim().length < 5) e.symptom = "Tulis gejala yang dilihat/didengar";
    if (!form.severity) e.severity = "Pilih tingkat keparahan";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const id = nextId;
    addCase({
      id,
      reportedAt: new Date(form.occurredAt).toISOString(),
      machine: form.machine,
      location: form.location,
      category: form.category,
      severity: form.severity,
      symptom: form.symptom.trim(),
      reporter: "Anda (Operator Shift B)",
      status: "open",
      recommendation: "",
      diagnosis: emptyDiagnosis(),
      action: { ...emptyAction(), evidence: form.photos },
      verification: emptyVerification(),
      loss: emptyLoss(),
    });
    onSubmitted(id);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        noValidate
        aria-labelledby="quick-report-title"
        className="flex max-h-[94%] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-canvas shadow-2xl animate-rise"
      >
        {/* Header modal */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-line bg-card px-4 py-4">
          <div>
            <span className="font-mono text-[12px] font-semibold uppercase tracking-widest text-ink-2">Laporan Cepat • {nextId}</span>
            <h2 id="quick-report-title" className="mt-0.5 text-[22px] font-bold leading-tight text-ink">Buat Laporan Baru</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-ink-2">
              <Clock size={14} /> 6 isian singkat • kurang dari 1 menit
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tap flex h-11 shrink-0 items-center gap-1 rounded-xl border-2 border-line bg-card px-3 text-[14px] font-bold text-ink"
          >
            <X size={18} /> Tutup
          </button>
        </div>

        {/* Isi form (scroll) */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          <Field label="1. Identitas Mesin" htmlFor="qr-machine" required error={errors.machine}>
            <MachinePicker
              id="qr-machine"
              value={form.machine}
              error={errors.machine}
              onSelect={(m) => set({ machine: m.code, location: m.location })}
            />
          </Field>

          <Field label="2. Lokasi Area" htmlFor="qr-location" required hint="Terisi otomatis dari mesin, bisa diubah." error={errors.location}>
            <SelectInput id="qr-location" value={form.location} onChange={(e) => set({ location: e.target.value })}>
              <option value="">— Pilih lokasi —</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </SelectInput>
          </Field>

          <Field label="3. Tanggal & Waktu Kejadian" htmlFor="qr-time" required>
            <div className="flex gap-2">
              <input
                id="qr-time"
                type="datetime-local"
                value={form.occurredAt}
                onChange={(e) => set({ occurredAt: e.target.value })}
                className="h-12 min-w-0 flex-1 rounded-xl border-2 border-line bg-card px-3 font-mono text-[15px] text-ink outline-none focus:border-ink"
              />
              <Button size="md" tone="soft" onClick={() => set({ occurredAt: toLocalInput() })}>
                Sekarang
              </Button>
            </div>
          </Field>

          <Field label="4. Kategori Masalah" required error={errors.category}>
            <ChoiceGroup
              name="qr-category"
              value={form.category}
              onChange={(v) => set({ category: v })}
              options={CATEGORIES.map((c) => ({ ...c, icon: CATEGORY_ICON[c.id] }))}
            />
          </Field>

          <Field label="5. Gejala / Kelainan yang Diamati" htmlFor="qr-symptom" required hint="Ketuk contoh di bawah untuk mengisi lebih cepat." error={errors.symptom}>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => addSymptom(s)}
                  className="tap h-10 rounded-lg border-2 border-line bg-card px-3 text-[14px] font-semibold text-ink hover:border-ink"
                >
                  + {s}
                </button>
              ))}
            </div>
            <TextArea
              id="qr-symptom"
              rows={3}
              value={form.symptom}
              onChange={(e) => set({ symptom: e.target.value })}
              placeholder="Contoh: Spindle bergetar keras dan berbunyi dengung saat RPM tinggi"
            />
          </Field>

          <Field label="6. Tingkat Keparahan" required error={errors.severity}>
            <ChoiceGroup
              name="qr-severity"
              columns={2}
              value={form.severity}
              onChange={(v) => set({ severity: v })}
              options={SEVERITIES.map((s) => ({ id: s.id, label: s.label, desc: s.desc, activeCls: SEVERITY_ACTIVE[s.id] }))}
            />
          </Field>

          {/* Foto opsional */}
          <Field label="Foto Kejadian (opsional)">
            <label className="tap flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-3 bg-card text-[15px] font-bold text-ink hover:border-ink">
              <Camera size={20} /> Ambil / Pilih Foto
              <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
            </label>
            {form.photos.length > 0 && (
              <p className="text-[14px] font-semibold text-done">✓ {form.photos.length} foto terlampir</p>
            )}
          </Field>
        </div>

        {/* Footer tombol kirim */}
        <div className="border-t-2 border-line bg-card px-4 py-3">
          {errorCount > 0 && (
            <p className="mb-2 rounded-lg bg-critical/10 px-3 py-2 text-[14px] font-semibold text-critical-ink">
              ⚠ Masih ada {errorCount} isian wajib yang belum lengkap.
            </p>
          )}
          <Button type="submit" icon={Send} className="w-full">
            Kirim Laporan
          </Button>
        </div>
      </form>
    </div>
  );
}
