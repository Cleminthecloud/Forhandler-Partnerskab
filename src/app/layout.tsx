import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppStateProvider } from "@/components/AppState";

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
      <body className="min-h-full">
        <AppStateProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
