# Design Brief — Web3 Community Platform

Arah visual: **maksimalis, dengan struktur minimalis, dan sentuhan futuristik.**

---

## 1. Filosofi Desain

### Maksimalis (kekayaan visual)

- Gradient mesh berlapis / aurora background
- Kartu glassmorphism dengan depth dan bayangan
- Tipografi display besar dan berani
- Ikonografi padat, badge, avatar stack
- Visual abstrak generatif sebagai aksen

### Minimalis (struktur & restraint)

- Negative space lega di antara elemen padat
- Palet warna dibatasi: 1 warna dasar + 1–2 aksen
- Grid rapi dan konsisten
- Satu focal point per section
- Hirarki informasi yang jelas, tidak berebut perhatian

### Futuristik (sentuhan akhir)

- Glow neon tipis di border dan hover state
- Gradient iridescent (violet → cyan → magenta)
- Tekstur grain/noise halus di atas gradient
- Motif wireframe dan geometris
- Micro-interaction: shimmer, glow, parallax lembut

---

## 2. Design Token

### Warna

| Peran            | Nilai                                                | Catatan                     |
| ---------------- | ---------------------------------------------------- | --------------------------- |
| Background utama | `#0A0A0F`                                            | Near-black kebiruan         |
| Surface / card   | `rgba(255,255,255,0.05)`                             | Glassmorphism + blur        |
| Border           | `rgba(255,255,255,0.12)`                             | Tipis, dengan glow opsional |
| Teks utama       | `#F5F5F7`                                            | Off-white                   |
| Teks sekunder    | `#8A8A99`                                            | Muted grey                  |
| Aksen 1          | `#7C5CFF`                                            | Violet                      |
| Aksen 2          | `#22D3EE`                                            | Cyan                        |
| Aksen 3          | `#F472B6`                                            | Magenta                     |
| Gradient utama   | `linear-gradient(135deg, #7C5CFF, #22D3EE, #F472B6)` | Iridescent                  |

### Tipografi

| Peran                | Font                          | Keterangan                       |
| -------------------- | ----------------------------- | -------------------------------- |
| Display / headline   | Space Grotesk, Clash Display  | Geometris, tebal, tracking rapat |
| Body                 | Inter, Manrope                | Bersih, netral, mudah dibaca     |
| Angka / label teknis | JetBrains Mono, IBM Plex Mono | Untuk statistik, address, kode   |

Skala: `72 / 48 / 32 / 24 / 18 / 16 / 14 / 12` px

### Spacing & Bentuk

- Base spacing: kelipatan 8px
- Border radius: 16px (card), 999px (pill/badge), 12px (input)
- Padding section: 96–128px vertikal di desktop
- Max width konten: 1200px

---

## 3. Komponen Kunci

- **Hero section** — headline display besar, gradient mesh background, orb 3D/wireframe abstrak
- **Bento grid** — layout asimetris berisi statistik komunitas, highlight, dan CTA
- **Glass card** — background blur, border tipis bercahaya, hover glow
- **Badge / title card** — untuk menampilkan title atau apresiasi unik yang didapat user
- **Avatar stack** — menampilkan anggota atau kontributor komunitas
- **CTA button** — gradient fill, glow halus saat hover, radius pill
- **Stat counter** — angka besar dengan font monospace, label kecil muted

---

## 4. Mood

> Bold tapi tetap lapang. Futuristik tapi terasa manusiawi. Energi komunitas digital-native tanpa kesan dingin atau korporat.

**Referensi rasa:** POAP, Farcaster, Zora, Linear, Rainbow Wallet

---

## 5. Prompt Siap Pakai

### Versi Panjang (untuk v0, Galileo, Figma AI, Lovable)

```
Design a Web3 community platform interface. Style: maximalist digital
design with restrained minimalist structure and a subtle futuristic
edge — bold layered gradients and rich glassmorphic cards balanced by
generous negative space and clean grid alignment.

Color palette: deep near-black background (#0A0A0F) with iridescent
violet-cyan-magenta gradient accents (#7C5CFF, #22D3EE, #F472B6),
off-white neutral text (#F5F5F7), muted grey secondary text (#8A8A99).

Typography: bold geometric display font (Space Grotesk / Clash Display)
for headlines, clean minimal sans (Inter / Manrope) for body text,
monospace accents (JetBrains Mono) for numbers, stats, and labels.

Layout: asymmetric bento-grid, generous vertical rhythm, max content
width 1200px, 8px spacing scale, 16px card radius.

Include: glassmorphism cards with subtle border glow, gradient mesh /
aurora backgrounds, fine grain texture overlay, glowing hover states,
abstract 3D or wireframe orb visuals, community badge and achievement
cards, avatar stacks, large stat counters.

Mood: bold yet breathable, futuristic but human, digital-native
community energy. Not corporate, not cold.
```

### Versi Pendek (untuk Midjourney / image generator)

```
Web3 community platform UI, maximalist yet minimal, dark near-black
background, iridescent violet cyan magenta gradient mesh, glassmorphism
cards with glowing borders, bold geometric display typography,
asymmetric bento grid, grain texture, abstract 3D orb, futuristic,
generous negative space, high detail --ar 16:9
```

### Versi Satu Baris (quick prompt)

```
Dark maximalist-minimal Web3 community UI: iridescent gradient mesh,
glassmorphic bento cards with glow borders, bold geometric type,
futuristic and breathable.
```

---

## 6. Yang Perlu Dihindari

- Terlalu banyak warna aksen sekaligus — batasi maksimal 3
- Semua section maksimalis — selingi dengan section tenang
- Glow berlebihan sampai teks sulit dibaca
- Klise crypto: gambar koin, grafik naik, robot, matrix rain
- Kontras rendah antara teks dan background gradient
