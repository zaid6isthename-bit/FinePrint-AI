"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ParticlePixelGrid() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -2000, y: -2000 });
    const [isStationary, setIsStationary] = useState(false);
    const stationaryTimeout = useRef<NodeJS.Timeout | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const isAllowedPage = useMemo(() => ["/", "/login", "/signup"].includes(pathname), [pathname]);

    useEffect(() => {
        setMounted(true);
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setIsStationary(false);

            if (stationaryTimeout.current) clearTimeout(stationaryTimeout.current);
            stationaryTimeout.current = setTimeout(() => {
                setIsStationary(true);
            }, 500);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (stationaryTimeout.current) clearTimeout(stationaryTimeout.current);
        };
    }, []);

    // Pre-calculate column delays to create "Lines"
    const colDelays = useMemo(() => {
        if (windowSize.width === 0) return [];
        const gap = 44;
        const cols = Math.floor(windowSize.width / gap) + 2;
        // Generate random base delays for each column
        return Array.from({ length: cols }, () => ({
            base: Math.random() * 10,
            speed: 0.1 + Math.random() * 0.1 // Random speed per line
        }));
    }, [windowSize.width]);

    const grid = useMemo(() => {
        if (windowSize.width === 0 || !isAllowedPage) return [];

        const gap = 44;
        const cols = Math.floor(windowSize.width / gap);
        const rows = Math.floor(windowSize.height / gap);

        const points = [];
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                const colData = colDelays[c] || { base: 0, speed: 0.1 };
                points.push({
                    x: c * gap + (windowSize.width % gap) / 2,
                    y: r * gap + (windowSize.height % gap) / 2,
                    val: (r + c) % 2 === 0 ? "1" : "0",
                    delay: Math.random() * 5,
                    row: r,
                    col: c,
                    // Calculate delay based on column base + row sequence to create a line
                    rainDelay: colData.base + (r * colData.speed)
                });
            }
        }
        return points;
    }, [windowSize, isAllowedPage, colDelays]);

    if (!mounted || !isAllowedPage) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden bg-transparent">
            {grid.map((point, i) => {
                const dx = mousePos.x - point.x;
                const dy = mousePos.y - point.y;
                const distSq = dx * dx + dy * dy;
                const maxDistSq = 200 * 200;

                let mouseInfluence = 0;
                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    mouseInfluence = Math.pow(1 - dist / 200, 2.5); // Steeper falloff for clearer spotlight
                }

                const isHovered = !isStationary && mouseInfluence > 0.01;
                const isRaining = isStationary;

                if (!isHovered && !isRaining) return null;

                return (
                    <div
                        key={i}
                        className={`absolute select-none font-mono text-[12px] transition-all duration-700 ease-in-out will-change-[transform,opacity] ${isRaining ? 'animate-matrix-rain' : ''
                            }`}
                        style={{
                            left: point.x,
                            top: point.y,
                            transform: isHovered
                                ? `translate(-50%, -50%) scale(${1 + mouseInfluence * 1.3})`
                                : `translate(-50%, -50%) scale(1.3)`,
                            opacity: isHovered
                                ? 0.2 + mouseInfluence * 0.8
                                : 0.12,
                            fontWeight: isHovered && mouseInfluence > 0.6 ? '900' : 'normal',
                            color: isHovered ? "#C8A96A" : "rgba(200, 169, 106, 0.4)",
                            textShadow: isHovered && mouseInfluence > 0.7 ? '0 0 8px rgba(200, 169, 106, 0.5), 0 0 15px rgba(200, 169, 106, 0.3)' : 'none',
                            '--rain-delay': `${point.rainDelay}s`
                        } as React.CSSProperties & { '--rain-delay': string }}
                    >
                        {point.val}
                    </div>
                );
            })}
            <style jsx global>{`
        @keyframes matrix-rain {
          0%, 100% { opacity: 0.12; color: rgba(200, 169, 106, 0.4); text-shadow: none; transform: translate(-50%, -50%) scale(1.3) translateY(0); }
          10% { opacity: 1; color: #C8A96A; text-shadow: 0 0 12px #C8A96A, 0 0 20px #C8A96A; transform: translate(-50%, -50%) scale(1.4) translateY(0); }
          25% { opacity: 0.12; color: rgba(200, 169, 106, 0.4); text-shadow: none; transform: translate(-50%, -50%) scale(1.3) translateY(0); }
          50% { transform: translate(-50%, -50%) scale(1.3) translateY(-3px); }
        }
        .animate-matrix-rain {
          animation: matrix-rain 6s ease-in-out infinite;
          animation-delay: var(--rain-delay);
        }
      `}</style>
        </div>
    );
}
