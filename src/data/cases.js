/* ─────────────────────────────────────────────────────────────
   Week 2 — Data Kasus (CAPTURE + RESOLVE)
   Semua nilai diinput manual oleh worker / engineer (tanpa IoT).
   Waktu dibuat relatif terhadap "sekarang" supaya status Overdue
   selalu realistis kapan pun demo dibuka.
   ───────────────────────────────────────────────────────────── */

const HOUR = 3600e3;
const NOW = Date.now();
/** ISO timestamp n jam yang lalu (negatif = masa depan) */
const hoursAgo = (h) => new Date(NOW - h * HOUR).toISOString();
/** "YYYY-MM-DD" (waktu lokal) dengan offset hari dari hari ini */
export const dateOffset = (days) => {
  const d = new Date(NOW + days * 24 * HOUR);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

let _uid = 0;
export const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${(_uid++).toString(36)}`;

/* ───────────── Master Data ───────────── */

export const CATEGORIES = [
  { id: "safety", label: "Safety / K3", desc: "Bahaya, nyaris celaka, APD, kebakaran" },
  { id: "machine", label: "Machine Issue", desc: "Mesin rusak, getar, bocor, panas, bunyi" },
  { id: "ops", label: "Operational Issue", desc: "Material kurang, antrean, proses terhambat" },
];

export const SEVERITIES = [
  { id: "low", label: "Low", id_label: "Rendah", desc: "Tidak mengganggu produksi" },
  { id: "medium", label: "Medium", id_label: "Sedang", desc: "Produksi melambat" },
  { id: "high", label: "High", id_label: "Tinggi", desc: "Mesin/area berhenti sebagian" },
  { id: "critical", label: "Critical", id_label: "Kritis", desc: "Bahaya jiwa / berhenti total" },
];

/** Status "lampu indikator": warna solid + teks tegas */
export const STATUSES = {
  open: { label: "Open", desc: "Laporan baru, belum ditangani", cls: "bg-info text-white" },
  in_progress: { label: "Dalam Proses", desc: "Sedang didiagnosis / diperbaiki", cls: "bg-hazard text-night" },
  waiting_verification: { label: "Menunggu Verifikasi", desc: "Perbaikan selesai, tunggu Supervisor/HSE", cls: "bg-warn text-white" },
  overdue: { label: "Overdue", desc: "Melewati batas waktu", cls: "bg-critical-ink text-white" },
  closed: { label: "Selesai • Verified", desc: "Sudah diverifikasi & ditutup", cls: "bg-done text-white" },
};

export const STATUS_FILTERS = [
  { id: "all", label: "Semua" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "Dalam Proses" },
  { id: "waiting_verification", label: "Tunggu Verifikasi" },
  { id: "overdue", label: "Overdue" },
  { id: "closed", label: "Selesai" },
];

export const MACHINES = [
  { code: "CNC-04", name: "CNC Milling Haas VF-4", location: "Lini 2 • Machining" },
  { code: "CNC-02", name: "CNC Lathe Mazak QT-200", location: "Lini 2 • Machining" },
  { code: "PRS-11", name: "Mesin Press Hidrolik 200 Ton", location: "Bengkel Press" },
  { code: "CMP-01", name: "Kompresor Udara Atlas Copco GA37", location: "Utility Room" },
  { code: "CNV-07", name: "Conveyor Packing Line 3", location: "Area Packing" },
  { code: "WLD-03", name: "Robot Welding Fanuc ARC", location: "Lini 1 • Welding" },
  { code: "BLR-01", name: "Boiler Steam 2 Ton", location: "Utility Room" },
  { code: "FLT-02", name: "Forklift Toyota 3 Ton", location: "Gudang B" },
  { code: "LN-04", name: "Lini Perakitan 4", location: "Perakitan L4" },
];

export const LOCATIONS = [
  "Lini 1 • Welding",
  "Lini 2 • Machining",
  "Perakitan L4",
  "Bengkel Press",
  "Area Packing",
  "Gudang B",
  "Utility Room",
  "Area Parkir / Luar Gedung",
];

export const PEOPLE = [
  { id: "budi", name: "Budi Santoso", role: "Mechanical Engineer Senior", initials: "BS" },
  { id: "agus", name: "Agus Wibowo", role: "Teknisi Maintenance", initials: "AW" },
  { id: "rina", name: "Rina Andriani", role: "Petugas HSE", initials: "RA" },
  { id: "dedi", name: "Dedi Purnomo", role: "Supervisor Produksi", initials: "DP", verifier: true },
  { id: "hendra", name: "Hendra Gunawan", role: "Supervisor Maintenance", initials: "HG", verifier: true },
  { id: "sutrisno", name: "Ir. Sutrisno", role: "Kepala HSE", initials: "SU", verifier: true },
];
export const VERIFIERS = PEOPLE.filter((p) => p.verifier);
export const personById = (id) => PEOPLE.find((p) => p.id === id);

export const FAILURE_CATEGORIES = [
  "Mekanikal (bearing, poros, gear)",
  "Elektrikal (motor, kabel, panel)",
  "Hidrolik / Pneumatik",
  "Pelumasan",
  "Kontrol / PLC / Software",
  "Human Error / Prosedur",
  "Material / Supply",
  "Lingkungan (debu, panas, air)",
];

/** Parameter standar mesin (diinput manual dari alat ukur genggam) */
export const STANDARD_PARAMS = [
  { key: "temperature", label: "Temperatur", unit: "°C", max: 70 },
  { key: "vibration", label: "Vibration", unit: "mm/s", max: 4.5 },
  { key: "pressure", label: "Pressure", unit: "bar", max: 8 },
  { key: "hours", label: "Operating Hours", unit: "jam" },
];

export const COMMON_SYMPTOMS = [
  "Getaran tidak normal",
  "Bunyi kasar / berisik",
  "Bocor oli",
  "Suhu terlalu panas",
  "Bau terbakar",
  "Mesin mati mendadak",
  "Nyaris celaka",
];

/* ───────────── Section Factories ───────────── */

export const emptyDiagnosis = () => ({
  params: { temperature: "", vibration: "", pressure: "", hours: "" },
  customParams: [],
  failureCategory: "",
  failureMode: "",
  rootCause: "",
  hseImpact: null, // "yes" | "no"
  hseRiskLevel: "",
  hseMitigation: "",
  altMethod: false,
  altSolution: "",
  altReason: "",
  altCondition: "",
  saved: false,
});

export const emptyAction = () => ({
  pic: "",
  deadline: "",
  corrective: [],
  preventive: [],
  evidence: [],
  resultNote: "",
  submitted: false,
});

export const emptyVerification = () => ({
  verifier: "",
  recurrence: null, // "yes" | "no"
  lessons: "",
  verifiedAt: null,
});

export const emptyLoss = () => ({
  downtimeHours: "",
  productionUnits: "",
  unitValue: 0,
  materialWaste: 0,
  laborCount: "",
  laborHours: "",
  laborRate: 50000,
  spareParts: [],
});

const item = (text, done = false) => ({ id: uid("act"), text, done });
const part = (name, qty, price) => ({ id: uid("sp"), name, qty: String(qty), price });

/* ───────────── Mock Kasus ───────────── */

export const INITIAL_CASES = [
  {
    id: "SL-0413",
    reportedAt: hoursAgo(1.2),
    machine: "WLD-03",
    location: "Lini 1 • Welding",
    category: "safety",
    severity: "critical",
    symptom: "Percikan las keluar dari tirai pelindung yang robek. Operator di sebelah tidak memakai face shield.",
    reporter: "Slamet (Operator Welding)",
    status: "open",
    recommendation: "SOP K3-07: Hentikan robot, pasang tirai las cadangan, wajib face shield radius 3 m.",
    diagnosis: emptyDiagnosis(),
    action: emptyAction(),
    verification: emptyVerification(),
    loss: emptyLoss(),
  },
  {
    id: "SL-0412",
    reportedAt: hoursAgo(5),
    machine: "CNC-04",
    location: "Lini 2 • Machining",
    category: "machine",
    severity: "critical",
    symptom: "Abnormal vibration pada spindle, bunyi dengung keras saat RPM di atas 3.000. Hasil potong bergelombang.",
    reporter: "Joko Susilo (Operator CNC)",
    status: "in_progress",
    recommendation: "Kasus #204: Ganti bearing spindle 6204 + cek alignment poros (berhasil 85% kasus serupa).",
    diagnosis: {
      ...emptyDiagnosis(),
      params: { temperature: "85", vibration: "7.2", pressure: "6.2", hours: "12450" },
      customParams: [{ id: uid("cp"), label: "Spindle RPM saat bergetar", value: "3200", unit: "rpm" }],
      failureCategory: "Mekanikal (bearing, poros, gear)",
      failureMode: "Keausan bearing spindle depan",
      rootCause: "Pelumasan bearing kurang karena jadwal grease terlewat 2 minggu, ditambah sedikit misalignment poros.",
      hseImpact: "yes",
      hseRiskLevel: "Sedang",
      hseMitigation: "Mesin dikunci (LOTO). Area dipasang garis pembatas. Operator dipindah ke CNC-02 sementara.",
      saved: true,
    },
    action: {
      ...emptyAction(),
      pic: "budi",
      deadline: dateOffset(0),
      corrective: [item("Ganti bearing spindle depan (SKF 6204-2RS)", true), item("Kalibrasi ulang alignment poros dengan dial gauge")],
      preventive: [item("Masukkan grease bearing ke jadwal PM mingguan"), item("Pasang stiker checklist getaran di panel mesin")],
    },
    verification: emptyVerification(),
    loss: {
      downtimeHours: "3",
      productionUnits: "400",
      unitValue: 2250,
      materialWaste: 2000000,
      laborCount: "4",
      laborHours: "2",
      laborRate: 50000,
      spareParts: [
        part("Bearing SKF 6204-2RS", 2, 450000),
        part("Seal kit spindle", 1, 350000),
        part("Grease Shell Gadus S2 (1 kg)", 1, 250000),
      ],
    },
  },
  {
    id: "SL-0411",
    reportedAt: hoursAgo(9),
    machine: "CMP-01",
    location: "Utility Room",
    category: "machine",
    severity: "high",
    symptom: "Tekanan angin turun ke 5 bar, kompresor sering trip sendiri setiap ±30 menit.",
    reporter: "Wawan (Teknisi Utility)",
    status: "open",
    recommendation: "Cek filter udara & sensor suhu oli kompresor (penyebab trip paling sering).",
    diagnosis: emptyDiagnosis(),
    action: emptyAction(),
    verification: emptyVerification(),
    loss: emptyLoss(),
  },
  {
    id: "SL-0410",
    reportedAt: hoursAgo(26),
    machine: "CNV-07",
    location: "Area Packing",
    category: "ops",
    severity: "medium",
    symptom: "Conveyor packing macet berulang, karton tersangkut di roller penggerak.",
    reporter: "Siti (Operator Packing)",
    status: "waiting_verification",
    recommendation: "Ganti roller penggerak yang aus & setel ulang tegangan belt.",
    diagnosis: {
      ...emptyDiagnosis(),
      params: { temperature: "42", vibration: "2.1", pressure: "", hours: "8800" },
      failureCategory: "Mekanikal (bearing, poros, gear)",
      failureMode: "Roller penggerak aus, permukaan licin",
      rootCause: "Roller sudah melewati umur pakai, belt kendor.",
      hseImpact: "no",
      saved: true,
    },
    action: {
      ...emptyAction(),
      pic: "agus",
      deadline: dateOffset(1),
      corrective: [item("Ganti roller penggerak", true), item("Setel ulang tegangan belt", true)],
      preventive: [item("Cek tegangan belt tiap awal shift", true)],
      evidence: [{ id: uid("ev"), name: "roller-baru-cnv07.jpg", url: "/evidence/cnv07-roller.jpg", type: "image/jpeg" }],
      resultNote: "Roller baru terpasang, uji jalan 1 jam tanpa macet. Belt tension 45 Hz.",
      submitted: true,
    },
    verification: emptyVerification(),
    loss: {
      ...emptyLoss(),
      downtimeHours: "1.5",
      productionUnits: "180",
      unitValue: 1500,
      laborCount: "2",
      laborHours: "1.5",
      spareParts: [part("Roller penggerak Ø60", 1, 650000)],
    },
  },
  {
    id: "SL-0409",
    reportedAt: hoursAgo(50),
    machine: "FLT-02",
    location: "Gudang B",
    category: "safety",
    severity: "high",
    symptom: "Nyaris celaka: forklift hampir menabrak pejalan kaki di tikungan lorong 3 (titik buta).",
    reporter: "Rina Andriani (HSE)",
    status: "in_progress",
    recommendation: "Kasus #098: Pasang cermin cembung + marka zebra + batas kecepatan 5 km/jam.",
    diagnosis: { ...emptyDiagnosis(), hseImpact: "yes", hseRiskLevel: "Tinggi", saved: true },
    action: {
      ...emptyAction(),
      pic: "rina",
      deadline: dateOffset(-1),
      corrective: [item("Pasang cermin cembung di tikungan lorong 3")],
      preventive: [item("Briefing ulang SOP forklift untuk semua driver")],
    },
    verification: emptyVerification(),
    loss: emptyLoss(),
  },
  {
    id: "SL-0407",
    reportedAt: hoursAgo(74),
    machine: "LN-04",
    location: "Perakitan L4",
    category: "ops",
    severity: "low",
    symptom: "Kekurangan kit baut M8, lini perakitan berhenti 25 menit.",
    reporter: "Dedi Purnomo (Supervisor)",
    status: "closed",
    recommendation: "Naikkan stok minimum kit baut di kanban.",
    diagnosis: { ...emptyDiagnosis(), failureCategory: "Material / Supply", failureMode: "Stok kanban habis", rootCause: "Kartu kanban hilang.", hseImpact: "no", saved: true },
    action: {
      ...emptyAction(),
      pic: "dedi",
      deadline: dateOffset(-2),
      corrective: [item("Isi ulang stok kit baut M8", true)],
      preventive: [item("Cetak ulang & laminasi kartu kanban", true)],
      resultNote: "Stok aman 2 shift.",
      submitted: true,
    },
    verification: { verifier: "hendra", recurrence: "no", lessons: "Kartu kanban wajib dilaminasi agar tidak hilang/rusak.", verifiedAt: hoursAgo(48) },
    loss: { ...emptyLoss(), downtimeHours: "0.4", productionUnits: "60", unitValue: 1500 },
  },
  {
    id: "SL-0405",
    reportedAt: hoursAgo(98),
    machine: "PRS-11",
    location: "Bengkel Press",
    category: "machine",
    severity: "high",
    symptom: "Kebocoran oli hidrolik di seal silinder utama. Sudah 3x terjadi dalam 30 hari.",
    reporter: "Agus Wibowo (Maintenance)",
    status: "in_progress",
    recommendation: "Ganti seal kit silinder + cek kekasaran batang piston.",
    diagnosis: { ...emptyDiagnosis(), params: { temperature: "68", vibration: "", pressure: "180", hours: "21030" }, failureCategory: "Hidrolik / Pneumatik", saved: true },
    action: { ...emptyAction(), pic: "agus", deadline: dateOffset(-2), corrective: [item("Ganti seal kit silinder utama")] },
    verification: emptyVerification(),
    loss: emptyLoss(),
  },
  {
    id: "SL-0403",
    reportedAt: hoursAgo(140),
    machine: "BLR-01",
    location: "Utility Room",
    category: "safety",
    severity: "medium",
    symptom: "Safety valve boiler rembes uap saat tekanan kerja normal.",
    reporter: "Wawan (Teknisi Utility)",
    status: "closed",
    recommendation: "Ganti safety valve, wajib uji tekanan ulang.",
    diagnosis: { ...emptyDiagnosis(), failureCategory: "Hidrolik / Pneumatik", failureMode: "Dudukan valve aus", hseImpact: "yes", hseRiskLevel: "Tinggi", hseMitigation: "Area boiler disterilkan, tekanan diturunkan.", saved: true },
    action: {
      ...emptyAction(),
      pic: "agus",
      deadline: dateOffset(-4),
      corrective: [item("Ganti safety valve baru", true)],
      preventive: [item("Uji pop-test safety valve tiap 6 bulan", true)],
      evidence: [{ id: uid("ev"), name: "safety-valve-blr01.jpg", url: "/evidence/blr01-valve.jpg", type: "image/jpeg" }],
      resultNote: "Valve baru terpasang, pop-test OK di 9,5 bar.",
      submitted: true,
    },
    verification: { verifier: "sutrisno", recurrence: "no", lessons: "Safety valve boiler wajib masuk jadwal pop-test 6 bulanan, bukan hanya saat rusak.", verifiedAt: hoursAgo(100) },
    loss: { ...emptyLoss(), downtimeHours: "4", spareParts: [part("Safety valve 1\" 10 bar", 1, 2750000)], laborCount: "2", laborHours: "3" },
  },
];

/* ───────────── Helpers ───────────── */

/** Status yang ditampilkan: otomatis "overdue" bila melewati deadline & belum ditutup */
export function getDisplayStatus(c) {
  if (c.status === "closed") return "closed";
  if (c.action?.deadline && c.status !== "waiting_verification") {
    const end = new Date(`${c.action.deadline}T23:59:59`).getTime();
    if (end < Date.now()) return "overdue";
  }
  return c.status;
}

export const machineByCode = (code) => MACHINES.find((m) => m.code === code);
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
export const severityById = (id) => SEVERITIES.find((s) => s.id === id);
