"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MouseHalo() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Lens size
    const lensSize = 40;
    const lensOffset = lensSize / 2;

    // Use motion values for head position
    const headX = useMotionValue(-lensOffset);
    const headY = useMotionValue(-lensOffset);

    // Optimized trail physics chain (Stable count)
    // Slightly more lag for the trail parts
    const s2x = useSpring(headX, { damping: 25, stiffness: 350, mass: 0.2 });
    const s2y = useSpring(headY, { damping: 25, stiffness: 350, mass: 0.2 });
    const s3x = useSpring(headX, { damping: 30, stiffness: 250, mass: 0.4 });
    const s3y = useSpring(headY, { damping: 30, stiffness: 250, mass: 0.4 });

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            headX.set(e.clientX - lensOffset);
            headY.set(e.clientY - lensOffset);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
        };
    }, [headX, headY, isVisible, lensOffset]);

    if (!mounted) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-1000"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            {/* Soft Trail Smear */}
            <motion.div style={{ x: s3x, y: s3y, width: lensSize, height: lensSize, scale: 0.8, opacity: 0.1, filter: 'blur(12px)' }} className="absolute rounded-full bg-[#C8A96A] mix-blend-screen" />
            <motion.div style={{ x: s2x, y: s2y, width: lensSize, height: lensSize, scale: 1.1, opacity: 0.15, filter: 'blur(6px)' }} className="absolute rounded-full bg-[#C8A96A] mix-blend-screen" />

            {/* Magnifying Glass Lens */}
            <motion.div
                style={{ x: headX, y: headY, width: lensSize, height: lensSize }}
                className="absolute flex items-center justify-center"
            >
                {/* Outer Golden Rim */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C8A96A]/80 shadow-[0_0_15px_rgba(200,169,106,0.5)]" />

                {/* Glass Lens Reflection */}
                <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30" />

                {/* Magnifying Glass Handle - 45 Degree Angle outward */}
                <div
                    className="absolute h-[22px] w-[4px] bg-gradient-to-b from-[#C8A96A] to-[#917b4d] shadow-[2px_2px_5px_rgba(0,0,0,0.3)] origin-top rounded-full"
                    style={{
                        top: '85%',
                        left: '85%',
                        transform: 'rotate(-45deg)',
                    }}
                />

                {/* Core Subtle Lens Distortion Glow */}
                <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-40 blur-[1px]" />
            </motion.div>
        </div>
    );
}
