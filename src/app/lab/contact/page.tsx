import type { Metadata } from "next";
import { ContactLab } from "./contact-lab";

export const metadata: Metadata = {
  title: "Contact link lab",
  description: "Four candidates for reaching the contact page.",
  robots: { index: false },
};

export default function ContactLabPage() {
  return <ContactLab />;
}
