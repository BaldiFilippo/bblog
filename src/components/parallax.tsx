"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

import { useState } from "react";
import Link from "next/link";
import { TiltCard } from "./tilt-card";

const projects = [
  {
    id: 1,
    title: "Neon Skyline",
    category: "Urban Design",
    image: "/images/project_cover_1_1769631977952.png",
  },
  {
    id: 2,
    title: "Quantum Data",
    category: "Data Visualization",
    image: "/images/project_cover_2_1769631992280.png",
  },
  {
    id: 3,
    title: "Matrix Flow",
    category: "Web Application",
    image: "/images/project_cover_3_1769632006450.png",
  },
  {
    id: 4,
    title: "Holo Interface",
    category: "UI/UX Design",
    image: "/images/project_cover_4_1769632020090.png",
  },
];

const COVER_HEIGHT_VH = 40; // Reduced height for square aspect

export default function Parallax() {
  const [activeId, setActiveId] = useState(1);
  const activeProject = projects.find((p) => p.id === activeId) || projects[0];
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Ensure we have access to window in callback
    const vh = window.innerHeight;
    
    let currentExit = vh; 
    let newActiveId = 1;

    // Check P1
    if (latest < currentExit) {
        newActiveId = 1;
    } else {
        for (let i = 2; i <= projects.length; i++) {
            const gap = vh;
            const height = (COVER_HEIGHT_VH / 100) * vh;
            
            const nextExit = currentExit + gap + height;
            
            if (latest < nextExit) {
                newActiveId = i;
                break;
            }
            
            currentExit = nextExit;
            newActiveId = i;
        }
    }

    if (newActiveId !== activeId) {
      setActiveId(newActiveId);
    }
  });

  return (
    <div className="bg-background relative min-h-screen preserve-3d">
      {/* Fixed Title Layer */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Stable Container to prevent layout shift */}
        <div className="relative w-full max-w-[90vw] h-[20vh] flex items-center justify-center">
            <AnimatePresence>
            {/* Wrapper must be absolute to overlap perfectly without flow interference */}
            <motion.div 
                key={activeId}
                className="absolute inset-0 flex flex-row items-baseline justify-center gap-4 md:gap-12 px-4 w-full"
            >
                {/* Title - Enters from Left, Fades Out in Place */}
                <motion.h2
                initial={{ x: -60, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: 0, opacity: 0, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} 
                className="text-4xl md:text-7xl font-black tracking-tighter text-foreground text-right whitespace-nowrap"
                style={{ willChange: "transform, opacity" }}
                >
                {activeProject.title}
                </motion.h2>

                {/* Subtitle - Enters from Right, Fades Out in Place */}
                <motion.p
                initial={{ x: 60, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: 0, opacity: 0, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-5xl font-light tracking-wide text-muted-foreground text-left whitespace-nowrap"
                style={{ willChange: "transform, opacity" }}
                >
                {activeProject.category}
                </motion.p>
            </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="w-full flex justify-center perspective-container"
            style={{
                marginTop: index === 0 ? `${100 - COVER_HEIGHT_VH}vh` : "100vh",
                height: `${COVER_HEIGHT_VH}vh`,
                marginBottom: index === projects.length - 1 ? "50vh" : "0",
                perspective: "1200px" // Add perspective to parent for 3D effect
            }}
          >
            <Link href={`/project/${project.id}`} className="block h-full aspect-square">
              <TiltCard image={project.image} title={project.title} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
