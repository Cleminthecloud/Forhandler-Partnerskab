import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppStateProvider } from "@/components/AppState";
import { CommandPalette } from "@/components/CommandPalette";
import { MobileGate } from "@/components/MobileGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carl Ras Forhandler Partnerskab",
  description:
    "Platformen, kufferten og kommunikationsmotoren — én motor, alle temaer, hele Gruppen.",
  icons: { icon: "/favicon-32.png" },
};

/** Viewport config — explicit so iOS Safari respects safe-area insets
 *  and the layout responds correctly on Pro Max devices. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1158A3",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Carl Ras brand font — Neo Sans via Adobe Typekit. Inter loads via
            next/font as a fast-paint fallback and covers the medium weights
            (500/600) that this Typekit doesn't ship. */}
        <link rel="stylesheet" href="https://use.typekit.net/gqe3rsn.css" />
      </head>
      <body className="min-h-full">
        <AppStateProvider>
          <ThemeProvider>
            {children}
            <CommandPalette />
            {/* Mobile gate — shown only on <md viewports on routes that
                haven't been rebuilt mobile-first yet. Renders nothing on
                desktop or on the 4 mobile-ready hero routes. */}
            <MobileGate />
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
