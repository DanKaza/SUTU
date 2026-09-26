import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── SUTU DESIGN SPECIFICATION §3 ────────────────────────────────
        ink: {
          DEFAULT: "#F7F5FB", // Foreground — alias untuk `text-ink` (app dark-only)
          950: "#07060A", // Canvas utama
          900: "#0D0B12", // Section gelap
          800: "#17131F", // Surface elevated
          700: "#24202E", // Border
        },
        white: "#F7F5FB", // Headline
        muted: "#AAA3B6", // Teks sekunder
        faint: "#837B8F", // Caption
        violet: {
          DEFAULT: "#A78BFA", // Alias untuk `text-violet` (accent terang, kontras aman)
          500: "#8B5CF6", // Aksen utama
          400: "#A78BFA", // Highlight
          700: "#5B21B6", // Glow dalam
        },
        lilac: "#DDD6FE",
        pink: "#F0ABFC",
        // Legacy (avoiding breakage during transition)
        void: "#07060A",
      },
      fontFamily: {
        // Display: Space Grotesk (geometris, tebal, tracking rapat)
        display: ["var(--font-space-grotesk)", "sans-serif"],
        // Body: Inter
        body: ["var(--font-inter)", "sans-serif"],
        // Angka / label teknis: JetBrains Mono
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        card: "20px",
        section: "32px",
        button: "999px",
      },
      backgroundImage: {
        "hero": "radial-gradient(circle at 70% 30%, #4C1D95 0%, #1B1230 28%, #07060A 72%)",
        "violet": "linear-gradient(135deg, #A78BFA 0%, #7C3AED 48%, #EC4899 100%)",
        "card": "linear-gradient(145deg, rgba(167,139,250,.18), rgba(255,255,255,.035))",
        "section": "linear-gradient(180deg, #07060A 0%, #100B1C 55%, #07060A 100%)",
      },
      boxShadow: {
        "glow-violet": "0 0 80px rgba(124,58,237,.20), 0 24px 80px rgba(0,0,0,.45)",
        "glow-violet-lg": "0 0 120px rgba(124,58,237,.25), 0 32px 100px rgba(0,0,0,.5)",
        "glow-pink": "0 0 40px rgba(240,171,252,.15)",
      },
      transitionTimingFunction: {
        "quintic-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
