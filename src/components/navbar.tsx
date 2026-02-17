"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent">
      <Link href="/" className="text-xl font-bold tracking-tighter mix-blend-difference text-foreground">
        Blog
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden gap-2 sm:flex">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary">
              <Github className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <Button className="font-semibold shadow-lg">Contact</Button>
      </div>
    </nav>
  );
}
