/**
 * Afirmasi kategori — momen "support terkirim" sebagai gestur sosial, bukan struk
 * transaksi (tesis proyek: payments embedded in social gestures).
 *
 * Sumber kategori: backend mengirim `music | game | charity` (backend_update.md
 * §3.1). Kategori mock data (Gaming/Education/…) jatuh ke fallback generik.
 */

export type Affirmation = {
  /** Kata gestur yang muncul besar, seperti pesan chat. */
  word: string;
  /** Label kecil di bawah kata (konteks gestur). */
  caption: string;
  /** Frasa afirmasi untuk pelengkap momen. */
  message: string;
};

/** Map kategori → gestur. Tambah entri di sini saat kategori baru ada. */
const AFFIRMATIONS: Record<string, Affirmation> = {
  game: {
    word: "GG",
    caption: "gg wp — on to the next level",
    message: "Your support levels up their game project.",
  },
  music: {
    word: "Encore!",
    caption: "the show goes on — because of you",
    message: "You just kept the music playing.",
  },
  charity: {
    word: "Heartfelt",
    caption: "kindness moves quietly, but far",
    message: "Your kindness travels further than you know.",
  },
};

/** Gestur generik untuk kategori di luar map (mock data, kategori baru, dll). */
const FALLBACK: Affirmation = {
  word: "Cheer",
  caption: "your support is on its way",
  message: "Your support just landed.",
};

export function getAffirmation(category: string | null | undefined): Affirmation {
  return (category && AFFIRMATIONS[category.toLowerCase()]) || FALLBACK;
}
