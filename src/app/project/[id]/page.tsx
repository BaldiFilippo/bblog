"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";

const projects = [
  {
    id: 1,
    title: "Neon Skyline",
  },
  {
    id: 2,
    title: "Quantum Data",
  },
  {
    id: 3,
    title: "Matrix Flow",
  },
  {
    id: 4,
    title: "Holo Interface",
  },
];

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-foreground">Project Not Found</h1>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground">
          {project.title}
        </h1>
      </div>
    </div>
  );
}
