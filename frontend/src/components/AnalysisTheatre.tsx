"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ShieldAlert, Scale, Zap, Info, AlertTriangle } from "lucide-react";

const PHRASES = [
  "Mapping contractual obligations...",
  "Evaluating liability exposure...",
  "Detecting financial risk...",
  "Assessing enforceability...",
  "Parsing legal structures...",
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
  const [pulseLines, setPulseLines] = useState(false);

  useEffect(() => {
    // Cycling phrases
    const phraseInterval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
    }, 2500);

    // Occasional floating tags
    const tagInterval = setInterval(() => {
      const randomTag = TAGS[Math.floor(Math.random() * TAGS.length)];
      setActiveTag(randomTag);
      setTimeout(() => setActiveTag(null), 2000);
    }, 4000);

    // Occasional risk notes
    const riskInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setRiskNote(RISK_NOTES[Math.floor(Math.random() * RISK_NOTES.length)]);
        setTimeout(() => setRiskNote(null), 2500);
      }
    }, 6000);

    // Neural pulse logic
    const pulseInterval = setInterval(() => {
      setPulseLines(true);
      setTimeout(() => setPulseLines(false), 800);
    }, 3000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(tagInterval);
      clearInterval(riskInterval);
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
      
      {/* 1. Neural Structure Mapping (The "Golden Lines") */}
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
              stroke="#D9A441"
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0.1, 0.4, 0.2, 0.4],
                scaleX: [1, 1.05, 1],
              }}
              transition={{
                pathLength: { duration: 3, ease: "easeInOut", delay: conn.delay },
                opacity: { duration: 2, delay: conn.delay + 1, repeat: Infinity },
                scaleX: { duration: 1, repeat: Infinity }
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={100 + i * 120}
              cy={100 + (i % 2) * 300}
              r="4"
              fill="#D9A441"
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

      {/* 2. Floating Comments & Tags */}
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

      {/* 4. Forensic Status Feed */}
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