import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppStateProvider } from "@/components/AppState";
import { CommandPalette } from "@/components/CommandPalette";

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
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
