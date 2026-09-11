/**
 * Tema inisialisasi — satu sumber kebenaran untuk script inline (FOUC
 * prevention) dan ThemeProvider.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "commons-theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Script inline ini hanya dipanggil dari `app/layout.tsx` sebelum React
 * hydrate, supaya theme class sudah benar saat pertama render (mengurangi
 * FOUC). Logikanya identik dengan `getInitialTheme()` di atas.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("commons-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;
