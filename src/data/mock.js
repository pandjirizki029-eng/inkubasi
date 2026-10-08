/* Data operasional tiruan — seluruh nilai diinput manual oleh teknisi lapangan (tanpa sensor/IoT). */

export const PLANTS = [
  "Pabrik 02 • Lini Perakitan 4",
  "Pabrik 02 • Lini Perakitan 2",
  "Pabrik 01 • Bengkel Pres",
];

export const FILTERS = [
  { id: "all", label: "Semua Masalah" },
  { id: "safety", label: "K3 / Keselamatan" },
  { id: "machine", label: "Masalah Mesin" },
  { id: "ops", label: "Operasional" },
];

export const LOSS_BREAKDOWN = [
  { key: "Waktu Henti", value: 2250000, color: "bg-critical", text: "text-critical" },
  { key: "Material", value: 1050000, color: "bg-hazard", text: "text-hazard" },
  { key: "Suku Cadang", value: 980000, color: "bg-ai", text: "text-ai" },
  { key: "Tenaga Kerja", value: 520000, color: "bg-ok", text: "text-ok" },
];

export const DOWNTIME_TREND = [40, 95, 60, 120, 80, 150, 195]; // menit, 7 hari terakhir

export const RECURRING = [
  { code: "CNC 04", fault: "Getaran", count: 4 },
  { code: "PRS 11", fault: "Kebocoran hidrolik", count: 3 },
];

export const CASES = [
  {
    id: "SL 0412",
    category: "machine",
    priority: true,
    code: "CNC 04",
    area: "Lini 2",
    severity: "Kritis",
    symptom: "Getaran Tidak Normal",
    params: [
      { k: "Getaran", v: "7.2 mm/dtk", limit: "> 4.5" },
      { k: "Suhu", v: "85°C", limit: "> 70" },
    ],
    rootCause: "Dugaan Keausan Bantalan & Ketidaksejajaran Poros",
    pic: { name: "Budi S.", role: "ME Senior", initials: "BS" },
    deadlineHour: 16,
    action: "Ganti bantalan serta kalibrasi ulang kelurusan poros",
  },
  {
    id: "SL 0409",
    category: "safety",
    code: "FLT 02",
    area: "Gudang B",
    severity: "Sedang",
    symptom: "Nyaris celaka titik buta forklift di lorong 3",
    pic: { name: "Rina A.", role: "Petugas K3", initials: "RA" },
    status: "Sedang Diinvestigasi",
  },
  {
    id: "SL 0407",
    category: "ops",
    code: "LN 04",
    area: "Perakitan L4",
    severity: "Rendah",
    symptom: "Kekurangan material kit pengencang M8, 25 menit terhenti",
    pic: { name: "Dedi P.", role: "Supervisor Produksi", initials: "DP" },
    status: "Tindakan Ditugaskan",
  },
  {
    id: "SL 0405",
    category: "machine",
    code: "PRS 11",
    area: "Bengkel Pres",
    severity: "Tinggi",
    symptom: "Kebocoran oli hidrolik pada sil silinder utama berulang",
    pic: { name: "Agus W.", role: "Teknisi Pemeliharaan", initials: "AW" },
    status: "Menunggu Suku Cadang",
  },
];

export const formatRp = (n) => "Rp" + n.toLocaleString("id-ID");
