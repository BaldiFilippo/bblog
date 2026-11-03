import type { Metadata } from "next";

// The contact page is a client component and can't export metadata itself
export const metadata: Metadata = {
  title: "Contact",
  description: "Thoughts, disagreements, ideas and collaborations: write to Filippo Baldi.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
