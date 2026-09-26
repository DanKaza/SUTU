# SUTU — Alur Backend

> Dokumentasi alur backend & integrasi frontend ↔ backend untuk project **SUTU** (community donations on Monad).
> Sumber: `lib/api/*`, `lib/web3/*`, `next.config.ts`, serta kontrak API di `MD/backend_update.md` dan catatan QA di `MD/BACKEND_NOTES.md`.

---

## 1. Arsitektur High-Level

```
┌─────────────────────────────┐
│  Browser (Next.js Client)   │
│  - wagmi + viem (wallet)    │
│  - lib/api (fetch client)   │
└──────────┬──────────────────┘
           │  fetch same-origin
           ▼
┌─────────────────────────────┐
│  Next.js (rewrites proxy)   │   next.config.ts:
│  /api/v1/:path*  ─────────► │   https://sutu.tixrouter.my.id/api/v1/:path*
│  /health         ─────────► │   https://sutu.tixrouter.my.id/health
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  SUTU Backend (https://sutu.tixrouter.my.id)         │
│  ┌────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │ REST API   │ │ Demo Wallet │ │ On-chain Watcher│  │
│  │ /api/v1/*  │ │ Ledger (USD)│ │ (Monad testnet) │  │
│  └─────┬──────┘ └──────┬──────┘ └────────┬────────┘  │
│        ▼               ▼                 ▼           │
│  ┌──────────┐   ┌───────────┐   ┌────────────────┐   │
│  │ Postgres │   │ Cache TTL │   │ Monad RPC      │   │
│  └──────────┘   └───────────┘   └────────────────┘   │
└──────────────────────────────────────────────────────┘
```

- **Backend eksternal** — frontend ini tidak punya server API sendiri (tanpa route handler). Semua data datang dari SUTU backend via **Next.js rewrite** (same-origin proxy). Proxy bersifat optimasi; CORS backend sudah terbuka (`*`).
- **Blockchain Monad testnet** (chainId `monadTestnet`) — pembayaran on-chain dikirim **langsung dari wallet user** ke `payout_address` komunitas, tidak melewati backend. Backend hanya mendeteksi/mencocokkannya (watcher) atau memverifikasi `txHash` yang dilaporkan.

### Dua sistem uang (jangan tertukar)

| Sistem | Satuan | Sumber kebenaran | Dipakai untuk |
|---|---|---|---|
| **On-chain (Monad)** | wei (string desimal) | Blockchain + kontrak | Donasi asli via wallet |
| **Demo wallet** | USD | Ledger DB backend | Saldo $1.000 demo, transfer tanpa gas |

Aturan kunci: semua nilai wei adalah **string** — matematika hanya via `BigInt` (`lib/api/format.ts`). `amountUsd` request = JSON number; `balanceUsd` response = string.

---

## 2. Autentikasi & Identitas

### 2.1 Mode saat ini (demo) — API Key + Wallet Header

```
Setiap request wajib:
  x-api-key:        $NEXT_PUBLIC_SUTU_API_KEY   (fallback: "sutu-dev-key")
Endpoint beridentitas tambah:
  x-wallet-address: 0x<alamat wallet terhubung>
```

Alur sign-in (`lib/web3/auth-context.tsx`):

```
1. Cek wallet extension (window.ethereum / EIP-1193)
2. connectAsync (wagmi injected connector) → dapat address
3. setWalletAddress(address) → persist ke localStorage["sutu_wallet"]
4. GET /users/me (dengan header di atas)
   → user AUTO-TERDAFTAR + otomatis dapat bonus $1.000 demo wallet
5. Status = "connected"; semua request berikutnya membawa header address
```

- **Alamat yang sama = identitas yang sama.** Saldo, history, dan donasi mengikuti alamat.
- Header hilang/format salah → `401 UNAUTHORIZED`. Frontend melempar `ApiError(401, "UNAUTHORIZED", "Connect your wallet first")` sebelum fetch.
- Tidak ada signature/SIWE — `POST /auth/nonce` & `/auth/verify` **belum di-deploy** (404). JWT/Bearer hanya legacy (`sutu_token`, dibersihkan saat sign-out). Migrasi SIWE direncanakan (lihat §8).

### 2.2 Rate limiting (gerbang API key)

- Request **tanpa** `X-API-Key` (atau key salah) → `401` dan dihitung ke kuota: maks **2 req/menit per IP**, lalu **ban 60 detik** → `429` + header `Retry-After`.
- Key valid → akses penuh tanpa kuota.

---

## 3. Kontrak Respons

Semua response JSON dengan envelope konsisten:

```
Sukses : { "data": <T>, "meta"?: { ... } }        // meta = pagination/caching info
Error  : { "error": { "code": string, "message": string, "details"?: unknown } }
```

| code | HTTP | Arti |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body/query gagal validasi (zod) |
| `UNAUTHORIZED` | 401 | API key / `X-Wallet-Address` hilang atau invalid |
| `NOT_FOUND` | 404 | Resource tidak ada (termasuk intent milik user lain) |
| `CONFLICT` | 409 | Duplikat |
| `INTERNAL` | 500 | Error server |

Frontend membungkus semua kegagalan non-2xx ke `ApiError` (`lib/api/client.ts`), status polling dikonversi ke UI state via `statusToUi()`: `CONFIRMED|RECONCILED → confirmed`, `FAILED → failed`, sisanya `pending`.

---

## 4. Katalog Endpoint

Base: `https://sutu.tixrouter.my.id` (via proxy `/api/v1`). Semua request wajib `x-api-key`.

| Method | Path | Identitas | Fungsi | Dipakai di frontend |
|---|---|---|---|---|
| GET | `/health` (di luar /api/v1) | – | Health service (db/cache/monadRpc) | `fetchHealth()` |
| GET | `/communities` | – | List komunitas (+`search`,`category`,`limit`,`offset`) | `useCommunities()` |
| GET | `/communities/:slug` | – | Detail komunitas + array `projects` | `useCommunity()` |
| POST | `/donations/quote` | – | Rincian diskon/fee sebelum bayar | Halaman support (informasional) |
| POST | `/donations/intents` | Header | Kunci donasi/diskon (pra-pembayaran) | `runOnChainPayment()` |
| POST | `/donations/intents/:id/tx` | Header | Lapor `txHash` → verifikasi + confirm instan | `reportDonationTx()` (opsional) |
| GET | `/donations/intents/:id` | Header | Poll status satu intent | Polling status |
| GET | `/donations/mine` | Header | List donasi on-chain (paginated) | My Supports |
| GET | `/wallet/balance` | Header | Saldo demo wallet USD | Profile |
| POST | `/wallet/transfer` | Header | Transfer demo ke komunitas (atomik) | `runDemoPayment()` |
| GET | `/wallet/history` | Header | Mutasi ledger saldo | Profile |
| GET | `/wallet/transfers` | Header | Riwayat transfer demo | My Supports |
| GET | `/users/me` | Header | Profil + saldo + counter donasi | Auth/profile/navbar |
| GET | `/stats` | – | Agregat per komunitas (leaderboard) | `useCommunities()` |

Server-side caching: communities 15s · community detail 30s · stats 10s · quote 60s (per project+amount+campaign).

---

## 5. Alur Utama

### 5.1 Browse komunitas (`lib/community-data.ts`)

```
GET /communities ─┐
                  ├─ Promise.all → gabung: komunitas aktif + enrich angka dari /stats
GET /stats      ──┘                (supporterCount = total_donations, totalSupported = formatMon(total_community_wei))

Gagal / kosong  → fallback ke mock data lokal (lib/mock-data.ts), flag isFallback = true
```

### 5.2 Donasi on-chain (rail MON) — `app/communities/[id]/support/page.tsx`

```
  User pilih amount (preset / custom, divalidasi regex ^\d+(\.\d+)?$ & > 0)
        │
        ▼
[1] POST /donations/quote { projectSlug, amount }          (informasional; gagal diabaikan)
    → rincian: gross, discount (campaign), net, platformFee 2%, communityAmount
        │
        ▼
[2] switchChainAsync(monadTestnet)                         (wallet harus di jaringan Monad)
        │
        ▼
[3] POST /donations/intents { projectSlug, amount }
    Header: Idempotency-Key: <crypto.randomUUID()>
    → { intentId, status: "PENDING_PAYMENT", payThisWei }
    ⚠ SATU intent per percobaan bayar — intent PENDING di-reuse saat retry
      (disimpan di intentRef; dibuang hanya setelah tx terkirim)
        │
        ▼
[4] sendTransactionAsync({ to: payout_address, value: BigInt(payThisWei), chainId })
    ⚠ value = payThisWei dari INTENT (bukan dihitung ulang dari quote yang di-cache 60s)
    → txHash; simpan hash SEBELUM langkah apa pun
        │
        ▼
[5] POST /donations/intents/:id/tx { txHash }              (opsional — percepat konfirmasi)
    → backend verifikasi on-chain (to + value cocok + tx sukses) → status CONFIRMED
    → gagal/abaikan: watcher backend tetap backstop
        │
        ▼
[6] UI langsung "success" (record status: "pending" di app-state)
    Polling background: GET /donations/intents/:id tiap 4s sampai status berubah
    (timeout 5 menit) → updateSupportStatus("completed" | "failed")
```

**State machine status donasi (backend):**

```
PENDING_PAYMENT ──(terlihat on-chain)──> CONFIRMED ──(reconciled)──> RECONCILED
       │
       └──(dibatalkan/refund)──> FAILED
```

Pemantik konfirmasi backend (dua jalur):
1. **Report tx** (`POST .../tx`) — frontend melaporkan hash, backend memverifikasi langsung.
2. **Watcher on-chain** — backend mengamati transfer ke `payout_address` dengan `value` = `payThisWei` persis; cocok → intent `CONFIRMED` dalam beberapa detik setelah masuk blok.

### 5.3 Donasi demo wallet (rail USD)

```
[1] Pastikan sign-in (connect wallet + GET /users/me)
[2] POST /wallet/transfer { communitySlug, projectSlug?, amountUsd: number }
    → atomik di backend: debit saldo + catat transfer dalam 1 transaksi DB
    → { transferId, amountUsd: "25.00", community, newBalanceUsd }
[3] Record "completed" → success screen → refreshUser() (update saldo navbar/profile)
    Saldo kurang → 400 "insufficient wallet balance" → pesan ramah + sisa saldo
```

### 5.4 My Supports (`app/my-supports/page.tsx`)

```
GET /wallet/transfers?limit=50&offset=0 ─┐
                                         ├─ Promise.all → merge & sort by date
GET /donations/mine?limit=50&offset=0  ──┘
    - transfer demo  → baris "$" (status COMPLETED → confirmed)
    - donasi on-chain → baris "⛓" (statusToUi)
    Total donasi     → dari GET /users/me (user.wallet.totalDonatedUsd)

Live refresh: setiap donasi masih PENDING_PAYMENT → poll GET /donations/intents/:id
tiap 5s sampai status berubah → update baris + refreshUser()
```

### 5.5 Profile / dashboard (`app/profile/page.tsx`)

```
GET /users/me        → identitas, memberSince, balanceUsd, totalDonatedUsd, donationCount
GET /wallet/balance  → saldo demo terkini
GET /wallet/history  → mutasi ledger (SIGNUP_BONUS | DONATION | REFUND | ADJUSTMENT),
                       running balance di balance_after
```

### 5.6 Health check (`fetchHealth()`)

```
GET /health (x-api-key) → { status: "ok" | "degraded", checks: { db, cache, monadRpc } }
status "degraded" + HTTP 503 → tampilkan banner maintenance
```

---

## 6. Lapisan Klien API (`lib/api/`)

| File | Peran |
|---|---|
| `client.ts` | `request()` core: set header `x-api-key` + `x-wallet-address`, baca localStorage `sutu_wallet`, unwrap envelope `{ data, meta }`, lempar `ApiError` |
| `endpoints.ts` | Fungsi typed per endpoint (fetchMe, fetchCommunities, quoteDonation, createDonationIntent, reportDonationTx, transferFromWallet, dll.) |
| `types.ts` | Tipe kontrak API (Community, DonationQuote, DonationIntent, WalletBalance, ...) |
| `format.ts` | `formatMon` (wei→MON via BigInt), `parseMonToWei`, `shortHex`, `statusToUi`, `uuidToBytes32` (untuk kontrak `donate()` di masa depan) |

---

## 7. Gotchas yang Dijaga Frontend

- Wei = **string**, semua aritmetika via `BigInt` — dilarang `parseFloat`.
- `payThisWei` dari **intent** = `msg.value` yang persis; jangan hitung ulang dari quote (cache 60 detik).
- Satu intent per percobaan bayar; reuse intent `PENDING_PAYMENT` saat retry; kirim `Idempotency-Key` UUID.
- `amount` donasi: `> 0` dan `≤ 1.000.000 MON` (server menolak dengan 400).
- Gunakan `sendTransactionAsync` (bukan `sendTransaction`) dan selalu `try/catch` rejection wallet agar spinner tidak menggantung.
- `discountApplied: false` = normal (tanpa badge diskon), bukan error.
- Poll satu intent via `/donations/intents/:id`, bukan `/donations/mine`.

---

## 8. Kondisi & Rencana Backend (dari QA `MD/BACKEND_NOTES.md`)

Status live per 10 Sep 2026:

| Item | Status |
|---|---|
| SIWE (`/auth/nonce`, `/auth/verify`) | ❌ 404 — belum dideploy; auth sementara via header (tidak aman untuk production: siapa pun dengan alamat orang lain bisa memakai demo wallet-nya) |
| Lapor `txHash` (`POST .../tx`) | ✅ Sudah ada (§4.3b) — permintaan critical #3 terpenuhi |
| Idempotency-Key | ✅ Berfungsi (request sama → intentId sama) |
| Ownership check intent | ✅ Intent user lain → 404 |
| Transfer demo atomik | ✅ Debit + history konsisten |
| `search`/`category`/`limit` di `/communities` | ⚠ Documented tapi diabaikan server — frontend memfilter di client |
| Validasi `amount: "0"` di intents | ⚠ 500 INTERNAL (harusnya 400) — frontend memvalidasi ulang di client |
| Normalisasi address lowercase, `meta.total`, rate limit per-endpoint | ⚠ Menunggu backend |

**Roadmap produksi:** deploy SIWE (nonce → sign → verify → JWT 7 hari) lalu frontend kembali ke `Authorization: Bearer` (kode sudah disiapkan: `NonceResponse`, `VerifyResponse`, `getToken`); deploy kontrak `donate(communityWallet, tag)` dengan `tag = uuidToBytes32(intentId)`.
