# FIX.MD — Landing Page SUTU Cleanup

## Tujuan
Merapikan landing page SUTU yang saat ini terlalu "maksimalis tanpa restraint", memiliki komponen orphaned, melanggar DESIGN.MD token, dan punya broken nav links.

---

## Issue Daftar

### 1. [Kritis] Tidak ada hierarki visual — semua section terlalu ramai
- **File:** `app/page.tsx`, semua `components/landing/*.tsx`
- **Masalah:** Setiap section punya aurora + grid + grain + glass + glow. Tidak ada section yang "tenang".
- **Fix:** Pilih 1-2 section sebagai "calm zones" (tanpa aurora/grid/grain). Hero tetap maximalis, tapi section lainnya sederhana: white/void bg, tanpa backdrop effects.
- **DESIGN.MD rujukan:** §1 Minimalis — "Negative space lega di antara elemen padat"

### 2. [Kritis] 4+ aksen warna aktif bersamaan
- **File:** `tailwind.config.ts`, `globals.css`, semua `components/landing/*.tsx`
- **Masalah:** Violet (#7C5CFF), Cyan (#22D3EE), Magenta (#F472B6), + iridescent gradient semua aktif di satu halaman.
- **Fix:** Batasi jadi 2 aksen utama (violet + cyan) untuk section yang "ramai". Magenta hanya untuk interactive states (button hover, badge). Iridescent hanya untuk headline text.
- **DESIGN.MD rujukan:** §6 — "Terlalu banyak warna aksen sekaligus — batasi maksimal 3"

### 3. [Kritis] `how-it-works-section.tsx` tidak dirujuk di `app/page.tsx`
- **File:** `app/page.tsx`, `components/landing/how-it-works-section.tsx`
- **Masalah:** Nav link `/#how-it-works` mengarah ke section yang tidak ada di landing page. Komponen orphaned.
- **Fix:** Pilih salah satu:
  - (a) Tambahkan `HowItWorksSection` ke `app/page.tsx` setelah `FeaturesBentoSection`
  - (b) Ganti nav link `/#how-it-works` → `/#features` di `global-nav.tsx`
  - (c) Hapus `HowItWorksSection` jika tidak dibutuhkan

### 4. [Sedang] `principles-section.tsx` masih ada tapi tidak dipakai
- **File:** `components/landing/principles-section.tsx`
- **Masalah:** Redesign plan (2026-09-20) sudah bilang dibakar ke `features-bento-section.tsx`, tapi file masih ada.
- **Fix:** Hapus `principles-section.tsx`. Pastikan fiturnya sudah tercakup di `features-bento-section.tsx`.

### 5. [Sedang] Spacing section tidak konsisten
- **File:** `app/page.tsx`
- **Masalah:** `mt-16`, `mt-32`, `mt-20` menyebar tanpa ritme 8px scale.
- **Fix:** Standarisasi: `mt-20` (160px) antar section. HERO: `mt-8`, section biasa: `mt-20`, CTA: `mt-24`.

### 6. [Sedang] `Button variant="outline"` duplicate class
- **File:** `components/ui/button.tsx:13`
- **Masalah:** `"border border-white/20 text-ink hover:border-violet border-white/20 text-ink"` — `border-white/20` dan `text-ink` muncul dua kali.
- **Fix:** `"border border-white/20 text-ink hover:border-violet hover:text-ink"`

### 7. [Sedang] CTA section punya gradient blur yang mengaburkan
- **File:** `components/landing/landing-cta-section.tsx:11`
- **Masalah:** `bg-iridescent opacity-10 blur-3xl` absolute inset bisa menutupi teks di layar kecil.
- **Fix:** Ganti dengan `bg-violet/10 blur-3xl` atau hapus absolute inset, gunakan pseudo-element `::before` saja.

### 8. [Sedang] Footer merujuk ke route yang tidak ada
- **File:** `components/layout/footer.tsx`
- **Masalah:** Link `/about` dan `/contact` — tidak ada `app/about/page.tsx` atau `app/contact/page.tsx`.
- **Fix:** Ganti `/about` → `/` (atau `#how-it-works`), `/contact` → `#`.

### 9. [Minor] Community Ticker terbenam
- **File:** `components/landing/community-ticker.tsx`
- **Masalah:** `bg-white/[0.01]` nyaris tidak terlihat. 18 items scrolling 40s — lambat dan padat.
- **Fix:** Tambah `bg-void/80 border-y border-white/10 py-6`. Kurangi speed ke 50s atau kurangi items jadi 12 (tanpa 3x triple).

### 10. [Minor] Bento Grid card heights tidak seragam
- **File:** `components/landing/features-bento-section.tsx`
- **Masalah:** 5 cards dengan span berbeda menyebabkan tinggi tidak konsisten.
- **Fix:** Tambah `min-h-[280px]` atau uniform `row-span-1` untuk semua card. Atau pakai CSS grid auto-rows.

---

## Checklist Eksekusi

  Fix button.tsx duplicate class
  Fix footer.tsx broken links
  Fix app/page.tsx spacing konsisten (8px scale)
  Tambahkan HowItWorksSection ke page.tsx ATAU update nav link
  Hapus principles-section.tsx
  Kurangi aksen warna jadi 2+1
  Buat 1-2 "calm zone" section tanpa aura effects
  Fix CTA gradient blur
  Perbaiki community-ticker styling
  Uniform bento grid card heights
  Typecheck: npm run typecheck
  Build: npm run build

---

## Urutan Eksekusi (Rekomendasi)

1. **Quick wins** (15 menit): Fix button.tsx, footer.tsx, spacing
2. **Struktural** (30 menit): How-it-works integration, hapus principles
3. **Visual polish** (45 menit): Color reduction, calm zones, CTA fix
4. **Verify** (10 menit): Typecheck + build