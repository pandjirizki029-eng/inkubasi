import { useState } from "react";
import {
  Menu, X, ArrowRight, ArrowUpRight
} from "lucide-react";
import { Tag, SectionTag, PillButton, RoundButton, Logo } from "../ui/primitives";

const METRICS = [
  { value: "35%", label: "Penurunan Waktu Henti", desc: "Rata rata penurunan downtime di lapangan" },
  { value: "0", label: "Ketergantungan Sensor", desc: "100% didorong laporan teknisi dan operator lapangan" },
  { value: "100%", label: "Retensi Pengetahuan", desc: "Memori teknis organisasi tersimpan utuh" },
];

const PILLARS = [
  {
    n: "01",
    title: "Catat",
    desc: "Pelaporan langsung di lapangan untuk insiden keselamatan dan anomali mesin. Pengumpulan data tanpa hambatan dirancang khusus untuk teknisi lini.",
    tag: "Masukan Lapangan",
  },
  {
    n: "02",
    title: "Selesaikan",
    desc: "Diagnosis akar masalah yang terarah serta pelacakan tindakan perbaikan terverifikasi dengan bukti foto dokumentasi.",
    tag: "Rekayasa Teknis",
  },
  {
    n: "03",
    title: "Pelajari & Cegah",
    desc: "Pencocokan insiden serupa berbasis memori kasus masa lalu, mengubah potensi kerugian menjadi kecerdasan organisasi.",
    tag: "Mesin Memori",
  },
];

export default function LandingPage({ onOpenDashboard }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-hazard selection:text-night">
      {/* ─── Bar Navigasi Atas ─── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-canvas/90 px-5 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-2">
          <Tag tone="neutral">MVP v1.0</Tag>
          <RoundButton
            icon={menuOpen ? X : Menu}
            label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-line bg-canvas p-6 shadow-2xl animate-rise">
          <nav className="flex flex-col gap-4">
            <span className="mono-label text-ink-3">// Navigasi</span>
            {["Arsitektur Platform", "Kerangka Operasional", "Spesifikasi Uji Coba", "Kontak"].map((item, idx) => (
              <a
                key={item}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-line pb-3 text-lg font-semibold tracking-tight text-ink hover:text-hazard"
              >
                <span>{item}</span>
                <span className="mono-label text-ink-3">0{idx + 1}</span>
              </a>
            ))}
            <div className="pt-2">
              <PillButton tone="dark" onClick={onOpenDashboard}>
                Buka MVP Operasional
              </PillButton>
            </div>
          </nav>
        </div>
      )}

      {/* ─── Hero Section (Judul & Tagline asli dipertahankan) ─── */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-plant.jpg"
            alt="Fasilitas Industri"
            className="h-full w-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/80" />
        </div>

        <div className="relative z-10 px-5 pb-10 pt-10">
          <div className="mb-4">
            <SectionTag n="01" dark>INDUSTRIAL PLATFORM</SectionTag>
          </div>

          <h1 className="headline text-[38px] leading-[1.05] tracking-tight text-white">
            From Industrial Problems to <br />
            <span className="text-white/60">Organizational Intelligence.</span>
          </h1>

          <p className="mt-5 text-[15px] leading-relaxed text-white/70">
            Ubah insiden lapangan, anomali mesin, dan pengalaman teknisi senior menjadi memori organisasi yang siap pakai 100% tanpa sensor.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <PillButton tone="amber" onClick={onOpenDashboard}>
              Ajukan Uji Coba Pabrik
            </PillButton>
            <PillButton
              tone="ghost"
              onClick={() => {
                const el = document.getElementById("arsitektur");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pelajari Fitur MVP
            </PillButton>
          </div>

          {/* Kartu Sorotan Kasus Lapangan */}
          <div className="mt-8 rounded-xl border border-night-line bg-night-2/90 p-4 shadow-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="mono-label text-white/50">ALUR PENYELESAIAN KASUS</span>
              <Tag tone="ok" dot>Kasus #204</Tag>
            </div>

            <div className="space-y-3 border-l border-white/20 pl-3">
              <div>
                <p className="text-[12px] font-semibold text-white/90">Masalah Terdeteksi</p>
                <p className="mono-label text-[10px] text-white/50">CNC 04 • Anomali getaran</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/90">Akar Masalah Teridentifikasi</p>
                <p className="mono-label text-[10px] text-white/50">Keausan bantalan 6204 dan misalignment</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/90">Tersimpan ke Basis Pengetahuan</p>
                <p className="mono-label text-[10px] text-white/50">SOP #129 diarsipkan untuk lini produksi</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-night-line pt-3">
              <span className="mono-label text-white/60">Estimasi Kerugian Dimitigasi</span>
              <span className="font-mono text-base font-bold text-ok">Rp74.500.000</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bagian 02: Metrik Kinerja ─── */}
      <section className="border-b border-line bg-canvas px-5 py-10">
        <div className="mb-6">
          <SectionTag n="02">HASIL OPERASIONAL</SectionTag>
          <h2 className="headline mt-3 text-[26px]">Dampak Nyata Lapangan</h2>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {METRICS.map((m) => (
            <div key={m.label} className="py-5">
              <div className="font-mono text-[38px] font-semibold leading-none tracking-tight text-ink">
                {m.value}
              </div>
              <p className="mono-label mt-2 text-ink">{m.label}</p>
              <p className="mt-1 text-[13px] text-ink-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bagian 03: Tiga Pilar Nilai MVP ─── */}
      <section id="arsitektur" className="border-b border-line bg-canvas px-5 py-10">
        <div className="mb-6">
          <SectionTag n="03">KERANGKA KERJA</SectionTag>
          <h2 className="headline mt-3 text-[26px]">Tiga Pilar Retensi Pengetahuan</h2>
          <p className="mt-2 text-[14px] text-ink-2">
            Terstruktur untuk keandalan maksimal tanpa kerumitan gateway IoT maupun integrasi sensor.
          </p>
        </div>

        <div className="space-y-4">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className="group rounded-xl border border-line bg-card p-5 transition hover:border-ink/40"
            >
              <div className="flex items-center justify-between">
                <span className="mono-label text-ink-3">LANGKAH {p.n}</span>
                <span className="mono-label rounded border border-line px-1.5 py-0.5 text-ink-2">
                  {p.tag}
                </span>
              </div>
              <h3 className="headline mt-3 text-[20px] text-ink">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Gambar Lapangan */}
        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          <img
            src="/engineer-closeup.jpg"
            alt="Teknisi memeriksa bantalan mesin"
            className="h-48 w-full object-cover"
          />
          <div className="bg-card p-4">
            <span className="mono-label text-ink-3">REALITAS DI LANTAI PABRIK</span>
            <p className="mt-1 text-[13px] font-medium text-ink">
              Keandalan pabrik dibangun dari ketelitian observasi teknisi garda depan dan standarisasi SOP yang teruji.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Tombol Tindakan Mengambang ─── */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-canvas/95 p-4 backdrop-blur-md">
        <PillButton tone="dark" onClick={onOpenDashboard}>
          Buka Dashboard Operasional
        </PillButton>
      </div>

      {/* ─── Footer ─── */}
      <footer className="px-5 py-8 text-center">
        <Logo />
        <p className="mono-label mt-3 text-ink-3">
          Sistem SafetyLog • Protokol Pengetahuan Industri 2026
        </p>
      </footer>
    </div>
  );
}
