"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

interface TiltCardProps {
    image: string;
    title: string;
}

export function TiltCard({ image, title }: TiltCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth tilt
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
        stiffness: 150, 
        damping: 20
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
        stiffness: 150, 
        damping: 20
    });
    
    // Shine effect moves opposite to tilt
    const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), {
        stiffness: 150,
        damping: 20
    });
    const shineY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), {
        stiffness: 150,
        damping: 20
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Calculate mouse position relative to center of card (-0.5 to 0.5)
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full aspect-square rounded-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing bg-muted will-change-transform"
        >
             {/* Image */}
             <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover pointer-events-none"
                />
                 {/* subtle overlay to help depth */}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
             </div>

            {/* Shine/Glare Effect */}
            <motion.div 
                style={{
                    background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
                    opacity: 0.6,
                    zIndex: 10
                }}
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
            />
        </motion.div>
    );
}
