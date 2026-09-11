import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { GlobalNav } from "@/components/layout/global-nav";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppStateProvider } from "@/lib/app-state";
import { Web3Provider } from "@/lib/web3/web3-provider";
import { AuthProvider } from "@/lib/web3/auth-context";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SUTU - Support Us Together",
  description: "One place to discover Web3 communities and support them, without visiting a dozen sites or donation links.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${manrope.variable} ${inter.variable} font-body antialiased`}>
        <ThemeProvider>
          <Web3Provider>
            <AuthProvider>
              <AppStateProvider>
                <div className="flex min-h-screen flex-col bg-warm-white dark:bg-dark-base">
                  <GlobalNav />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </AppStateProvider>
            </AuthProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
