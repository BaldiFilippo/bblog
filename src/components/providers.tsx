"use client";

import { SmoothScroll } from "./smooth-scroll";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
