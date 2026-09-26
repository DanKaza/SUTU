Berdasarkan arah proyek SUTU sejauh ini (frontend Next.js sekarang, tapi PLAN.md eksplisit menyebut nanti akan ada API/backend service, database, dan kemungkinan smart contract untuk settlement) — kalau mau dipindah ke Turborepo, gambaran strukturnya kira-kira begini:

```
sutu/
├── apps/
│   ├── web/                 # Next.js app yang sekarang (landing + discover + support flow + basket dst.)
│   ├── api/                 # (nanti) backend/API service — PLAN.md §19 boundary: Frontend → API → Backend → DB
│   └── contracts/           # (nanti, opsional) smart contract project (Hardhat/Foundry) untuk settlement basket
│
├── packages/
│   ├── ui/                  # komponen shared: Button, Card, Input, Tabs, Badge, dll (yang sekarang di components/ui)
│   ├── config/              # tailwind.config.ts, tsconfig base, eslint config bersama
│   ├── lib/                 # tipe & util bersama: Community, SupportRecord, BasketItem, format helpers
│   └── mock-data/           # mock-data.ts sekarang, bisa jadi package sementara sebelum digantikan API asli
│
├── turbo.json
├── package.json             # workspace root (pnpm/yarn workspaces)
└── tsconfig.json            # base config di-extend tiap package/app
```

Beberapa hal yang relevan buat migrasi nanti:
- `components/community/*` dan `components/landing/*` yang sifatnya spesifik ke satu app sebaiknya **tetap di `apps/web`**, bukan ditarik ke `packages/ui` — cuma primitives generik (Button/Card/Input/Tabs/Badge/AvatarStack) yang layak jadi shared package.
- `lib/app-state.tsx` (basket + supports context) kemungkinan tetap di `apps/web` karena masih terikat erat ke UI React-nya, kecuali nanti mau dipakai juga di app lain (misal admin dashboard) baru diangkat ke package.
- Tipe data (`Community`, `SupportRecord`, `BasketItem`) cocok ditaruh di `packages/lib` atau `packages/types` supaya bisa dipakai bareng oleh `apps/web` dan `apps/api` begitu backend digarap — ini juga pas dengan pesan PLAN.md §18-19 soal frontend/backend boundary.
- `turbo.json` cukup pipeline standar: `build`, `dev`, `lint` per app/package dengan dependency graph (`ui`/`lib` build dulu sebelum `web`).

Tapi ini murni gambaran arsitektur — belum ada implementasi migrasi monorepo yang jalan di proyek sekarang.