# Catatan QA Frontend → Tim Backend SUTU

> Hasil pengujian nyata frontend (`commons-web3-ui`) terhadap **https://sutu.tixrouter.my.id** pada **10 Sep 2026**.
> Semua temuan direproduksi langsung via curl — bukan dugaan. Format response konsisten dengan envelope
> `{ data }` / `{ error: { code, message } }` sesuai `backend_to_front_end.md`.

---

## 🔴 CRITICAL

### 1. Auth saat ini tidak aman — header `X-Wallet-Address` bisa dipalsukan
Dokumen (§2) mendeskripsikan SIWE + JWT, tapi **`POST /auth/nonce` dan `POST /auth/verify` belum di-deploy (404)**
dan auth nyata yang aktif adalah header bebas:

```
GET /api/v1/users/me                       → 401 "missing or invalid X-Wallet-Address header"
GET /api/v1/users/me  + X-Wallet-Address   → 200 (user + saldo dibuat otomatis)
```

Konsekuensi: **siapa pun yang tahu alamat wallet orang lain bisa membaca saldo/riwayat dan membelanjakan
demo wallet-nya** — cukup set header. Tidak ada bukti kepemilikan wallet (signature) sama sekali.
Untuk demo internal tidak apa; untuk production ini blocker.

**Minta:** deploy SIWE flow sesuai dokumen (nonce → sign → verify → JWT), atau minimal EIP-191/EIP-712
personal_sign challenge per session.

### 2. `POST /donations/intents` dengan `amount: "0"` → 500 INTERNAL
```
POST /donations/intents {"projectSlug":"beatforge-album-vol2","amount":"0"}
→ {"error":{"code":"INTERNAL","message":"Internal server error"}}
```
Sedangkan `POST /donations/quote` dengan `"0"` **lolos** (200, grossAmountWei="0"). Artinya validasi
amount tidak konsisten antara quote dan intent, dan intent crash sampai ke 500 (kemungkinan unhandled
exception, bukan VALIDATION_ERROR). `"0"` seharusnya ditolak 400 seperti `"−1"` / `"abc"`.

**Minta:** zod schema intent menolak `0`/negatif dengan VALIDATION_ERROR; samakan dengan schema quote;
pastikan tidak ada 500 dari input user (itu bug logic, bukan validasi).

### 3. Frontend tidak bisa melaporkan `tx_hash` — status on-chain tergantung watcher internal
Tidak ada endpoint untuk melaporkan transaksi (semua 404):
```
POST /donations/intents/:id/confirm | /tx | /donations/report | PATCH /donations/intents/:id → 404
```
Alur pembayaran on-chain: user confirm di MetaMask → tx broadcast → frontend poll
`GET /donations/intents/:id` → tetap `PENDING_PAYMENT` tanpa batas waktu yang bisa diprediksi frontend.
Kami terpaksa merilis UI "submitted" segera + polling background, tapi ini work-around, bukan solusi.

**Minta (salah satu):**
- `POST /donations/intents/:id/tx` `{ "txHash": "0x..." }` — backend verifikasi on-chain dan konfirmasi intent; **atau**
- konfirmasi watcher langsung-ke-`payout_address` benar-benar jalan di testnet, dan sebutkan SLA waktunya.

---

## 🟠 HIGH

### 4. Dokumentasi tidak sinkron dengan implementasi
| Item | Dokumen | Live |
|---|---|---|
| Auth | SIWE + Bearer JWT | header `X-Wallet-Address` |
| `POST /auth/nonce`, `/auth/verify` | ada | 404 |
| Response `GET /donations/intents/:id` | `confirmed_at`, tanpa USD | ada `amount_usd`, `discount_usd`, `community_amount_usd`, **tanpa** `confirmed_at` di satu pengetesan kami |
| CORS | "belum dikonfigurasi" | `access-control-allow-origin: *` aktif |

`access-control-allow-origin: *` juga **berbeda dengan aturan dokumen** (origin harus di-whitelist).
Untuk API publik read-only ok, tapi kombinasi `*` + credential-style auth header perlu ditinjau.

**Minta:** update `backend_to_front_end.md` atau rollback ke spec — tim frontend memakai dokumen itu sebagai
kontrak. Field tambahan (`*_usd`) dipakai untuk UI — tolong didokumentasikan.

### 5. `GET /communities` mengabaikan semua query params (search/filter/pagination tidak jalan)
```
?search=beatforge → 20 komunitas (harusnya ≤ beberapa)
?category=music   → 20
?limit=3          → 20
```
Sementara `?limit=0` / `?limit=1000` / `?offset=-1` di endpoint lain di-validasi (400). Frontend harus
memfilter 20 komunitas di client — ok untuk sekarang, tapi ini kontrak API yang menyesatkan.

**Minta:** implementasi `search`/`category`/`limit`/`offset` (atau hapus dari kontrak agar tidak dipakai).

### 6. Quote amount ekstrem diterima tanpa batas atas
```
"999999999" MON → 200 dengan campaign match
"0.0000001"     → 200
```
Tidak ada `min`/`max` donasi. Untuk hackathon ok; sebelum production perlu batas (mis. ≥ 0.000001 dan
≤ supply wajar) supaya tidak bikin intent sampah/overflow display.

---

## 🟡 MEDIUM / catatan

### 7. Wallet address tidak dinormalisasi (checksum vs lowercase)
`X-Wallet-Address: 0xAbC0…0001` membuat user dengan `wallet_address` `0xabc0…0001` (lowercase) —
artinya address yang sama bisa terdaftar 2× dengan casing berbeda. Lowercase-kan di server sebelum lookup/create.

### 8. Pagination `limit`/`offset` punya max tapi tidak dikomunikasikan
`limit=1000` → 400. Berapa max-nya? Sebutkan di dokumen (mis. `limit ≤ 100`) + `meta.total` di response
agar frontend bisa bikin "load more" yang benar (sekarang hanya `limit`, `offset`).

### 9. Rate limiting
12 request quote beruntun → semua 200, tidak ada 429. Untuk hackathon ok; sebelum production tambahkan
rate limit per-IP/per-wallet terutama di `auth/*`, `donations/intents`, `wallet/transfer`.

### 10. Hal baik yang sudah dites dan JALAN ✅
- Idempotency-Key di `POST /donations/intents` **berfungsi**: 2× request dengan key sama → intentId sama.
- Ownership check intent: intent user lain → 404 (bukan 200).
- `POST /donations/quote` hitung diskon/fee benar (gross −10%, fee 2% dari net).
- `POST /wallet/transfer` atomik, saldo terpotong benar, masuk `/wallet/history` & `/wallet/transfers`.
- `/health` informatif (db/cache/monadRpc + block height).
- Header case-insensitive (`x-wallet-address` juga diterima).
- Validasi zod jalan untuk kasus jelas (negatif, string bukan angka, eksponen, `"1.5.5"`).

---

## Ringkasan permintaan prioritas
1. **[CRITICAL] SIWE/nonce/verify deploy + token** — atau minimal signed challenge.
2. **[CRITICAL] Fix 500 di `POST /donations/intents` amount "0"** + samakan validasi quote/intent.
3. **[CRITICAL] Endpoint lapor `tx_hash`** (atau konfirmasi watcher + SLA).
4. **[HIGH] Sinkronkan dokumen ↔ implementasi** (auth, CORS, field `*_usd`).
5. **[HIGH] `search`/`category`/`limit` di `/communities`** — jalan atau dihapus dari kontrak.
6. **[MEDIUM] Normalisasi address lowercase, `meta.total`, batas amount, rate limit.**

— Dari tim frontend SUTU (hasil QA 10 Sep 2026, semuanya reproducible via curl)
