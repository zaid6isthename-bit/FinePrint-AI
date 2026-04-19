"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import { ShieldAlert, Scale, Zap, Info, AlertTriangle } from "lucide-react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { easing } from "maath";

/* ---------------- CONFIG ---------------- */

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

/* ---------------- GLASS LENS ---------------- */

function GlassLens() {
  const ref = useRef<any>();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Smooth AI-like motion
    const x = Math.sin(t * 0.6) * 2.2;
    const y = Math.cos(t * 0.4) * 1.5;

    easing.damp3(ref.current.position, [x, y, 5], 0.15, delta);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0}
        thickness={6}
        ior={1.2}
        chromaticAberration={0.08}
        anisotropy={0.01}
      />
    </mesh>
  );
}

function GlassCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 25 }}>
      <ambientLight intensity={1} />
      <GlassLens />
    </Canvas>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export function AnalysisTheatre() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activeTag, setActiveTag] = useState<any>(null);
  const [riskNote, setRiskNote] = useState<string | null>(null);
  const [pulseLines, setPulseLines] = useState(false);

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

      {/* DOCUMENT BACKGROUND (IMPORTANT) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-[70%] h-[80%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-xs text-white/40 space-y-2">
          <p>Clause 1: Termination conditions and obligations...</p>
          <p>Clause 2: Indemnity responsibilities...</p>
          <p>Clause 3: Payment timelines and penalties...</p>
          <p>Clause 4: Arbitration and dispute resolution...</p>
        </div>
      </div>

      {/* GLASS LENS */}
      <div className="absolute inset-0 z-20">
        <GlassCanvas />
      </div>

      {/* NEURAL LINES */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {neuralConnections.map((conn, i) => (
            <motion.path
              key={i}
              d={conn.d}
              stroke="gold"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: conn.delay }}
            />
          ))}
        </svg>
      </div>

      {/* TAGS + RISK */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {activeTag && (
            <motion.div
              key={activeTag.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute left-1/2 top-1/2 px-4 py-2 rounded-xl border ${activeTag.borderColor} ${activeTag.bgColor}`}
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
              className="absolute left-1/2 top-1/2 mt-16 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
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
      </div>

    </div>
  );
}