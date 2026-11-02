import { Camera, FileText, Trash2, Send, CheckCircle2 } from "lucide-react";
import { uid } from "../../../../data/cases";
import { Panel, Field, TextArea, Button } from "../../../ui/form";

/** Upload bukti perbaikan (foto/dokumen) + catatan hasil + kirim ke verifikator. */
export default function EvidenceUpload({ data, onChange, onSubmit, status }) {
  const addFiles = (files) => {
    const next = Array.from(files).map((f) => ({ id: uid("ev"), name: f.name, url: URL.createObjectURL(f), type: f.type }));
    onChange({ evidence: [...data.evidence, ...next] });
  };
  const remove = (id) => onChange({ evidence: data.evidence.filter((e) => e.id !== id) });

  const missing = [];
  if (!data.pic) missing.push("Pilih PIC");
  if (data.corrective.length === 0) missing.push("Minimal 1 Corrective Action");
  if (data.evidence.length === 0) missing.push("Upload minimal 1 bukti");
  if (!data.resultNote.trim()) missing.push("Isi catatan hasil perbaikan");

  const submitted = status === "waiting_verification" || status === "closed";

  return (
    <Panel step="B2" title="Penyelesaian & Bukti" subtitle="Foto sesudah perbaikan agar Supervisor/HSE bisa memverifikasi.">
      {/* Kotak upload besar */}
      <label
        htmlFor="evidence-input"
        className="tap flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-ink-3 bg-canvas p-5 text-center transition hover:border-ink hover:bg-card"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-white">
          <Camera size={28} />
        </span>
        <span className="text-[17px] font-bold leading-snug text-ink">Klik di sini untuk upload foto bukti perbaikan</span>
        <span className="text-[14px] text-ink-2">Foto (JPG/PNG) atau dokumen PDF • bisa lebih dari satu</span>
        <input
          id="evidence-input"
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {data.evidence.length > 0 && (
        <div>
          <p className="mb-2 text-[15px] font-bold text-done">✓ {data.evidence.length} bukti terlampir</p>
          <div className="grid grid-cols-2 gap-2">
            {data.evidence.map((e) => (
              <figure key={e.id} className="overflow-hidden rounded-xl border-2 border-line bg-card">
                {e.type?.startsWith("image") ? (
                  <img src={e.url} alt={`Bukti: ${e.name}`} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-canvas text-ink-2">
                    <FileText size={36} />
                  </div>
                )}
                <figcaption className="space-y-1 p-2">
                  <p className="truncate text-[13px] font-medium text-ink">{e.name}</p>
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    className="tap flex h-9 items-center gap-1 text-[13px] font-bold text-critical-ink"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <Field label="Catatan Hasil Setelah Perbaikan" htmlFor="result-note" required>
        <TextArea
          id="result-note"
          value={data.resultNote}
          onChange={(e) => onChange({ resultNote: e.target.value })}
          placeholder="Contoh: Uji jalan 1 jam, vibration turun ke 2,1 mm/s, tidak ada bunyi."
        />
      </Field>

      {submitted ? (
        <p className="flex items-center gap-2 rounded-xl border-2 border-done bg-done/10 p-3.5 text-[15px] font-bold text-done">
          <CheckCircle2 size={22} /> Bukti sudah dikirim ke Supervisor / HSE
        </p>
      ) : (
        <div className="space-y-2">
          {missing.length > 0 && (
            <ul className="space-y-1 rounded-xl bg-canvas p-3 text-[14px] text-ink-2">
              <li className="font-bold text-ink">Sebelum kirim, lengkapi:</li>
              {missing.map((m) => <li key={m}>☐ {m}</li>)}
            </ul>
          )}
          <Button icon={Send} className="w-full" disabled={missing.length > 0} onClick={onSubmit}>
            Kirim untuk Verifikasi
          </Button>
        </div>
      )}
    </Panel>
  );
}
