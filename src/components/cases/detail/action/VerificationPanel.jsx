import { useState } from "react";
import { Lock, ShieldCheck, RotateCcw, BookOpen, BadgeCheck } from "lucide-react";
import { VERIFIERS, personById } from "../../../../data/cases";
import { formatDateTime } from "../../../../lib/format";
import { Panel, Field, SelectInput, YesNo, TextArea, Button } from "../../../ui/form";

/** Panel Verifikasi & Penutupan — khusus Supervisor / HSE. */
export default function VerificationPanel({ c, onChange, onClose, onReopen }) {
  const v = c.verification;
  const [tried, setTried] = useState(false);
  const badge = (
    <span className="shrink-0 rounded-md bg-warn px-2 py-1 text-[11.5px] font-bold uppercase tracking-wide text-white">
      Supervisor / HSE
    </span>
  );

  /* 1) Sudah ditutup — tampilkan ringkasan hijau */
  if (c.status === "closed") {
    const by = personById(v.verifier);
    return (
      <Panel step="B3" title="Verifikasi & Penutupan" badge={badge}>
        <div className="rounded-2xl bg-done p-4 text-white">
          <BadgeCheck size={36} />
          <p className="mt-2 text-[20px] font-bold leading-tight">Kasus Selesai & Terverifikasi</p>
          <p className="mt-1 text-[14.5px] text-white/85">
            oleh {by?.name ?? "—"} ({by?.role}) • {formatDateTime(v.verifiedAt)}
          </p>
        </div>
        <dl className="space-y-3 text-[15px]">
          <div>
            <dt className="font-semibold text-ink-2">Masalah kembali terjadi?</dt>
            <dd className="font-bold text-ink">{v.recurrence === "yes" ? "Ya" : "Tidak"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-ink-2"><BookOpen size={15} /> Lessons Learned (tersimpan di Knowledge Base)</dt>
            <dd className="mt-1 rounded-xl border-2 border-ai-ink/30 bg-ai/10 p-3 leading-snug text-ink">{v.lessons}</dd>
          </div>
        </dl>
      </Panel>
    );
  }

  /* 2) Belum ada kiriman dari PIC — terkunci */
  if (c.status !== "waiting_verification") {
    return (
      <Panel step="B3" title="Verifikasi & Penutupan" badge={badge}>
        <div className="flex items-start gap-3 rounded-xl border-2 border-dashed border-line bg-canvas p-4">
          <Lock size={24} className="mt-0.5 shrink-0 text-ink-2" />
          <div>
            <p className="text-[16px] font-bold text-ink">Panel belum aktif</p>
            <p className="mt-1 text-[14.5px] leading-snug text-ink-2">
              Akan terbuka setelah PIC menekan tombol <b>"Kirim untuk Verifikasi"</b> di bagian B2.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  /* 3) Menunggu verifikasi — form aktif */
  const canClose = v.verifier && v.recurrence === "no" && v.lessons.trim().length >= 10;
  const handleClose = () => {
    setTried(true);
    if (canClose) onClose();
  };

  return (
    <Panel step="B3" title="Verifikasi & Penutupan" subtitle="Periksa hasil perbaikan di lapangan sebelum menutup kasus." badge={badge}>
      <Field label="Nama Verifikator" htmlFor="verifier" required error={tried && !v.verifier ? "Pilih nama verifikator" : null}>
        <SelectInput id="verifier" value={v.verifier} onChange={(e) => onChange({ verifier: e.target.value })}>
          <option value="">— Pilih Supervisor / HSE —</option>
          {VERIFIERS.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.role}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Apakah masalah kembali terjadi (Recurrence)?" required error={tried && !v.recurrence ? "Pilih Ya atau Tidak" : null}>
        <YesNo name="recurrence" value={v.recurrence} onChange={(val) => onChange({ recurrence: val })} yesLabel="Ya, terjadi lagi" noLabel="Tidak terjadi lagi" />
      </Field>

      {v.recurrence === "yes" && (
        <div className="space-y-3 rounded-xl border-2 border-critical-ink bg-critical/10 p-3.5 animate-rise">
          <p className="text-[15px] font-bold leading-snug text-critical-ink">
            Kasus tidak bisa ditutup bila masalah masih terjadi. Kembalikan ke PIC untuk perbaikan ulang.
          </p>
          <Button tone="danger" icon={RotateCcw} className="w-full" onClick={onReopen}>
            Kembalikan ke PIC
          </Button>
        </div>
      )}

      <Field
        label="Lessons Learned"
        htmlFor="lessons"
        required
        hint="Pembelajaran ini disimpan ke Knowledge Base untuk engineer berikutnya."
        error={tried && v.lessons.trim().length < 10 ? "Wajib diisi (minimal 10 karakter)" : null}
      >
        <TextArea
          id="lessons"
          rows={4}
          value={v.lessons}
          onChange={(e) => onChange({ lessons: e.target.value })}
          placeholder="Contoh: Bearing spindle CNC wajib di-grease mingguan; gunakan tipe sealed di area berdebu."
        />
      </Field>

      <button
        id="btn-verify-close"
        type="button"
        onClick={handleClose}
        disabled={v.recurrence === "yes"}
        className="tap flex h-16 w-full items-center justify-center gap-2.5 rounded-xl bg-done text-[18px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(21,128,61,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShieldCheck size={24} strokeWidth={2.4} /> Verifikasi & Tutup Kasus
      </button>
    </Panel>
  );
}
