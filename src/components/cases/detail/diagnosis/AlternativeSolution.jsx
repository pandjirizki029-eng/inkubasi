import { BookOpen } from "lucide-react";
import { Panel, Field, BigCheckbox, TextArea } from "../../../ui/form";

/**
 * Conditional UI: solusi alternatif.
 * Jika engineer memakai metode berbeda dari standar, wajib dicatat alasannya
 * agar Knowledge Base belajar dari pengalaman lapangan.
 */
export default function AlternativeSolution({ data, onChange, recommendation }) {
  return (
    <Panel step="A4" title="Metode Perbaikan" subtitle="Bandingkan dengan rekomendasi standar / kasus sebelumnya.">
      {/* Rekomendasi standar sebagai pembanding */}
      <div className="rounded-xl border-2 border-ai-ink/30 bg-ai/10 p-3.5">
        <p className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-ai-ink">
          <BookOpen size={15} /> Rekomendasi Standar
        </p>
        <p className="mt-1 text-[15px] leading-snug text-ink">
          {recommendation || "Belum ada rekomendasi di Knowledge Base untuk kasus ini."}
        </p>
      </div>

      <BigCheckbox
        id="alt-method"
        checked={data.altMethod}
        onChange={(v) => onChange({ altMethod: v })}
        label="Saya menggunakan metode perbaikan berbeda dari standar/rekomendasi sebelumnya"
        desc="Centang jika cara perbaikan Anda tidak sama dengan rekomendasi di atas."
      />

      {data.altMethod && (
        <div className="space-y-4 border-l-4 border-hazard pl-3.5 animate-rise">
          <Field label="1. Solusi yang dipilih" htmlFor="alt-solution" required>
            <TextArea
              id="alt-solution"
              value={data.altSolution}
              onChange={(e) => onChange({ altSolution: e.target.value })}
              placeholder="Contoh: Ganti bearing tipe sealed 6204-2RS, bukan open type"
            />
          </Field>
          <Field label="2. Alasan memilih solusi tersebut" htmlFor="alt-reason" required>
            <TextArea
              id="alt-reason"
              value={data.altReason}
              onChange={(e) => onChange({ altReason: e.target.value })}
              placeholder="Contoh: Area banyak debu chip, tipe sealed lebih tahan"
            />
          </Field>
          <Field label="3. Kondisi spesifik saat pemeriksaan" htmlFor="alt-condition" required>
            <TextArea
              id="alt-condition"
              value={data.altCondition}
              onChange={(e) => onChange({ altCondition: e.target.value })}
              placeholder="Contoh: Housing bearing ada goresan, coolant bocor ke area spindle"
            />
          </Field>
        </div>
      )}
    </Panel>
  );
}
