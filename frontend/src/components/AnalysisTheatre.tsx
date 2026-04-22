"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, Scale, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STAGES = [
  "Decrypting document structure",
  "Extracting parties and obligations",
  "Profiling risky clauses",
  "Composing negotiation leverage",
];

const CALLOUTS = [
  { label: "Termination asymmetry", icon: ShieldAlert, tone: "text-red-400 border-red-400/20 bg-red-400/10" },
  { label: "Auto-renewal trigger", icon: Zap, tone: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
  { label: "Arbitration detected", icon: Scale, tone: "text-gold border-gold/20 bg-gold/10" },
  { label: "Data-sharing permission", icon: Sparkles, tone: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" },
];

const DOC_LINES = [
  { width: "82%", delay: 0.1 },
  { width: "68%", delay: 0.18 },
  { width: "88%", delay: 0.26 },
  { width: "73%", delay: 0.34 },
  { width: "79%", delay: 0.42 },
  { width: "64%", delay: 0.5 },
];

export function AnalysisTheatre() {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [activeCallout, setActiveCallout] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((previous) => (previous + 1) % STAGES.length);
    }, 2200);

    const progressTimer = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 94) {
          return 94;
        }
        return Math.min(94, previous + Math.floor(Math.random() * 8) + 4);
      });
    }, 900);

    const calloutTimer = setInterval(() => {
      setActiveCallout((previous) => (previous + 1) % CALLOUTS.length);
    }, 1800);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
      clearInterval(calloutTimer);
    };
  }, []);

  const circumference = useMemo(() => 2 * Math.PI * 52, []);
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative mx-auto flex h-[620px] w-full max-w-5xl items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[10%] h-56 w-56 rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-[8%] right-[10%] h-64 w-64 rounded-full bg-sky-500/10 blur-[140px]" />
        <motion.div
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[12%] rounded-[32px] border border-gold/10"
        />
      </div>

      <div className="relative grid w-full max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.32em] text-gold/70">Live Scan</div>
              <div className="font-serif text-3xl font-light text-foreground">Contract topology</div>
            </div>
            <div className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
              {progress}% mapped
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0e1118]/90 p-6">
            <motion.div
              animate={{ y: ["-8%", "92%", "-8%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-gold/18 to-transparent"
            />
            <motion.div
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gold/50"
            />

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                <FileText className="h-7 w-7 text-gold" />
              </div>
              <div>
                <div className="font-serif text-xl text-foreground">Uploaded agreement</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
                  Structural pass in progress
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {DOC_LINES.map((line, index) => (
                <motion.div
                  key={`${line.width}-${index}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: [0.35, 0.9, 0.45], x: 0 }}
                  transition={{
                    duration: 1.6,
                    delay: line.delay,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                  }}
                  className="h-4 rounded-full bg-white/6"
                  style={{ width: line.width }}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {CALLOUTS.map((callout, index) => {
                const Icon = callout.icon;
                const isActive = index === activeCallout;
                return (
                  <motion.div
                    key={callout.label}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      opacity: isActive ? 1 : 0.55,
                      borderColor: isActive ? "rgba(200,169,106,0.35)" : "rgba(255,255,255,0.08)",
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${callout.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{callout.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.32em] text-gold/70">Processing State</div>
            <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#scanProgress)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="scanProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(245,158,11,0.55)" />
                    <stop offset="55%" stopColor="rgba(200,169,106,1)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0.75)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <div className="font-serif text-5xl font-light text-foreground">{progress}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">percent</div>
              </div>
            </div>

            <div className="relative h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={STAGES[stageIndex]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="font-serif text-center text-lg text-foreground"
                >
                  {STAGES[stageIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.32em] text-gold/70">Pipeline Trace</div>
            <div className="space-y-5">
              {STAGES.map((stage, index) => {
                const isCurrent = index === stageIndex;
                const isDone = index < stageIndex;
                return (
                  <div key={stage} className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        scale: isCurrent ? [1, 1.16, 1] : 1,
                        opacity: isDone || isCurrent ? 1 : 0.4,
                      }}
                      transition={{ duration: 1.4, repeat: isCurrent ? Infinity : 0, ease: "easeInOut" }}
                      className={`mt-0.5 h-3.5 w-3.5 rounded-full ${
                        isDone ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]" : isCurrent ? "bg-gold shadow-[0_0_18px_rgba(200,169,106,0.45)]" : "bg-white/20"
                      }`}
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${isDone || isCurrent ? "text-foreground" : "text-muted-foreground/55"}`}>{stage}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/45">
                        {isDone ? "Completed" : isCurrent ? "Scanning now" : "Queued"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
