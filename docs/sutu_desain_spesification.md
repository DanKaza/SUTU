# SUTU — Design Specification

> **SUTU** adalah landing page profil untuk mendukung komunitas: sebuah ruang digital yang membantu orang menemukan komunitas, berbagi ide, dan tumbuh bersama. Dokumen ini menerjemahkan bahasa visual referensi menjadi pengalaman SUTU yang **maksimalis, modern, gelap, dan tetap terkontrol**.

## 1. Arah Kreatif

SUTU harus terasa seperti **community portfolio yang premium**, bukan dashboard produk biasa. Komposisi utamanya mengikuti ritme editorial pada referensi: header minimal, hero besar, blok narasi dengan jeda ruang yang lega, showcase visual sinematik, lalu section manfaat dan cara kerja. Perbedaannya, seluruh identitas Web3 diganti menjadi dunia komunitas SUTU.

Kata kunci visual: **deep black, violet glow, liquid glass, editorial spacing, soft noise, modular cards, cinematic gradients, expressive motion**.

Prinsip desain:

1. **Black is the canvas.** Hitam bukan sekadar warna background, tetapi ruang untuk menonjolkan cahaya ungu.
2. **One strong idea per viewport.** Setiap section memiliki headline/objek utama yang mudah ditangkap dalam 2–3 detik.
3. **Maximum detail, minimum clutter.** Tekstur, grid, glow, dan micro-interaction boleh kaya; hirarki, copy, dan CTA tetap sederhana.
4. **Community first.** Semua angka, label, dan imagery harus mengarah pada koneksi manusia, partisipasi, dan rasa memiliki.
5. **Motion supports meaning.** Animasi dipakai untuk memperjelas relasi antarkomponen, bukan sekadar dekorasi.

## 2. Identitas Merek

### Logo

Logo utama hanya berupa huruf **S** kapital dengan bentuk geometris minimalis, sudut sedikit membulat, dan karakter seperti wordmark produk premium. Gunakan font sans-serif modern dengan weight 600–700; bentuk S dapat diberi potongan diagonal kecil atau inner gap tipis agar terasa proprietary.

- **Mark:** `S` dalam square 36 × 36 px, radius 11 px.
- **Treatment:** gradient linear `#FFFFFF → #A78BFA` atau outline putih dengan glow violet sangat halus.
- **Wordmark desktop:** `SUTU`, letter-spacing `-0.04em`, weight 650.
- **Wordmark mobile:** mark `S` saja agar header tetap lapang.

### Nada suara

Hangat, percaya diri, inklusif, dan sedikit aspiratif. Hindari jargon korporat. Copy harus terdengar seperti ajakan untuk hadir dan berkontribusi.

Contoh copy utama:

- Eyebrow: `BUILT FOR THE PEOPLE WHO SHOW UP`
- Hero: `Find your people. Build what matters.`
- Deskripsi: `SUTU membantu komunitas tumbuh melalui ruang yang lebih terbuka, percakapan yang lebih bermakna, dan langkah kecil yang dilakukan bersama.`
- Primary CTA: `Explore SUTU`
- Secondary CTA: `See how it works`

## 3. Design Tokens

### Warna

| Token | Nilai | Penggunaan |
|---|---:|---|
| `--ink-950` | `#07060A` | Canvas utama |
| `--ink-900` | `#0D0B12` | Section gelap dan footer |
| `--ink-800` | `#17131F` | Card dan surface elevated |
| `--ink-700` | `#24202E` | Border dan divider |
| `--white` | `#F7F5FB` | Headline dan teks utama |
| `--muted` | `#AAA3B6` | Teks sekunder |
| `--faint` | `#746D80` | Caption dan metadata |
| `--violet-500` | `#8B5CF6` | Aksen utama |
| `--violet-400` | `#A78BFA` | Highlight dan hover |
| `--violet-700` | `#5B21B6` | Shadow glow yang lebih dalam |
| `--lilac` | `#DDD6FE` | Aksen terang pada icon/label |
| `--pink` | `#F0ABFC` | Aksen kecil yang playful |

Gradient utama:

```css
--gradient-hero: radial-gradient(circle at 70% 30%, #4C1D95 0%, #1B1230 28%, #07060A 72%);
--gradient-violet: linear-gradient(135deg, #A78BFA 0%, #7C3AED 48%, #EC4899 100%);
--gradient-card: linear-gradient(145deg, rgba(167,139,250,.18), rgba(255,255,255,.035));
--gradient-section: linear-gradient(180deg, #07060A 0%, #100B1C 55%, #07060A 100%);
```

### Tipografi

Gunakan `Inter`, `SF Pro Display`, atau `Manrope` sebagai sans-serif utama. Untuk heading editorial sekunder gunakan `DM Serif Display` atau `Instrument Serif` secara terbatas.

| Style | Desktop | Mobile | Weight / leading |
|---|---:|---:|---|
| Display | 88 px | 48 px | 650 / 0.95 |
| H1 | 64 px | 42 px | 650 / 1.02 |
| H2 | 48 px | 34 px | 600 / 1.05 |
| H3 | 28 px | 23 px | 600 / 1.15 |
| Body large | 20 px | 18 px | 400 / 1.55 |
| Body | 16 px | 15 px | 400 / 1.6 |
| Label | 11 px | 10 px | 650 / 1.2, uppercase, 0.12em |

### Spacing, grid, dan shape

- Container maksimum: `1280 px`.
- Padding desktop: `48 px`; tablet: `32 px`; mobile: `20 px`.
- Grid dasar: 12 kolom desktop, 6 tablet, 4 mobile.
- Gutter desktop: `24 px`; mobile: `16 px`.
- Jarak antar-section desktop: `clamp(128px, 15vw, 240px)`.
- Radius besar: `32 px`; card: `20 px`; button: `999 px`.
- Border: `1px solid rgba(255,255,255,.11)`.
- Shadow utama: `0 0 80px rgba(124,58,237,.20), 0 24px 80px rgba(0,0,0,.45)`.

## 4. Struktur Halaman

### 4.1 Header / Navigation

Header fixed atau sticky dengan tinggi sekitar `76 px`, background transparan yang berubah menjadi `rgba(7,6,10,.78)` + `backdrop-filter: blur(18px)` setelah scroll.

- Kiri: logo `SUTU`.
- Tengah desktop: `Communities`, `Stories`, `About`.
- Kanan: text link `Join a community` dan tombol outline `Sign in`.
- CTA utama: pill violet `Start with SUTU`.
- Mobile: logo di kiri, hamburger di kanan; menu tampil sebagai full-screen overlay gelap dengan glow violet.
- Tambahkan progress line 2 px di bawah header, gradient violet-pink, scale-x mengikuti scroll progress.

### 4.2 Hero — “Find your people”

Hero mengisi minimal satu viewport (`min-height: 820px`) dengan layout dua area: copy di kiri dan visual orbit komunitas di kanan. Pada mobile, copy lebih dahulu, visual berada di bawah.

**Copy:**

- Eyebrow kecil dengan dot animasi: `A NEW HOME FOR COLLECTIVE ENERGY`.
- Headline dua atau tiga baris: `Find your people. Build what matters.` Kata `people` diberi gradient violet.
- Body copy maksimal 520 px.
- CTA: `Explore communities` (filled) dan `Watch the intro` (ghost dengan icon play).
- Social proof kecil: avatar stack 5 orang + teks `12,000+ people already showing up`.

**Visual:**

Sebuah panel kaca besar dengan radius `32 px`, background radial violet, grid sangat halus, dan objek abstrak berupa tiga bentuk lingkaran/torus yang saling terhubung. Setiap node berisi avatar atau icon kategori: `Design`, `Local`, `Builders`, `Care`, `Culture`. Node mengorbit perlahan pada jalur elliptical tipis.

**Hero shadow:** glow ungu berada di belakang visual, bukan di belakang seluruh copy, agar fokus tetap terkendali. Tambahkan noise overlay 2–3% opacity.

### 4.3 Intro / Editorial Statement

Buat section pendek dengan lebar teks sekitar `820 px`, ditempatkan di tengah dan diberi ruang kosong besar. Heading serif atau sans-serif display:

> “The strongest communities are not built around noise. They are built around people who keep showing up.”

Di bawahnya, tampilkan label `SUTU / OUR POINT OF VIEW` dan paragraf singkat. Section ini berfungsi sebagai jeda napas setelah hero.

### 4.4 Showcase Panel — “A place to belong”

Panel full-width dengan background `--ink-900`, grid line radial, dan border tipis. Layout desktop dua kolom:

- Kiri: heading `A calmer way to connect.` + copy + CTA kecil `Learn about the SUTU ritual`.
- Kanan: UI mockup komunitas dalam card besar, menampilkan nama komunitas, prompt diskusi, tiga avatar aktif, dan indikator `12 people here now`.

Gunakan kartu-kartu floating:

- `New conversation` dengan dot violet.
- `Weekly gathering` dengan tanggal.
- `Shared progress` dengan mini bar.

Di mobile, mockup dipindah setelah copy dan dibuat horizontal-scroll ringan. Jangan memaksa seluruh dashboard terlihat sekaligus.

### 4.5 Narrative / “Why SUTU”

Ikuti ritme studi kasus referensi: satu blok teks gelap dengan margin besar dan heading editorial. Tampilkan empat subbagian:

1. **The gap** — internet terasa ramai, tetapi banyak orang tetap merasa sendiri.
2. **The approach** — SUTU memprioritaskan percakapan yang berniat, konteks yang jelas, dan ruang untuk berkontribusi.
3. **The result** — komunitas menjadi lebih mudah ditemukan, diikuti, dan dirawat.
4. **Made with care** — desain, teknologi, dan moderasi bekerja bersama untuk membuat ruang yang aman dan hidup.

Heading subbagian dapat menggunakan `Instrument Serif` 24–28 px; body memakai sans-serif muted. Tambahkan vertical rule violet 2 px di sisi kiri pada desktop; ubah menjadi top rule di mobile.

### 4.6 Cinematic Device Mockup

Tampilkan laptop atau tablet dengan interface SUTU di atas latar hitam-putih/grayscale yang menyerupai studio abstrak. Layar perangkat memperlihatkan dashboard komunitas dengan violet accents.

- Foto/visual memakai desaturasi 85–100% agar UI tetap dominan.
- Tambahkan shadow besar ungu yang blur, opacity rendah.
- Object harus masuk sedikit dari luar frame untuk memberi rasa sinematik.
- Pada scroll, device bergerak `rotateX(4deg) rotateY(-5deg)` menuju posisi lurus.

### 4.7 Benefits — “Community, with intention”

Section gelap dengan layout dua kolom:

- Kiri: heading besar `Community, with intention.`; body; CTA `Start a circle`; visual abstrak seperti pita/pecahan kaca violet.
- Kanan: tiga stacked cards.

Isi kartu:

| Icon | Judul | Deskripsi |
|---|---|---|
| `◎` | **Belonging** | Temukan ruang yang terasa relevan sejak percakapan pertama. |
| `↗` | **Momentum** | Ubah ide kecil menjadi kebiasaan dan aksi bersama. |
| `✦` | **Care** | Bangun interaksi yang lebih aman, terbuka, dan manusiawi. |

Kartu memiliki surface `#17131F`, border, icon tile 40 px, dan hover lift 8 px dengan violet rim light.

### 4.8 How It Works — “Small steps, shared energy”

Background berubah perlahan dari hitam ke teal-violet yang sangat gelap. Heading rata tengah dan tiga step cards horizontal:

1. **Step 1 — Find your signal**: pilih minat, nilai, atau kota yang ingin kamu dekati.
2. **Step 2 — Enter the room**: bergabung dalam komunitas dengan ritme dan konteks yang jelas.
3. **Step 3 — Show up together**: ikut percakapan, acara, atau proyek yang berarti.

Setiap card berisi thumbnail abstrak monokrom dengan orb violet/cyan, icon lingkaran di tengah, label step, heading, dan deskripsi. Card ke-2 sedikit lebih tinggi sebagai focal point pada desktop.

### 4.9 Final CTA / Footer

Final CTA memakai headline besar:

`Your people are already out there.`

Subcopy: `SUTU memberi mereka tempat untuk bertemu. Kamu tinggal mulai.`

CTA `Enter SUTU` dengan arrow yang bergerak saat hover. Footer berisi logo, tagline `Make room for each other.`, link `Instagram`, `X`, `Contact`, serta copyright. Gunakan border-top tipis dan ruang bawah lega.

## 5. Motion System — Framer Motion + animation.js

### Prinsip motion

- Durasi standar: `0.6–0.9s`; micro-interaction: `0.18–0.3s`.
- Easing utama: `[0.22, 1, 0.36, 1]`.
- Animasi masuk hanya sekali per viewport; jangan mengulang tanpa alasan.
- Semua animasi wajib menghormati `prefers-reduced-motion`.

### Framer Motion variants

```js
export const revealUp = {
  hidden: { opacity: 0, y: 34, filter: 'blur(8px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 }
  }
};

export const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: '0 0 0 rgba(139,92,246,0)' },
  hover: {
    y: -8, scale: 1.015,
    boxShadow: '0 20px 60px rgba(124,58,237,.28)',
    transition: { duration: 0.28, ease: 'easeOut' }
  }
};
```

### Interaksi yang diwajibkan

- **Hero orbit:** node komunitas mengorbit 18–28 detik secara infinite; pause ketika pointer masuk.
- **Scroll reveal:** copy, card, dan device muncul dengan stagger ketika 15% elemen masuk viewport.
- **Magnetic CTA:** tombol hero bergeser maksimal 6 px mengikuti pointer dalam radius 120 px.
- **Button arrow:** arrow translate-x 4 px dan glow bertambah pada hover.
- **Card spotlight:** gunakan pointer position untuk radial highlight halus di dalam benefit card.
- **Device parallax:** mockup bergerak lebih lambat daripada background; matikan pada mobile dan reduced motion.
- **Scroll progress:** garis violet di bawah header mengikuti `scrollYProgress`.
- **Section transition:** background gradient berubah perlahan melalui `useTransform`, bukan hard cut.

### animation.js utility layer

Gunakan `animation.js` sebagai lapisan utilitas kecil untuk efek yang tidak perlu menjadi state React:

```js
export function setPointerGlow(element, event) {
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  element.style.setProperty('--pointer-x', `${x}%`);
  element.style.setProperty('--pointer-y', `${y}%`);
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

Implementasikan `.pointer-glow` dengan `radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(167,139,250,.18), transparent 32%)` dan fallback statis untuk touch device.

## 6. Component Map

```text
<AppShell>
  <ScrollProgress />
  <Header />
  <main>
    <Hero />
    <EditorialStatement />
    <CommunityShowcase />
    <NarrativeSection />
    <DeviceMockup />
    <BenefitsSection />
    <HowItWorks />
    <FinalCTA />
  </main>
  <Footer />
</AppShell>
```

Komponen reusable: `GlowButton`, `GlassCard`, `AvatarStack`, `SectionEyebrow`, `Reveal`, `CommunityNode`, `StepCard`, `IconTile`.

## 7. Responsive Behavior

| Breakpoint | Perilaku |
|---|---|
| `≥ 1200px` | Grid 12 kolom, hero dua kolom, benefit dan step cards horizontal, device oversized. |
| `768–1199px` | Grid 8 kolom, hero visual mengecil, narrative tetap satu kolom, cards step dapat menjadi 2+1. |
| `< 768px` | Grid 4 kolom, nav overlay, semua section satu kolom, text rata kiri kecuali final CTA, orbit disederhanakan. |
| `< 420px` | Headline maksimum 46 px, CTA full-width, card padding 20 px, hide decorative nodes non-esensial. |

Pada mobile, jangan mengurangi atmosfer gelap dan glow; yang dikurangi hanya kepadatan ornamen dan jumlah motion simultan.

## 8. Accessibility dan Quality Bar

- Kontras teks utama minimal WCAG AA.
- Semua icon-only button memakai `aria-label`.
- Keyboard focus memakai outline `2px solid #A78BFA` dengan offset `4px`.
- Jangan menyampaikan informasi hanya dengan warna atau animasi.
- Gunakan `alt` deskriptif untuk mockup dan visual dekoratif diberi `aria-hidden="true"`.
- Sediakan skip link `Skip to content`.
- Test pada touch, keyboard, reduced motion, dan viewport 320 px.
- Animasi tidak boleh mengubah layout secara mendadak atau menyebabkan horizontal overflow.

## 9. Acceptance Criteria Visual

1. Dalam first viewport, identitas SUTU terbaca dalam 2 detik dan headline menjadi focal point terbesar.
2. Background dominan hitam; violet glow terasa premium, bukan neon berlebihan.
3. Setiap section memiliki satu visual focal point dan satu CTA yang jelas.
4. Card, mockup, dan CTA menggunakan radius, border, dan shadow yang konsisten.
5. Transisi antar-section terasa mengalir melalui ruang vertikal dan gradient, bukan melalui banyak divider.
6. Pada mobile, halaman tetap terasa seperti editorial showcase, bukan sekadar daftar card yang ditumpuk.
7. `prefers-reduced-motion` mematikan orbit, parallax, magnetic cursor, dan blur transition tanpa menghilangkan konten.

## 10. Placeholder Asset Direction

Jika asset final belum tersedia, gunakan placeholder berikut:

- Avatar: portrait abstrak/monokrom dengan accent violet.
- Hero object: tiga orb atau bentuk pita 3D dengan material kaca hitam dan edge violet.
- Device mockup: laptop matte hitam, layar menampilkan interface komunitas SUTU.
- Thumbnail step: tekstur grain, tangan/objek sosial yang diolah monokrom, overlay violet transparan.
- Icon: stroke 1.5 px, geometris, rounded cap.

Hindari imagery yang terlalu ramai, foto stok komunitas yang generik, warna hijau terang, atau gradient rainbow yang menyaingi violet sebagai identitas utama.

---

**Ringkasan implementasi:** bangun SUTU sebagai pengalaman dark-editorial dengan canvas hitam, sistem glow violet yang terukur, tipografi sans-serif premium, beberapa aksen serif untuk kedalaman naratif, komponen kaca modular, serta motion Framer Motion yang terasa lembut dan responsif. Hasil akhir harus terlihat maksimalis pada detail, tetapi minimalis pada keputusan visual utama.
