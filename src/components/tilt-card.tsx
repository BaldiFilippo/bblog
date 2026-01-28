"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useState, useEffect } from "react";

interface TiltCardProps {
    image: string;
    title: string;
}

export function TiltCard({ image, title }: TiltCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
             setIsTouch(window.matchMedia("(hover: none)").matches);
        };
        checkTouch();
        window.addEventListener("resize", checkTouch);
        return () => window.removeEventListener("resize", checkTouch);
    }, []);

    const springConfig = { stiffness: 120, damping: 20 };

    // ROTATION LOGIC (FIXED)
    // Range: -0.5 (Left/Top) to 0.5 (Right/Bottom)
    
    // rotateX: 
    // Top (-0.5) -> should tip towards user? Positive rotateX.
    // Bottom (0.5) -> should tip away? Negative rotateX.
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), springConfig);

    // rotateY:
    // Left (-0.5) -> should tip left side towards/away? 
    // Standard: Left side towards user = negative rotateY.
    // Right (0.5) -> Right side towards user = positive rotateY? 
    // Wait, CSS rotateY(positive) moves right side AWAY (receding).
    // If we want "look at mouse", when mouse is Right, Right side should come UP (Negative Z? No, Positive Z).
    // So if mouse Right (x=0.5), we want Right Side to come CLOSER.
    // This requires rotateY to be NEGATIVE?
    // User requested "muovendo il mouse a destra → cambia rotateY con segno coerente".
    // User formula: "rotateY = (dx) * MAX_Y". So x=0.5 -> Positive.
    // If user specifically requested that formula, they might want the "press down" effect?
    // "dx>0 -> rotateY positivo" -> X=0.5 -> RotY > 0 -> Right side goes AWAY (Pressed).
    // This matches the "physical button" metaphor (press the corner).
    // Let's stick to the User's explicit formula: x maps to positive.
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), springConfig);

    // Shine moves opposite
    const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), springConfig);
    const shineY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouch) return;

        const rect = e.currentTarget.getBoundingClientRect();
        
        // Coordinates: 0..1
        const xPct = (e.clientX - rect.left) / rect.width;
        const yPct = (e.clientY - rect.top) / rect.height;
        
        // Centered: -0.5..0.5
        const xCentered = xPct - 0.5;
        const yCentered = yPct - 0.5;
        
        x.set(xCentered);
        y.set(yCentered);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                perspective: 1000 // Ensure perspective is set
            }}
            className="w-full h-full"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: isTouch ? 0 : rotateX,
                    rotateY: isTouch ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center" // Explicit center
                }}
                className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden cursor-pointer bg-muted will-change-transform"
            >
                {/* Image */}
                <div className="absolute inset-0 z-0 transform translate-z-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ scale: 1.1 }} // Safer scale
                    />
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                </div>

                {/* Shine */}
                {!isTouch && (
                    <motion.div 
                        style={{
                            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                            opacity: 0.5,
                            zIndex: 10
                        }}
                        className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
