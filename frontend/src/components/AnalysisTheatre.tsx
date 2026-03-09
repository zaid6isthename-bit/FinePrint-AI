"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ShieldAlert, Scale, Zap, Info, AlertTriangle } from "lucide-react";

const PHRASES = [
    "Mapping contractual obligations...",
    "Evaluating liability exposure...",
    "Detecting financial risk...",
    "Assessing enforceability...",
];

const TAGS = [
    { text: "Termination clause detected", icon: ShieldAlert, color: "text-[#B85C5C]", bgColor: "bg-[#B85C5C]/10", borderColor: "border-[#B85C5C]/20" },
    { text: "Indemnity obligation located", icon: Zap, color: "text-[#D9A441]", bgColor: "bg-[#D9A441]/10", borderColor: "border-[#D9A441]/20" },
    { text: "Payment liability found", icon: Info, color: "text-[#6E9E75]", bgColor: "bg-[#6E9E75]/10", borderColor: "border-[#6E9E75]/20" },
    { text: "Arbitration clause present", icon: Scale, color: "text-[#C8A96A]", bgColor: "bg-[#C8A96A]/10", borderColor: "border-[#C8A96A]/20" },
];

const RISK_NOTES = [
    "Potential indemnity imbalance",
    "Unilateral exit clause",
    "Late penalty risk",
];

export function AnalysisTheatre() {
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [activeTag, setActiveTag] = useState<{ text: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string } | null>(null);
    const [riskNote, setRiskNote] = useState<string | null>(null);
    const [highlightedClause, setHighlightedClause] = useState<number | null>(null);
    const [pulseLines, setPulseLines] = useState(false);

    useEffect(() => {
        // Phrases cycling
        const phraseInterval = setInterval(() => {
            setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
        }, 2500);

        // Tags appearances (1.5-2s duration, every 4s)
        const tagInterval = setInterval(() => {
            const randomTag = TAGS[Math.floor(Math.random() * TAGS.length)];
            setActiveTag(randomTag);
            setTimeout(() => setActiveTag(null), 1800);
        }, 4500);

        // Risk notes (occasionally)
        const riskInterval = setInterval(() => {
            if (Math.random() > 0.6) {
                setRiskNote(RISK_NOTES[Math.floor(Math.random() * RISK_NOTES.length)]);
                setTimeout(() => setRiskNote(null), 2000);
            }
        }, 6000);

        // Clause highlighting
        const highlightInterval = setInterval(() => {
            setHighlightedClause(Math.floor(Math.random() * 8));
        }, 1500);

        // Neural line pulsing
        const pulseInterval = setInterval(() => {
            setPulseLines(true);
            setTimeout(() => setPulseLines(false), 800);
        }, 3000);

        return () => {
            clearInterval(phraseInterval);
            clearInterval(tagInterval);
            clearInterval(riskInterval);
            clearInterval(highlightInterval);
            clearInterval(pulseInterval);
        };
    }, []);

    const neuralConnections = useMemo(() => [
        { d: "M 100 100 L 220 300", delay: 0 },
        { d: "M 220 300 L 340 100", delay: 0.5 },
        { d: "M 340 100 L 460 300", delay: 1 },
        { d: "M 460 300 L 580 100", delay: 1.5 },
        { d: "M 580 100 L 700 300", delay: 2 },
    ], []);

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center overflow-hidden">
            {/* Neural Structure Mapping */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg width="100%" height="100%" viewBox="0 0 800 600" className="opacity-30">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {neuralConnections.map((conn, i) => (
                        <motion.path
                            key={`path-${i}`}
                            d={conn.d}
                            stroke="var(--gold)" // Legal Gold
                            strokeWidth="1.5"
                            fill="none"
                            filter="url(#glow)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: [0, 0.15, 0.3, 0.15],
                                scaleX: [1, 1.05, 1],
                            }}
                            transition={{
                                pathLength: { duration: 2.5, ease: "easeInOut", delay: conn.delay },
                                opacity: { duration: 1.5, delay: conn.delay + 1, repeat: Infinity },
                                scaleX: { duration: 0.8, delay: conn.delay + 2 }
                            }}
                        />
                    ))}
                    {[...Array(6)].map((_, i) => (
                        <motion.circle
                            key={`node-${i}`}
                            cx={100 + i * 120}
                            cy={100 + (i % 2) * 300}
                            r="4"
                            fill="var(--gold)"
                            initial={{ scale: 0 }}
                            animate={{
                                scale: pulseLines ? [1, 1.5, 1] : 1,
                                opacity: pulseLines ? [0.4, 1, 0.4] : 0.4
                            }}
                            transition={{ duration: 0.8 }}
                        />
                    ))}
                </svg>
            </div>

            {/* Document Layers (Scanning Theatre) */}
            <div className="relative z-10 perspective-[2000px]">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`layer-${i}`}
                        initial={{ rotateX: 35, rotateZ: -25, y: 100, opacity: 0 }}
                        animate={{
                            y: -30 * i,
                            opacity: 1 - i * 0.2,
                            x: 20 * i,
                            rotateX: 35,
                            rotateZ: -25,
                        }}
                        transition={{ duration: 1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                        exit={{
                            rotateX: 0,
                            rotateZ: 0,
                            y: 0,
                            x: 0,
                            opacity: 0,
                            scale: 0.9,
                            transition: { duration: 0.8, ease: "circIn" }
                        }}
                        className="absolute inset-x-[-140px] inset-y-[-180px] w-[280px] h-[360px] glass-pane border-border dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Vertical Scan Light Sweep - Legal Gold */}
                        {i === 0 && (
                            <motion.div
                                className="absolute inset-x-0 h-2 bg-gradient-to-b from-transparent via-gold/50 to-transparent z-20"
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}

                        {/* Clause Sections (Mock Content) */}
                        <div className="p-8 space-y-4">
                            {[...Array(10)].map((_, j) => (
                                <motion.div
                                    key={`line-${j}`}
                                    animate={{
                                        opacity: highlightedClause === j ? 1 : 0.1,
                                        backgroundColor: highlightedClause === j ? "rgba(200, 169, 106, 0.15)" : "rgba(161, 161, 170, 0.05)",
                                        scale: highlightedClause === j ? 1.02 : 1,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-2.5 rounded-full relative overflow-hidden`}
                                    style={{ width: `${60 + Math.sin(j) * 30}%` }}
                                >
                                    {/* Clause Glow Effect */}
                                    <AnimatePresence>
                                        {highlightedClause === j && (
                                            <motion.div
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "100%" }}
                                                transition={{ duration: 1, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {/* Ripple pulses on risk moments */}
                        <AnimatePresence>
                            {riskNote && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                    className="absolute inset-0 bg-red-500/10 rounded-full"
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Floating Tags & Risk Side Notes */}
            <div className="absolute inset-0 pointer-events-none z-30">
                <AnimatePresence>
                    {activeTag && (
                        <motion.div
                            key={activeTag.text}
                            initial={{ opacity: 0, scale: 0.8, x: 100, y: -50 }}
                            animate={{ opacity: 1, scale: 1, x: 180, y: -80 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                            className={`absolute left-1/2 top-1/2 flex items-center gap-2.5 px-4 py-2 rounded-xl border ${activeTag.borderColor} ${activeTag.bgColor} backdrop-blur-md shadow-lg`}
                        >
                            <activeTag.icon className={`h-4 w-4 ${activeTag.color}`} />
                            <span className={`text-xs font-semibold tracking-wide ${activeTag.color} uppercase`}>{activeTag.text}</span>
                        </motion.div>
                    )}

                    {riskNote && (
                        <motion.div
                            key={riskNote}
                            initial={{ opacity: 0, x: -100, y: 50 }}
                            animate={{ opacity: 1, x: -280, y: 30 }}
                            exit={{ opacity: 0, x: -320, transition: { duration: 0.5 } }}
                            className="absolute left-1/2 top-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#B85C5C]/20 bg-[#B85C5C]/10 backdrop-blur-xl shadow-2xl"
                        >
                            <AlertTriangle className="h-5 w-5 text-[#B85C5C]" />
                            <div>
                                <p className="text-[10px] font-bold text-[#B85C5C] uppercase tracking-widest leading-none mb-1">Risk Warning</p>
                                <p className="text-sm font-medium text-foreground whitespace-nowrap">{riskNote}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Live Analysis Text (Crossfade cycling) */}
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
                <div className="relative h-6 w-full flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={PHRASES[phraseIdx]}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="text-muted-foreground font-medium tracking-wider text-sm text-center px-4"
                        >
                            {PHRASES[phraseIdx]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                {/* Micro-progress detail */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-3 text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase"
                >
                    Processing Architecture • 256-bit isolation
                </motion.div>
            </div>
        </div>
    );
}
