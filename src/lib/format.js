/* Helper format & perhitungan — dipakai lintas modul Week 2 */

/** "Rp4.800.000" — selalu dibulatkan, format id-ID */
export const formatRp = (n) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

/** Parse angka dari input teks (mendukung koma desimal ala Indonesia). */
export const toNum = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v ?? "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Parse angka desimal biasa (titik ATAU koma sebagai desimal, tanpa pemisah ribuan). */
export const toDec = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const pad = (n) => String(n).padStart(2, "0");

/** "Sen, 02 Nov 2026" */
export function formatDate(input) {
  if (!input) return "—";
  const d = typeof input === "string" && input.length === 10 ? new Date(`${input}T00:00:00`) : new Date(input);
  return `${DAYS[d.getDay()]}, ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "02 Nov 2026 • 14:05" */
export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "2 jam lalu" — bahasa lapangan, mudah dibaca sekilas */
export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 1) return "baru saja";
  if (diff < 60) return `${Math.floor(diff)} menit lalu`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)} jam lalu`;
  return `${Math.floor(diff / 1440)} hari lalu`;
}

/** Nilai untuk <input type="datetime-local"> dari Date/ISO */
export function toLocalInput(input = new Date()) {
  const d = new Date(input);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Hitung seluruh komponen Operational Loss dari data form. */
export function computeLoss(loss) {
  const units = toDec(loss.productionUnits);
  const production = units * toNum(loss.unitValue);
  const material = toNum(loss.materialWaste);
  const laborCount = toDec(loss.laborCount);
  const laborHours = toDec(loss.laborHours);
  const labor = laborCount * laborHours * toNum(loss.laborRate);
  const parts = (loss.spareParts || []).map((p) => ({ ...p, subtotal: toDec(p.qty) * toNum(p.price) }));
  const spare = parts.reduce((s, p) => s + p.subtotal, 0);
  return {
    downtimeHours: toDec(loss.downtimeHours),
    units,
    production,
    material,
    laborCount,
    laborHours,
    labor,
    parts,
    spare,
    total: Math.round(production + material + labor + spare),
  };
}
