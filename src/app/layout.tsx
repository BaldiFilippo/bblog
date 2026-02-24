import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { clsx } from "clsx";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const safiro = localFont({
  src: "../../public/fonts/safiro-medium-webfont.woff2",
  variable: "--font-safiro",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "A blog about design, development, and creativity.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "My Blog",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/safiro-medium-webfont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          safiro.variable,
          "antialiased bg-background text-foreground min-h-screen"
        )}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
