# PRD: Commons — A Calmer Way into Web3

**Tipe dokumen:** Product Requirements Document (diturunkan dari Design System Review v1.0)
**Sumber:** *Commons / Minimal Metallic Web3 UI System* — Design Review v1.0, 2026
**Referensi desain:** commons.xyz/design

---

## 1. Ringkasan Produk

**Commons** adalah sistem UI minimalis bergaya metalik untuk platform *discovery* dan dukungan komunitas Web3. Alih-alih pendekatan visual Web3 yang umumnya penuh gradient neon dan nuansa hype/FOMO, Commons dirancang tenang, fungsional, dan berpusat pada manusia — membantu pengguna menemukan komunitas yang relevan dan mendapatkan dukungan teknis melalui interaksi antar-orang, bukan sekadar protokol dan token.

---

## 2. Prinsip Desain

| # | Prinsip | Melawan | Deskripsi |
|---|---------|---------|-----------|
| 01 | **Calm over hype** | Hype & noise | Mengganti gradient neon dan UI berbasis FOMO dengan palet metalik yang stabil, memprioritaskan utilitas jangka panjang dan fokus pengguna. |
| 02 | **Signal over chrome** | Kompleksitas | Setiap border, garis, dan shadow harus punya fungsi. Jika tidak membantu orientasi pengguna, dihapus. |
| 03 | **Human support** | Isolasi | Web3 itu teknis; UI-nya harus manusiawi. Discovery dibingkai di sekitar orang dan percakapan, bukan hanya protokol dan token. |
| 04 | **Motion as orientation** | Static friction | Motion cues yang halus memandu mata pengguna melewati transisi tanpa membebani kognisi. |

---

## 3. Sistem Visual (Visual Foundation)

### 3.1 Palet Warna — Metallic Palette

| Nama | Hex |
|------|-----|
| Warm White | `#FBFBF9` |
| Aluminum | `#F3F4F6` |
| Graphite | `#5E5E5E` |
| Charcoal | `#1A1A1A` |
| Cobalt (aksen) | `#2563EB` |
| Dark Base | `#121212` |

**Semantic pairing:**
- **Light mode:** background Warm White, teks Charcoal
- **Dark mode:** background Dark Base, teks Warm White

### 3.2 Tipografi

| Peran | Font & Style | Contoh |
|-------|-------------|--------|
| Display | Manrope Bold | "Communities worth joining" |
| Body | Inter Regular | "A place to learn, ask, and build together. Supporting the next generation of builders." |
| Caption | Inter Medium | "12.4k members • Active now" |

---

## 4. Motion & Interaction Guidelines

### 4.1 Orientation Motion
Digunakan untuk transisi halaman dan reveal container besar. Mengarahkan fokus pengguna dari global ke lokal.

```js
transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
```

**Primary easing:** Quintic Out — start cepat lalu melambat secara halus, memberi kesan "metalik": presisi dan responsif.

### 4.2 Micro-interactions
Hover state pada card dan button. Perubahan scale dan warna border secara halus untuk menandakan interaktivitas.

```js
whileHover: { scale: 1.01, borderColor: "#2563EB" }
```

### 4.3 Reduced Motion
Untuk pengguna dengan `prefers-reduced-motion`, semua transform scale dan posisi digantikan dengan opacity fade sederhana (durasi 0.2s).

---

## 5. Spesifikasi Komponen

### 5.1 Discovery Feed

| Komponen | Deskripsi |
|----------|-----------|
| **Global Navigation** | Header ramping dan persisten berisi logo serta link discovery utama. Menggunakan border bawah 1px sebagai pemisah. |
| **Featured Spotlight** | Hero section kontras tinggi untuk komunitas yang sedang trending. Background warm white menonjol di atas frame aluminum. |
| **Directory Cards** | Grid item standar untuk scanning cepat. Fokus pada jumlah member dan sinyal aktivitas, bukan imagery dekoratif. |

### 5.2 Community Hub

| Komponen | Deskripsi |
|----------|-----------|
| **Discussion Thread** | Tampilan threaded dengan indikator aktif berwarna cobalt blue. Memprioritaskan densitas teks dan keterbacaan untuk dukungan teknis. |
| **Resource Library** | Penyimpanan dokumen berbasis grid. Menggunakan ikon abu-abu aluminum untuk merepresentasikan tipe file tanpa visual clutter. |
| **Member Sidebar** | Indikator presence minimalis. Menunjukkan siapa yang tersedia untuk membantu, tanpa gamifikasi sosial yang berat. |

---

## 6. User Flows

### 6.1 Primary Flow — Discovery to Join
1. **Intent** — Pengguna mencari "Protocol Research" di search bar discovery global.
2. **Discovery** — Hasil terfilter menampilkan komunitas aktif dengan rating dukungan tinggi.
3. **Evaluation** — Pengguna melihat preview community hub, termasuk diskusi terbaru.
4. **Belonging** — One-click join; pengguna langsung diarahkan ke thread "Start here".

### 6.2 Support Flow — Seeking Help
1. **Problem** — Pengguna menemui kendala teknis dalam proyek Web3-nya.
2. **Ask** — Pengguna klik "Need a hand?" dan memposting permintaan bantuan bertag.
3. **Support** — Anggota komunitas merespons; indikator cobalt memberi notifikasi ke pengguna.
4. **Resolution** — Thread ditandai resolved, berkontribusi pada community health score.

---

## 7. Non-Functional Requirements

- **Aksesibilitas:** Rasio kontras pada semua permukaan aluminum-on-charcoal (dark mode) harus diaudit dan memenuhi standar aksesibilitas.
- **Reduced motion:** Wajib mendukung `prefers-reduced-motion` di semua transisi orientation dan micro-interaction (lihat §4.3).
- **Konsistensi mode:** Satu sistem desain harus berjalan konsisten di dua mode (light/dark) tanpa duplikasi token.

---

## 8. Implementation Handoff / Next Steps

| Status | Item | Deskripsi |
|--------|------|-----------|
| ☐ | **Figma to Code Sync** | Mengekspor seluruh metallic token dan component primitive ke environment development. |
| ☐ | **Motion Prototype** | Menyempurnakan kurva easing quintic-out di Framer untuk pilot discovery feed. |
| ☐ | **Dark Mode Audit** | Memastikan rasio kontras aksesibilitas pada semua permukaan aluminum-on-charcoal. |

**Status dokumen sumber:** Ready for review (Design Review v1.0, 2026)

---

## 9. Catatan

Dokumen ini disusun ulang dari materi design system (deck visual) menjadi format PRD agar lebih mudah dijadikan acuan pengembangan. Bagian *Problem Statement*, *Success Metrics*, dan *User Personas* formal belum tersedia di sumber asli — perlu dilengkapi oleh tim produk sebelum development dimulai.