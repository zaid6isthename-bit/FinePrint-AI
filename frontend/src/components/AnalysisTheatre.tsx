"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ShieldAlert, Scale, Zap, Info, AlertTriangle } from "lucide-react";

/* ---------------- CONFIG ---------------- */

const PHRASES = [
  "Parsing document structure...",
  "Analyzing legal semantics...",
  "Detecting risk patterns...",
  "Cross-referencing clauses...",
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

/* ---------------- MAIN ---------------- */

export function AnalysisTheatre() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activeTag, setActiveTag] = useState<any>(null);
  const [riskNote, setRiskNote] = useState<string | null>(null);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
    }, 2500);

    const tagInterval = setInterval(() => {
      const randomTag = TAGS[Math.floor(Math.random() * TAGS.length)];
      setActiveTag(randomTag);
      setTimeout(() => setActiveTag(null), 1800);
    }, 4500);

    const riskInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setRiskNote(RISK_NOTES[Math.floor(Math.random() * RISK_NOTES.length)]);
        setTimeout(() => setRiskNote(null), 2000);
      }
    }, 6000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(tagInterval);
      clearInterval(riskInterval);
    };
  }, []);

  /* ---------------- PARTICLES ---------------- */

  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      radius: 80 + Math.random() * 40,
      speed: 0.5 + Math.random(),
    }));
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center overflow-hidden">

      {/* CORE ANIMATION */}
      <div className="relative flex items-center justify-center">

        {/* PULSING CORE */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/40 to-yellow-200/10 blur-xl absolute"
        />

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-6 rounded-full bg-yellow-300 shadow-[0_0_25px_rgba(255,215,0,0.6)]"
        />

        {/* ROTATING RINGS */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border border-yellow-400/20 rounded-full"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 border border-yellow-400/10 rounded-full"
        />

        {/* ORBITING PARTICLES */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20 / p.speed,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: p.radius * 2,
              height: p.radius * 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0%",
                transform: "translate(-50%, -50%)",
              }}
              className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.8)]"
            />
          </motion.div>
        ))}

        {/* ENERGY LINES */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
            }}
            className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}

      </div>

      {/* TAGS + RISK */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {activeTag && (
            <motion.div
              key={activeTag.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl border ${activeTag.borderColor} ${activeTag.bgColor}`}
            >
              <span className={`text-xs ${activeTag.color}`}>{activeTag.text}</span>
            </motion.div>
          )}

          {riskNote && (
            <motion.div
              key={riskNote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 mt-16 -translate-x-1/2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <span className="text-xs text-red-400">{riskNote}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TEXT */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={PHRASES[phraseIdx]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-zinc-400"
          >
            {PHRASES[phraseIdx]}
          </motion.p>
        </AnimatePresence>

        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-3 text-[10px] tracking-[0.3em] text-zinc-500 uppercase"
        >
          Cognitive Processing • Risk Engine Active
        </motion.div>
      </div>

    </div>
  );
}