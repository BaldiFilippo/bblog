"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useAnimation } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiltCard } from "./tilt-card";
import { Navbar } from "./navbar";

const projects = [
  {
    id: 1,
    title: "Neon Skyline",
    category: "Urban Design",
    image: "/images/image1.jpeg",
  },
  {
    id: 2,
    title: "Quantum Data",
    category: "Data Visualization",
    image: "/images/image2.jpeg",
  },
  {
    id: 3,
    title: "Matrix Flow",
    category: "Web Application",
    image: "/images/image3.jpeg",
  },
  {
    id: 4,
    title: "Holo Interface",
    category: "UI/UX Design",
    image: "/images/image4.jpeg",
  },
];

const COVER_HEIGHT_VH = 40;

// Centralized scroll management
const lockScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
};

const unlockScroll = () => {
  document.body.style.overflow = "";
  document.body.removeEventListener('touchmove', preventDefault);
};

const preventDefault = (e: Event) => e.preventDefault();

export default function Parallax() {
  const router = useRouter();
  const { scrollY } = useScroll();
  
  // -- SCROLL STATE --
  // Controlled by scroll position
  const [activeId, setActiveId] = useState(1);
  const activeProject = projects.find((p) => p.id === activeId) || projects[0];

  // -- TRANSITION STATE --
  // Frozen snapshot for the transition sequence
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "running">("idle");
  const [transitionData, setTransitionData] = useState<typeof projects[0] | null>(null);
  
  // Animation Controls for the Transition Layer
  const titleControls = useAnimation();
  const subtitleControls = useAnimation();
  
  // Refs for Transition Layer measurement
  const transitionTitleRef = useRef<HTMLHeadingElement>(null);
  const ghostTitleRef = useRef<HTMLHeadingElement>(null);
  
  // Robust cleanup
  useEffect(() => {
    return () => unlockScroll();
  }, []);

  // Sync Active Project with Scroll (ONLY if idle)
  useMotionValueEvent(scrollY, "change", (latest) => {
    // We do NOT block the update of activeId here, but the UI will ignore it 
    // for the transition layer if we are running.
    
    const vh = window.innerHeight;
    let currentExit = vh; 
    let newActiveId = 1;

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

  const handleProjectClick = async (e: React.MouseEvent, project: typeof projects[0]) => {
    e.preventDefault();
    if (transitionPhase !== "idle") return;

    // 1. FREEZE STATE
    setTransitionData(project);
    setTransitionPhase("running");
    lockScroll();

    // 2. WAIT FOR RENDER of Transition Layer
    await new Promise(resolve => setTimeout(resolve, 20));

    // 3. START SEQUENCE (3 PHASES)
    
    // -- PHASE 1: CLEANUP SCENE (Cover + Subtitle OUT) --
    // Title must remain perfectly STABLE here.
    // We animate subtitle out. Cover opacity is handled by the "running" state in the list mapping.
    await subtitleControls.start({ 
        opacity: 0, 
        filter: "blur(10px)", 
        transition: { duration: 0.4, ease: "easeOut" } 
    });
    
    // Only after subtitle is effectively gone do we start moving the title.
    // Optional small delay for pacing if desired, but await is enough.

    // -- PHASE 2: CENTER TITLE --
    let centerXOffset = 0;
    if (transitionTitleRef.current) {
        const titleRect = transitionTitleRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const titleCenterX = titleRect.left + titleRect.width / 2; // Rect already includes current transform (0)
        // Round to avoid subpixel centering issues
        centerXOffset = Math.round(centerX - titleCenterX);
    }

    // Move to center (no scale yet)
    await titleControls.start({
        x: centerXOffset,
        opacity: 1,
        scale: 1, 
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    });

    // -- PHASE 3: SCALE TO MATCH PROJECT PAGE --
    if (transitionTitleRef.current && ghostTitleRef.current) {
        // Measure current state (title is now centered at 'centerXOffset')
        const currentRect = transitionTitleRef.current.getBoundingClientRect();
        const targetRect = ghostTitleRef.current.getBoundingClientRect();

        // Calculate final deltas
        // Target Center
        const targetCX = targetRect.left + targetRect.width / 2;
        const targetCY = targetRect.top + targetRect.height / 2;
        
        // Current Center
        const currentCX = currentRect.left + currentRect.width / 2;
        const currentCY = currentRect.top + currentRect.height / 2;
        
        // This move is RELATIVE to the current visual position? 
        // No, 'animate' in Framer Motion usually targets absolute values from the initial state 
        // unless we use `+=`.
        // Our current 'x' value is `centerXOffset`.
        // The distance we need to travel is `targetCX - currentCX`.
        // So finalX = centerXOffset + (targetCX - currentCX).
        
        const moveX = targetCX - currentCX;
        const moveY = targetCY - currentCY;
        // Use rounding to ensure we land on exact pixels
        const finalX = Math.round(centerXOffset + moveX);
        const finalY = Math.round(moveY); // Vertical move from current transform (0)
        
        const scale = targetRect.height / currentRect.height; // Height is safer for text scaling
        
        await titleControls.start({
            x: finalX,
            y: finalY,
            scale: scale,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        });
    }

    // -- NAVIGATION --
    // Do NOT unlock scroll here. 
    // Unlocking forces a layout shift (scrollbar reappears) BEFORE the page navigates, causing a jump.
    // Cleanup in useEffect will unlock it when this component unmounts.
    router.push(`/project/${project.id}`);
  };

  return (
    <div className="bg-background relative min-h-screen preserve-3d">
      
      {/* ------------------------------------------------------- */}
      {/* TRANSITION OVERLAY (Only visible during transition)     */}
      {/* ------------------------------------------------------- */}
      {transitionPhase === "running" && transitionData && (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* GHOST for Measurement (Hidden) */}
            <div aria-hidden="true" className="fixed inset-0 invisible flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <h1 ref={ghostTitleRef} className="text-6xl md:text-9xl font-black tracking-tighter text-foreground">
                        {transitionData.title}
                    </h1>
                </div>
            </div>

            {/* ANIMATING ELEMENTS */}
            <div className="fixed inset-0 flex items-center justify-center">
                 <div className="relative w-full max-w-[90vw] h-[20vh] flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-row items-baseline justify-center gap-4 md:gap-12 px-4 w-full">
                         {/* Transition Title */}
                         <motion.h2
                            ref={transitionTitleRef}
                            // FIXED: Start at x: 0 to match the "idle" state of the underlying title.
                            // If we start at -60, the centering calculation (which assumes 0 start or includes transform)
                            // gets skewed when we animate to 'newOffset'.
                            initial={{ x: 0, opacity: 1, filter: "blur(0px)" }} 
                            animate={titleControls}
                            className="text-4xl md:text-7xl font-black tracking-tighter text-foreground text-right whitespace-nowrap"
                            style={{ transformOrigin: "center center" }}
                         >
                            {transitionData.title}
                         </motion.h2>

                         {/* Transition Subtitle */}
                         <motion.p
                            // FIXED: Start at x: 0 to match idle state
                            initial={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                            animate={subtitleControls}
                             className="text-2xl md:text-5xl font-light tracking-wide text-muted-foreground text-left whitespace-nowrap"
                         >
                            {transitionData.category}
                         </motion.p>
                    </div>
                 </div>
            </div>
        </div>
      )}


      {/* ------------------------------------------------------- */}
      {/* NORMAL STATE (Scrollable List + Fixed Title)            */}
      {/* ------------------------------------------------------- */}

      {/* FIXED TITLE LAYER (Hidden during transition) */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 transition-opacity duration-200"
        style={{ opacity: transitionPhase === "running" ? 0 : 1 }}
      >
        <div className="relative w-full max-w-[90vw] h-[20vh] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
            <motion.div 
                key={activeProject.id}
                className="absolute inset-0 flex flex-row items-baseline justify-center gap-4 md:gap-12 px-4 w-full"
            >
                <motion.h2
                    initial={{ x: -60, opacity: 0, filter: "blur(10px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ x: 0, opacity: 0, filter: "blur(5px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} 
                    className="text-4xl md:text-7xl font-black tracking-tighter text-foreground text-right whitespace-nowrap"
                >
                {activeProject.title}
                </motion.h2>

                <motion.p
                    initial={{ x: 60, opacity: 0, filter: "blur(10px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ x: 0, opacity: 0, filter: "blur(5px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-2xl md:text-5xl font-light tracking-wide text-muted-foreground text-left whitespace-nowrap"
                >
                {activeProject.category}
                </motion.p>
            </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="w-full flex justify-center perspective-container"
            style={{
                marginTop: index === 0 ? `${100 - COVER_HEIGHT_VH}vh` : "100vh",
                height: `${COVER_HEIGHT_VH}vh`,
                marginBottom: index === projects.length - 1 ? "50vh" : "0",
                perspective: "1200px"
            }}
          >
            <Link 
                href={`/project/${project.id}`} 
                className={`block h-full aspect-square transition-opacity duration-500 ${
                    transitionPhase === "running" && transitionData?.id !== project.id 
                    ? "opacity-0 pointer-events-none" 
                    : ""
                }`}
                onClick={(e) => handleProjectClick(e, project)}
            >
              <motion.div
                animate={
                    transitionPhase === "running" && transitionData?.id === project.id 
                    ? { opacity: 0 } 
                    : { opacity: 1 }
                }
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                  <TiltCard image={project.image} title={project.title} />
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
