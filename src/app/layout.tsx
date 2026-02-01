import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { clsx } from "clsx";
import { Navbar } from "@/components/navbar";

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
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Created with Next.js, Tailwind CSS, shadcn/ui and Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          safiro.variable,
          "antialiased bg-background text-foreground min-h-screen"
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
