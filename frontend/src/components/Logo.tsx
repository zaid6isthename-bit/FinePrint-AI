"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function BarristerLogo({ className = "h-12 w-12", animate = true }: { className?: string, animate?: boolean }) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Get current theme state - handling NextThemes mounted state
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className={className} />;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <motion.div
            initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            <img 
                src={isDark ? "/logo-dark.png" : "/logo-light.png"} 
                alt="Barrister AI Logo" 
                className="w-full h-full object-contain"
            />
        </motion.div>
    );
}

export function BarristerTextLogo({ className = "h-6" }: { className?: string }) {
    // We already have the logo in the icon, so the text remains simple yet consistent
    return (
        <div className={`flex items-center font-serif text-3xl tracking-[-0.01em] ${className}`}>
            <span className="text-foreground">Barr</span>
            <span className="text-gold font-bold">i</span>
            <span className="text-foreground">ster</span>
            <span className="ml-2 text-[#4A4B50] font-sans font-semibold text-2xl tracking-tight">AI</span>
        </div>
    );
}
