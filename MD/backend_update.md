# SUTU Backend — Panduan Integrasi Front-End

> **Base URL production** (tunnel Cloudflare terautentikasi, sudah LIVE):
>
> ```
> https://sutu.tixrouter.my.id
> ```

Semua endpoint berprefix `/api/v1`. Semua body request/response JSON.

**Aturan paling penting:** semua nilai uang on-chain (wei) dikirim sebagai **string desimal** — JANGAN pernah di-parse sebagai `Number`/float (JS kehilangan presisi di atas 2^53).

- `1 MON` = `"1000000000000000000"` (18 nol)
- Untuk matematika pakai `BigInt`:

```ts
function formatMon(weiStr: string, decimals = 4): string {
  const wei = BigInt(weiStr);
  const whole = wei / 10n ** 18n;
  const frac = (wei % 10n ** 18n).toString().padStart(18, '0').slice(0, decimals);
  return `${whole}.${frac}`;
}
```

**Dua sistem uang di SUTU (jangan tertukar):**

| Sistem | Satuan | Sumber kebenaran | Dipakai untuk |
|---|---|---|---|
| **On-chain (Monad)** | wei (string) | Blockchain + kontrak | Donasi asli via wallet |
| **Demo wallet** | USD (angka) | Ledger DB backend | Saldo $1.000 demo, transfer ke komunitas tanpa gas |

---

## 1. Response envelope

Semua response — sukses maupun error — bentuknya konsisten.

**Sukses:**
```json
{ "data": { ... } }
```
Endpoint list biasanya menambah `meta` (info pagination).

**Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "invalid quote request",
    "details": { ... }
  }
}
```

| code | HTTP | Arti |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body/query gagal validasi skema. `details` berisi field error dari zod. |
| `UNAUTHORIZED` | 401 | Header `X-Wallet-Address` hilang atau bukan alamat valid. |
| `NOT_FOUND` | 404 | Resource (komunitas/project/campaign/intent) tidak ada. |
| `CONFLICT` | 409 | Duplikat. |
| `INTERNAL` | 500 | Error server. Retry sekali, kalau masih gagal tampilkan "coba lagi nanti". |

---

## 2. API Key + Identitas Demo (tanpa login)

> ⚠️ **Mode demo.** Tidak ada login, signature, atau JWT. Dua header wajib:
>
> | Header | Isi | Fungsi |
> |---|---|---|
> | `X-API-Key` | key dari tim backend | Gerbang API — **semua endpoint termasuk `/health`** |
> | `X-Wallet-Address` | alamat wallet `0x...` | Identitas user (endpoint bertanda **Header**) |

### 2.1 Aturan API key

- Semua request tanpa `X-API-Key` → **401** dan **dihitung ke kuota**: maks **2 request/menit per IP**; lebih dari itu IP di-**ban 60 detik** (429 + header `Retry-After`).
- Key salah → 401 juga, dan ikut kena kuota/ban yang sama (anti brute-force).
- Key valid → akses penuh, tanpa kuota.
- Minta key ke tim backend. Yang aktif sekarang dikelola di env `API_KEYS` backend.

### 2.2 Identitas user: `X-Wallet-Address`

Untuk endpoint bertanda **Header** di dokumen ini, tambahkan:

```
X-Wallet-Address: 0xYourWalletAddress
```

Aturan:
- Harus alamat EVM valid (`0x` + 40 karakter hex). Backend menormalkan ke lowercase.
- **Alamat yang sama = identitas yang sama.** Saldo, history, dan donasi mengikuti alamat. Ganti alamat = ganti akun.
- Header hilang / format salah → **401 `UNAUTHORIZED`**.
- User otomatis terdaftar di request pertama dan langsung dapat **bonus $1.000** demo wallet.

### 2.2 Helper fetch untuk frontend

```ts
const BASE = 'https://sutu.tixrouter.my.id/api/v1';
const API_KEY = '<minta ke tim backend>';

// Dengan wagmi: ganti konstanta ini dengan `address` dari useAccount()
export const DEMO_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'x-wallet-address': DEMO_ADDRESS,
      ...init?.headers,
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.error?.code}: ${body.error?.message}`);
  return body.data as T;
}

// Contoh: request pertama = auto-register + langsung ada saldo $1.000
const me = await api('/users/me');
console.log(me.wallet.balanceUsd); // "1000.00"
```

---

## 3. Communities & Projects (publik)

### 3.1 List komunitas

```
GET /api/v1/communities?search=&category=&limit=100&offset=0
```

Query params (semua opsional):

| Param | Aturan | Fungsi |
|---|---|---|
| `search` | string 1–80 | Match `name`/`slug`/`description` (case-insensitive) |
| `category` | string 1–40 | Filter persis: `music` / `game` / `charity` |
| `limit` | 1–100 (default 100) | Page size |
| `offset` | ≥ 0 (default 0) | Untuk "load more" |

Response selalu menyertakan `meta.total`:
```json
{
  "data": [
    {
      "id": "f60bcc28-...",
      "slug": "beatforge",
      "name": "BeatForge Collective",
      "description": "Independent music producers funding albums, gear and studio time.",
      "category": "music",
      "payout_address": "0x1111...",
      "is_active": true,
      "created_at": "2026-09-09T..."
    }
  ]
}
```

- `category`: `"music" | "game" | "charity" | null`.
- `payout_address` = alamat tujuan dana on-chain komunitas.
- Cache server 15 detik — aman di-poll.
- Di DB sudah ada **20 komunitas demo** (music/game/charity).

### 3.2 Detail komunitas + projectnya

```
GET /api/v1/communities/:slug
```

Contoh: `GET /api/v1/communities/beatforge`

Response = objek komunitas + array `projects`:
```json
{
  "data": {
    "id": "...",
    "slug": "beatforge",
    "name": "BeatForge Collective",
    "...": "...",
    "projects": [
      {
        "id": "95cab317-...",
        "community_id": "...",
        "slug": "beatforge-album-vol2",
        "name": "BeatForge Album Vol. 2",
        "description": "Record and master the second community compilation.",
        "funding_goal_wei": "5000000000000000000",
        "is_active": true,
        "created_at": "..."
      }
    ]
  }
}
```

`project.slug` adalah kunci yang dipakai untuk quote & intent donasi.

---

## 4. Donasi On-Chain

### 4.1 Quote — berapa yang user bayar?

```
POST /api/v1/donations/quote
Content-Type: application/json
X-API-Key: <key>

{ "projectSlug": "beatforge-album-vol2", "amount": "1" }
```

- `amount`: string desimal MON, contoh `"0.5"`, `"1"`, `"2.75"`. Tanpa tanda minus, tanpa notasi eksponen. **Batas: > 0 dan ≤ 1.000.000 MON** — di luar itu → 400 (bukan 500).
- `projectSlug`: slug project dari 3.2.

Response:
```json
{
  "data": {
    "projectId": "95cab317-...",
    "campaignId": "c9bc16c5-...",
    "campaignName": "Launch Week 10% Off",
    "grossAmountWei": "1000000000000000000",
    "discountWei": "100000000000000000",
    "netAmountWei": "900000000000000000",
    "discountBps": 1000,
    "platformFeeBps": 200,
    "platformFeeWei": "18000000000000000",
    "communityAmountWei": "882000000000000000",
    "discountApplied": true
  }
}
```

Arti field (wei string kecuali disebut lain):

| Field | Arti |
|---|---|
| `grossAmountWei` | Nominal yang diketik user (MON → wei). |
| `discountWei` | Rebate campaign — jumlah yang dihemat user. |
| `netAmountWei` | **Yang benar-benar dibayar user** = gross − discount. |
| `discountBps` | Persen diskon dalam basis point (1000 = 10%). |
| `platformFeeBps` | Fee platform dalam bps (200 = 2%). Diambil dari net, bukan dari kantong user. |
| `platformFeeWei` | Porsi platform. |
| `communityAmountWei` | Yang diterima komunitas. |
| `discountApplied` | `true` kalau ada campaign aktif yang match. |

Contoh tampilan di halaman donasi:
```
Kamu donasi:       1 MON
Campaign:          Launch Week 10% Off  (-10%)
Kamu bayar:        0.9 MON
Komunitas dapat:   0.882 MON
Fee platform:      0.018 MON (2%)
```

**Tanpa campaign aktif** — `campaignId`, `campaignName` = `null`, `discountApplied` = `false` (bukan error). Contoh nyata dari API live (project `nusa-play-main`):

```json
{
  "data": {
    "projectId": "73527bc1-f493-45ea-b714-fe7c03613991",
    "campaignId": null,
    "campaignName": null,
    "grossAmountWei": "1000000000000000000",
    "discountWei": "0",
    "netAmountWei": "1000000000000000000",
    "discountBps": 0,
    "platformFeeBps": 200,
    "platformFeeWei": "20000000000000000",
    "communityAmountWei": "980000000000000000",
    "discountApplied": false
  }
}
```

UI: tampilkan "Kamu bayar: 1 MON" tanpa badge diskon. Fee platform tetap dihitung dari gross.

### 4.2 Buat donation intent (Header)

Sebelum user bayar, buat intent dulu. Ini **mengunci diskon** untuk donasi ini.

```
POST /api/v1/donations/intents
X-Wallet-Address: 0xYourWalletAddress
Content-Type: application/json

{ "projectSlug": "beatforge-album-vol2", "amount": "1" }
```

Header opsional tapi disarankan:
- `Idempotency-Key: <uuid-acak>` — kalau request timeout dan kamu retry **dengan key yang sama**, API mengembalikan intent yang sama, bukan bikin duplikat. Ganti UUID baru untuk donasi baru.

Response 201:
```json
{
  "data": {
    "intentId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "status": "PENDING_PAYMENT",
    "payThisWei": "900000000000000000",
    "discountWei": "100000000000000000",
    "campaignId": "c9bc16c5-...",
    "createdAt": "2026-09-09T14:05:00.000Z"
  }
}
```

### 4.3 Bayar on-chain (tugas frontend)

Intent = catatan backend. Pembayaran aslinya = transaksi Monad yang di-sign user di wallet.

**Alur saat ini (transfer langsung — tanpa kontrak):**

Kirim MON **langsung** ke `payout_address` komunitas dengan `value = BigInt(payThisWei)`:

```ts
await sendTransaction({
  to: communityPayoutAddress,   // dari GET /communities/:slug
  value: BigInt(payThisWei),    // dari intent — JANGAN hitung ulang dari quote
});
```

Backend watcher otomatis mendeteksi transfer langsung ini (pencocokan `to` = payout address + `value` = `payThisWei` persis) dan mengubah intent menjadi `CONFIRMED` dalam beberapa detik setelah tx masuk blok.

**Flow wagmi yang benar (jangan sampai UI mentok "waiting confirm"):**

```ts
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

// PAKAI sendTransactionAsync, BUKAN sendTransaction —
// sendTransaction (mutation) TIDAK mengembalikan hash sebagai promise.
const { sendTransactionAsync } = useSendTransaction();

async function pay() {
  try {
    const hash = await sendTransactionAsync({
      to: communityPayoutAddress,
      value: BigInt(payThisWei),   // string wei -> BigInt
      // chainId: monadTestnet.id,  // pastikan wallet di jaringan Monad
    });
    setTxHash(hash);              // simpan hash SEBELUM apa pun
    // UI state: 'submitted'
  } catch (e) {
    // User reject di wallet / error jaringan -> KELUAR dari spinner di sini
    setUiState('user_rejected');
  }
}

// Setelah ada hash, tunggu receipt (konfirmasi):
const { data: receipt } = useWaitForTransactionReceipt({ hash: txHash! });
// receipt?.status === 'success' -> poll intent: status jadi CONFIRMED
```

Kesalahan umum yang bikin "waiting confirm wallet" muter terus:
1. Pakai `sendTransaction` lalu menganggap return-nya hash — dia tidak pernah resolve dengan hash. Pakai `sendTransactionAsync`.
2. Popup wallet di-dismiss/tidak di-handle promise rejection-nya → spinner jalan selamanya. Selalu `try/catch` dan matikan spinner di `catch`.
3. Bikin intent baru setiap klik "donate" → menumpuk intent `PENDING_PAYMENT`. **Satu intent per percobaan bayar**; kalau user batal di wallet, reuse intent yang sama saat retry (selama belum bayar).
4. Value dihitung ulang dari quote (cached) ≠ nilai intent → tx terkirim tapi tidak pernah match. Selalu `BigInt(intent.payThisWei)`.

**Ketika kontrak sudah dideploy:**

Panggil `donate(communityWallet, tag)` dengan `msg.value = payThisWei`:
- `communityWallet` = `payout_address` komunitas.
- `tag` = `bytes32` dari `intentId` (UUID tanpa strip, zero-pad ke 32 byte) — koordinasi dengan tim backend untuk helper encoding-nya (sudah ada: `uuidToBytes32`).

```ts
import { encodeFunctionData } from 'viem';

const data = encodeFunctionData({
  abi: [{
    type: 'function',
    name: 'donate',
    stateMutability: 'payable',
    inputs: [
      { name: 'communityWallet', type: 'address' },
      { name: 'tag', type: 'bytes32' },
    ],
    outputs: [],
  }],
  args: [communityPayoutAddress, uuidToBytes32(intentId)],
});

await sendTransaction({
  to: SUTU_CONTRACT_ADDRESS,
  data,
  value: BigInt(payThisWei),
});
```

Apa pun jalannya, **simpan `txHash` dari wallet** — langsung lapor ke endpoint di 4.3b.

> **PENTING:** `payThisWei` adalah `msg.value` yang persis. Jangan hitung ulang dari quote — quote di-cache 60 detik dan campaign bisa berubah. Selalu pakai nilai dari intent.

### 4.3b Lapor txHash (Header) — percepat konfirmasi

Setelah tx di-broadcast, **langsung lapor hash-nya** — backend verifikasi on-chain dan mengonfirmasi intent tanpa menunggu watcher:

```
POST /api/v1/donations/intents/:intentId/tx
X-API-Key: <key>
X-Wallet-Address: 0xYourWalletAddress
Content-Type: application/json

{ "txHash": "0xabc123..." }
```

Response:
```json
{ "data": { "intentId": "7c9e...", "status": "CONFIRMED", "txHash": "0xabc123..." } }
```

Kemungkinan `status`:
- `"CONFIRMED"` — tx terverifikasi (tujuan & nilai cocok + sukses) → tampilkan sukses.
- `"PENDING_PAYMENT"` + `reason` — tx belum ketemu/belum sukses/nilai tidak cocok → tetap poll (4.4); watcher tetap jalan sebagai backstop. Contoh `reason`: `"tx value does not match the intent amount (payThisWei)"`.
- Kalau intent sudah terlanjur `CONFIRMED`/`RECONCILED` → response sukses idempotent dengan status terkini.

Endpoint ini opsional (watcher tetap mendeteksi transfer langsung dalam beberapa detik), tapi menghilangkan jeda dan membuat status pasti.

### 4.4 Poll status donasi (Header)

```
GET /api/v1/donations/intents/:intentId
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{
  "data": {
    "id": "7c9e6679-...",
    "user_id": "...",
    "community_id": "...",
    "project_id": "...",
    "campaign_id": "...",
    "gross_amount_wei": "1000000000000000000",
    "discount_wei": "100000000000000000",
    "net_amount_wei": "900000000000000000",
    "platform_fee_wei": "18000000000000000",
    "community_amount_wei": "882000000000000000",
    "status": "CONFIRMED",
    "tx_hash": "0xabc123...",
    "idempotency_key": "...",
    "created_at": "...",
    "confirmed_at": "2026-09-09T14:06:00.000Z"
  }
}
```

State machine status:

```
PENDING_PAYMENT ──(terlihat on-chain)──> CONFIRMED ──(reconciled)──> RECONCILED
       │
       └──(dibatalkan/refund)──> FAILED
```

Mapping UI:
- `PENDING_PAYMENT` → spinner "menunggu pembayaran" (atau CTA "bayar sekarang" kalau tx wallet belum dikirim).
- `CONFIRMED` → sukses. Pembayaran sudah on-chain.
- `RECONCILED` → sama seperti CONFIRMED untuk UI (backend sudah settle penuh).
- `FAILED` → tampilkan error + tombol retry.

Strategi polling: tiap **3–5 detik** selama masih `PENDING_PAYMENT`, berhenti begitu status berubah. Kasih timeout ~5 menit → tampilkan state "coba lagi / hubungi support".

### 4.5 List donasi saya (Header)

```
GET /api/v1/donations/mine?limit=20&offset=0
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{
  "data": [ /* array intent, terbaru dulu, bentuk sama dengan 4.4 */ ],
  "meta": { "limit": 20, "offset": 0 }
}
```

Untuk "load more": `offset += limit`.

---

## 5. Wallet Demo $1.000 (Header)

Ledger off-chain untuk demo — setiap user baru otomatis dapat **$1.000** pada request pertama yang memakai header `X-Wallet-Address`. Ini sistem terpisah dari on-chain (lihat tabel di atas).

### 5.1 Cek saldo

```
GET /api/v1/wallet/balance
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{ "data": { "balanceUsd": "1000.00" } }
```

> `balanceUsd` adalah **string** dengan 2 desimal — bukan angka. Jangan dihitung pakai float; untuk tampilan langsung render saja.

### 5.2 Transfer ke komunitas (donasi demo)

```
POST /api/v1/wallet/transfer
X-Wallet-Address: 0xYourWalletAddress
Content-Type: application/json

{
  "communitySlug": "beatforge",
  "projectSlug": "beatforge-album-vol2",
  "amountUsd": 25
}
```

| Field | Wajib? | Catatan |
|---|---|---|
| `communitySlug` | ✅ | Slug komunitas (dari 3.1). |
| `projectSlug` | opsional | Slug project dalam komunitas itu (dari 3.2). |
| `amountUsd` | ✅ | **JSON number** positif, maks 1.000.000. Ini bukan wei string! |
| `donationIntentId` | opsional | UUID intent (4.2) kalau transfer ini menandai donasi on-chain yang sama. |

Response 201:
```json
{
  "data": {
    "transferId": "9f1c...",
    "amountUsd": "25.00",
    "community": "BeatForge Collective",
    "newBalanceUsd": "975.00"
  }
}
```

Contoh dengan `donationIntentId` (menandai transfer demo sebagai donasi dari intent on-chain):

```json
{
  "communitySlug": "beatforge",
  "projectSlug": "beatforge-album-vol2",
  "amountUsd": 25,
  "donationIntentId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

Error `VALIDATION_ERROR` (400) dengan message `insufficient wallet balance` → saldo tidak cukup; tampilkan pesan ramah + sisa saldo.

Transfer ini **atomik**: debit saldo + catat transfer dalam satu transaksi DB. Gagal = rollback, saldo tidak terpotong.

### 5.3 Riwayat ledger saldo

```
GET /api/v1/wallet/history?limit=20&offset=0
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{
  "data": [
    {
      "id": "...",
      "amount_usd": "-25.00",
      "balance_after": "975.00",
      "kind": "DONATION",
      "description": "Donation to community ...",
      "created_at": "2026-09-10T08:00:00.000Z"
    },
    {
      "id": "...",
      "amount_usd": "1000.00",
      "balance_after": "1000.00",
      "kind": "SIGNUP_BONUS",
      "description": "Demo signup bonus",
      "created_at": "2026-09-10T07:59:00.000Z"
    }
  ],
  "meta": { "limit": 20, "offset": 0 }
}
```

`kind`: `SIGNUP_BONUS | DONATION | REFUND | ADJUSTMENT`. Cocok untuk tampilan "mutasi dompet" (running balance di `balance_after`).

### 5.4 Riwayat transfer saya

```
GET /api/v1/wallet/transfers?limit=20&offset=0
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{
  "data": [
    {
      "id": "...",
      "amount_usd": "25.00",
      "status": "COMPLETED",
      "created_at": "...",
      "community_slug": "beatforge",
      "community_name": "BeatForge Collective",
      "project_slug": "beatforge-album-vol2"
    }
  ],
  "meta": { "limit": 20, "offset": 0 }
}
```

---

## 6. Dashboard user (Header)

Satu endpoint untuk halaman "Akun Saya":

```
GET /api/v1/users/me
X-Wallet-Address: 0xYourWalletAddress
```

Response:
```json
{
  "data": {
    "id": "uuid",
    "walletAddress": "0xabc...",
    "memberSince": "2026-09-10T07:59:00.000Z",
    "wallet": {
      "balanceUsd": "975.00",
      "totalDonatedUsd": "25.00",
      "donationCount": 1
    }
  }
}
```

`totalDonatedUsd` & `donationCount` dihitung dari transfer demo berstatus `COMPLETED`.

---

## 7. Stats (publik)

```
GET /api/v1/stats
```

Response:
```json
{
  "data": {
    "communities": [
      {
        "community_slug": "beatforge",
        "total_donations": "42",
        "total_gross_wei": "42000000000000000000",
        "total_discount_wei": "4200000000000000000",
        "total_community_wei": "37128000000000000000"
      }
    ],
    "generatedAt": "2026-09-09T14:00:00.000Z"
  },
  "meta": { "cached": true }
}
```

Hanya donasi `CONFIRMED`/`RECONCILED` yang dihitung. Cache 10 detik. Cocok untuk leaderboard landing page.

---

## 8. Health (publik, untuk monitoring)

```
GET /health
```

```json
{
  "data": {
    "status": "ok",
    "checks": {
      "db": "up",
      "cache": "up",
      "monadRpc": "up (block 61230281)"
    },
    "time": "2026-09-10T08:00:00.000Z"
  }
}
```

`status: "degraded"` + HTTP 503 = DB down → tampilkan banner maintenance.

---

## 9. Referensi cepat

**Semua request wajib header `X-API-Key`** (tanpa key: 2 req/menit per IP lalu ban 60 detik).

| Method | Path | Identitas | Fungsi |
|---|---|---|---|
| GET | `/health` | – | Health service (wajib API key) |
| GET | `/api/v1/communities` | – | List komunitas |
| GET | `/api/v1/communities/:slug` | – | Detail komunitas + projects |
| POST | `/api/v1/donations/quote` | – | Rincian diskon/fee |
| POST | `/api/v1/donations/intents` | Header | Kunci donasi (pra-pembayaran) |
| POST | `/api/v1/donations/intents/:id/tx` | Header | Lapor txHash → verifikasi + confirm |
| GET | `/api/v1/donations/intents/:id` | Header | Poll status satu intent |
| GET | `/api/v1/donations/mine` | Header | List donasi saya (paginated) |
| GET | `/api/v1/wallet/balance` | Header | Saldo demo wallet |
| POST | `/api/v1/wallet/transfer` | Header | Transfer demo ke komunitas |
| GET | `/api/v1/wallet/history` | Header | Mutasi ledger saldo |
| GET | `/api/v1/wallet/transfers` | Header | Riwayat transfer demo |
| GET | `/api/v1/users/me` | Header | Dashboard: profil + saldo + counter |
| GET | `/api/v1/stats` | – | Leaderboard/agg stats |
| GET | `/health` | – | Health service |

## 10. Checklist gotchas

- [ ] **`X-API-Key` wajib di SEMUA request** — tanpa key cuma dapat 2 req/menit lalu di-ban 60 detik (429 + `Retry-After`). Key salah juga kena hitungan yang sama.
- [ ] `amount` donasi: `> 0` dan `≤ 1.000.000 MON` (validasi di server — 400, bukan 500).
- [ ] `GET /communities` mendukung `search`, `category`, `limit` (1–100), `offset` + `meta.total` untuk pagination.
- [ ] Setelah tx broadcast, lapor hash ke `POST /donations/intents/:id/tx` (4.3b) — konfirmasi instan tanpa nunggu watcher.
- [ ] Semua nilai **wei** = string. Matematika pakai `BigInt`. Jangan pernah `parseFloat` wei string.
- [ ] `amountUsd` (wallet demo) = **JSON number**; `balanceUsd` di response = **string**. Beda arah, beda tipe.
- [ ] `X-Wallet-Address` harus alamat valid `0x...` — pakai **alamat yang sama** di semua request agar identitas konsisten (saldo & history mengikuti alamat).
- [ ] Mode demo: identitas tidak diverifikasi signature. Siapkan migrasi ke SIWE sebelum production.
- [ ] **Satu intent = satu percobaan bayar.** Jangan bikin intent baru tiap klik; reuse intent `PENDING_PAYMENT` yang sama saat retry. Intent yang dibuang tapi tak pernah dibayar akan menumpuk di sisi backend.
- [ ] Kirim `Idempotency-Key` (UUID) di `POST /donations/intents` — satu UUID per percobaan donasi.
- [ ] `payThisWei` dari **intent** adalah `msg.value` yang persis. Jangan hitung ulang dari quote (cached 60s).
- [ ] Poll status via `/donations/intents/:id` (bukan `/mine`) untuk satu donasi spesifik.
- [ ] `discountApplied: false` = tidak ada campaign aktif → tampilkan tanpa badge diskon (bukan error).
- [ ] **Server-side caching**: communities 15s, community detail 30s, stats 10s, quote 60s (per kombinasi project + amount + campaign). Setelah admin mengubah campaign, perubahan muncul maksimal dalam jendela TTL itu.
- [ ] Mode demo tanpa kontrak: intent tetap `PENDING_PAYMENT` setelah user bayar (lihat catatan 4.3) — untuk demo sukses instan pakai wallet demo (section 5).
- [ ] **CORS sudah terbuka** (`access-control-allow-origin: *`) — frontend bisa fetch langsung dari browser origin mana pun (localhost included), tanpa perlu proxy. Preflight `OPTIONS` sudah di-handle otomatis.
-