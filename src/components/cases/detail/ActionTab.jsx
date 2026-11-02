import { getDisplayStatus } from "../../../data/cases";
import Assignment from "./action/Assignment";
import EvidenceUpload from "./action/EvidenceUpload";
import VerificationPanel from "./action/VerificationPanel";

/** Tab B: Modul Corrective Action & Verifikasi (Tahap RESOLVE - Tindakan) */
export default function ActionTab({
  c,
  onChange,
  onUpdateVerification,
  onUpdateCase,
  onToast,
}) {
  const currentStatus = getDisplayStatus(c);
  const overdue = currentStatus === "overdue";

  // Saat PIC submit hasil perbaikan & bukti foto untuk diverifikasi
  const handleSubmitEvidence = () => {
    onChange({ submitted: true });
    onUpdateCase({ status: "waiting_verification" });
    onToast("Bukti perbaikan dikirim. Menunggu verifikasi Supervisor / HSE.");
  };

  // Saat Supervisor / HSE memverifikasi & menutup kasus
  const handleVerifyClose = () => {
    onUpdateVerification({ verifiedAt: new Date().toISOString() });
    onUpdateCase({ status: "closed" });
    onToast("Kasus berhasil diverifikasi & ditutup resmi!");
  };

  // Jika recurrence = "yes", kembalikan ke status in_progress
  const handleReopen = () => {
    onUpdateCase({ status: "in_progress" });
    onChange({ submitted: false });
    onToast("Kasus dikembalikan ke status Dalam Proses untuk perbaikan ulang.");
  };

  return (
    <div className="space-y-4">
      {/* Sub-modul B1: Assignment & Tracking */}
      <Assignment
        data={c.action}
        onChange={onChange}
        overdue={overdue}
      />

      {/* Sub-modul B2: Penyelesaian & Bukti (Evidence) */}
      <EvidenceUpload
        data={c.action}
        status={c.status}
        onChange={onChange}
        onSubmit={handleSubmitEvidence}
      />

      {/* Sub-modul B3: Panel Verifikasi & Penutupan (Khusus Supervisor/HSE) */}
      <VerificationPanel
        c={c}
        onChange={onUpdateVerification}
        onClose={handleVerifyClose}
        onReopen={handleReopen}
      />
    </div>
  );
}
