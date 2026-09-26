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
| `UNAUTHORIZED` | 401 | JWT hilang/kedaluwarsa, signature salah, atau nonce basi. |
| `NOT_FOUND` | 404 | Resource (komunitas/project/campaign/intent) tidak ada. |
| `CONFLICT` | 409 | Duplikat. |
| `INTERNAL` | 500 | Error server. Retry sekali, kalau masih gagal tampilkan "coba lagi nanti". |

---

## 2. Auth — SIWE (Sign-In With Ethereum)

Login pakai wallet. Tanpa password, tanpa signup terpisah — user otomatis terdaftar di login pertama, dan **langsung dapat bonus $1.000 demo wallet**.

### 2.1 Minta nonce

```
POST /api/v1/auth/nonce
Content-Type: application/json

{ "walletAddress": "0xAbC..." }
```

Response:
```json
{
  "data": {
    "nonce": "a1b2c3d4e5f60718293a4b5c6d7e8f10",
    "message": "sutu.tixrouter.my.id wants you to sign in with your Monad account:\n0xAbC...\n\nSign in to SUTU - community donations on Monad.\n\nURI: https://sutu.tixrouter.my.id\nVersion: 1\nChain ID: 10143\nNonce: a1b2...\nIssued At: 2026-09-09T14:00:00.000Z"
  }
}
```

### 2.2 Verify signature → dapat JWT

```
POST /api/v1/auth/verify
Content-Type: application/json

{
  "walletAddress": "0xAbC...",
  "nonce": "a1b2c3d4e5f60718293a4b5c6d7e8f10",
  "signature": "0x...",
  "message": "sutu.tixrouter.my.id wants you to sign in with..."
}
```

Response:
```json
{
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "wallet_address": "0xabc..." }
  }
}
```

- JWT berlaku **7 hari**. Simpan di localStorage (cukup untuk hackathon).
- Nonce **sekali pakai**, kadaluarsa **5 menit**.
- `message` harus di-sign **persis apa adanya** — jangan rebuild string di frontend.

### 2.3 Panggil endpoint terproteksi

```
Authorization: Bearer <token>
```

Dapat 401 → token kedaluwarsa → ulangi flow SIWE dari 2.1.

### Contoh lengkap dengan wagmi

```ts
async function login(
  address: `0x${string}`,
  signMessage: (args: { message: string }) => Promise<string>
) {
  const base = 'https://sutu.tixrouter.my.id/api/v1';

  const nonceRes = await fetch(`${base}/auth/nonce`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ walletAddress: address }),
  }).then((r) => r.json());

  const signature = await signMessage({ message: nonceRes.data.message });

  const verifyRes = await fetch(`${base}/auth/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      walletAddress: address,
      nonce: nonceRes.data.nonce,
      signature,
      message: nonceRes.data.message,
    }),
  }).then((r) => r.json());

  localStorage.setItem('sutu_token', verifyRes.data.token);
  return verifyRes.data.user; // + otomatis dapat saldo $1.000 demo
}

// Helper untuk semua request yang butuh auth
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sutu_token');
  const res = await fetch(`https://sutu.tixrouter.my.id/api/v1${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.error?.code}: ${body.error?.message}`);
  return body.data as T;
}
```

---

## 3. Communities & Projects (publik, tanpa auth)

### 3.1 List komunitas

```
GET /api/v1/communities
```

Response:
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

### 4.1 Quote (publik) — berapa yang user bayar?

```
POST /api/v1/donations/quote
Content-Type: application/json

{ "projectSlug": "beatforge-album-vol2", "amount": "1" }
```

- `amount`: string desimal MON, contoh `"0.5"`, `"1"`, `"2.75"`. Tanpa tanda minus, tanpa notasi eksponen.
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

### 4.2 Buat donation intent (perlu auth)

Sebelum user bayar, buat intent dulu. Ini **mengunci diskon** untuk donasi ini.

```
POST /api/v1/donations/intents
Authorization: Bearer <token>
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

**Alur saat ini (kontrak belum dideploy — fallback demo):**

Kirim MON **langsung** ke `payout_address` komunitas dengan `value = BigInt(payThisWei)`:

```ts
await sendTransaction({
  to: communityPayoutAddress,   // dari GET /communities/:slug
  value: BigInt(payThisWei),    // dari intent — JANGAN hitung ulang dari quote
});
```

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

Apa pun jalannya, **simpan `txHash` dari wallet** — berguna untuk support/debugging.

> **PENTING:** `payThisWei` adalah `msg.value` yang persis. Jangan hitung ulang dari quote — quote di-cache 60 detik dan campaign bisa berubah. Selalu pakai nilai dari intent.

### 4.4 Poll status donasi (perlu auth)

```
GET /api/v1/donations/intents/:intentId
Authorization: Bearer <token>
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

### 4.5 List donasi saya (perlu auth)

```
GET /api/v1/donations/mine?limit=20&offset=0
Authorization: Bearer <token>
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

## 5. Wallet Demo $1.000 (perlu auth)

Ledger off-chain untuk demo — setiap user baru otomatis dapat **$1.000** saat login SIWE pertama. Ini sistem terpisah dari on-chain (lihat tabel di atas).

### 5.1 Cek saldo

```
GET /api/v1/wallet/balance
Authorization: Bearer <token>
```

Response:
```json
{ "data": { "balanceUsd": "1000.00" } }
```

> `balanceUsd` adalah **string** dengan 2 desimal — bukan angka. Jangan dihitung pakai float; untuk tampilan langsung render saja.

### 5.2 Transfer ke komunitas (donasi demo)

```
POST /api/v1/wallet/transfer
Authorization: Bearer <token>
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

Error `VALIDATION_ERROR` (400) dengan message `insufficient wallet balance` → saldo tidak cukup; tampilkan pesan ramah + sisa saldo.

Transfer ini **atomik**: debit saldo + catat transfer dalam satu transaksi DB. Gagal = rollback, saldo tidak terpotong.

### 5.3 Riwayat ledger saldo

```
GET /api/v1/wallet/history?limit=20&offset=0
Authorization: Bearer <token>
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
Authorization: Bearer <token>
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

## 6. Dashboard user (perlu auth)

Satu endpoint untuk halaman "Akun Saya":

```
GET /api/v1/users/me
Authorization: Bearer <token>
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

| Method | Path | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/v1/auth/nonce` | – | Minta SIWE message + nonce |
| POST | `/api/v1/auth/verify` | – | Verify signature → JWT (+ bonus $1.000) |
| GET | `/api/v1/communities` | – | List komunitas |
| GET | `/api/v1/communities/:slug` | – | Detail komunitas + projects |
| POST | `/api/v1/donations/quote` | – | Rincian diskon/fee |
| POST | `/api/v1/donations/intents` | Bearer | Kunci donasi (pra-pembayaran) |
| GET | `/api/v1/donations/intents/:id` | Bearer | Poll status satu intent |
| GET | `/api/v1/donations/mine` | Bearer | List donasi saya (paginated) |
| GET | `/api/v1/wallet/balance` | Bearer | Saldo demo wallet |
| POST | `/api/v1/wallet/transfer` | Bearer | Transfer demo ke komunitas |
| GET | `/api/v1/wallet/history` | Bearer | Mutasi ledger saldo |
| GET | `/api/v1/wallet/transfers` | Bearer | Riwayat transfer demo |
| GET | `/api/v1/users/me` | Bearer | Dashboard: profil + saldo + counter |
| GET | `/api/v1/stats` | – | Leaderboard/agg stats |
| GET | `/health` | – | Health service |

## 10. Checklist gotchas

- [ ] Semua nilai **wei** = string. Matematika pakai `BigInt`. Jangan pernah `parseFloat` wei string.
- [ ] `amountUsd` (wallet demo) = **JSON number**; `balanceUsd` di response = **string**. Beda arah, beda tipe.
- [ ] SIWE message dari `/auth/nonce` di-sign **persis apa adanya** — jangan trim/ubah.
- [ ] Kirim `Idempotency-Key` (UUID) di `POST /donations/intents` — satu UUID per percobaan donasi.
- [ ] `payThisWei` dari **intent** adalah `msg.value` yang persis. Jangan hitung ulang dari quote (cached 60s).
- [ ] Poll status via `/donations/intents/:id` (bukan `/mine`) untuk satu donasi spesifik.
- [ ] 401 di endpoint mana pun → token kedaluwarsa → ulangi SIWE.
- [ ] `discountApplied: false` = tidak ada campaign aktif → tampilkan tanpa badge diskon (bukan error).
- [ ] CORS belum dikonfigurasi. Kalau frontend memanggil API langsung dari browser di domain lain, kabari tim backend untuk menambah origin kamu di middleware `cors`.
-