/**
 * Tema — dark-only (desain SUTU sekarang satu mode: near-black #0A0A0F).
 * Script inline ini dipanggil dari `app/layout.tsx` sebelum React hydrate
 * supaya class `dark` sudah ada sejak render pertama.
 */

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } catch (e) {}
})();
`;
