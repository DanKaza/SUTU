import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { GlobalNav } from "@/components/layout/global-nav";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/layout/motion-provider";
import { AppStateProvider } from "@/lib/app-state";
import { Web3Provider } from "@/lib/web3/web3-provider";
import { AuthProvider } from "@/lib/web3/auth-context";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        <Web3Provider>
          <AuthProvider>
            <AppStateProvider>
              <MotionProvider>
                <div className="flex min-h-screen flex-col bg-ink-950">
                  <GlobalNav />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </MotionProvider>
            </AppStateProvider>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
