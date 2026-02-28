"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, Lock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AIPresence } from "@/components/AIPresence";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden bg-background">
      {/* Background Calm Atmosphere */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[60%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-brain-pulse" />
        <div className="absolute bottom-10 right-[10%] w-[40%] h-[30%] bg-[#C8A96A]/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-10 backdrop-blur-md">
          <div className="flex -space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse delay-75" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#A6A9B0] uppercase">Proprietary Legal Intelligence</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-semibold tracking-tight mb-8 text-foreground dark:text-[#E8E9EB]">
          The quiet expert. <br />
          <span className="text-muted-foreground dark:text-[#A6A9B0] font-light">Powered by AI.</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground dark:text-[#A6A9B0] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          FinePrint AI decodes legally binding contracts, uncovering risks and translating complex jargon into clear, actionable intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/upload" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="h-18 px-10 text-xl bg-primary hover:bg-[#D9A441] text-[#0E0F12] rounded-[1.5rem] group transition-all duration-500 shadow-2xl shadow-primary/30 glow-gold relative overflow-hidden w-full"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Intensive Scan
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ y: "100%" }}
                  whileHover={{ y: "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </Link>
          <Link href="/history" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="h-18 px-10 text-xl rounded-[1.5rem] border border-border hover:bg-muted dark:border-white/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground dark:text-[#A6A9B0] dark:hover:text-[#E8E9EB] transition-all w-full">
              Vault History
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" /> 256-bit isolation
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Certified Audit
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-3 w-3" /> Fair Terms Focus
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl z-10"
      >
        <FeatureCard
          icon={<AIPresence status="idle" />}
          title="Detect Architecture Risk"
          desc="Our models map the structural integrity of your agreement, spotting hidden financial exposure and termination bias."
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8 text-[#C8A96A]" />}
          title="Intelligent Translation"
          desc="Advanced NLP decodes dense legal jargon into premium summaries that maintain technical accuracy without complexity."
        />
        <FeatureCard
          icon={<CheckCircle2 className="h-8 w-8 text-[#6E9E75]" />}
          title="Negotiate with Precision"
          desc="Receive a professionally drafted resolution protocol designed to improve agreement balance by 40%."
        />
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] glass-pane hover:bg-muted dark:hover:bg-white/[0.05] transition-all duration-700 group border-border dark:border-white/10 shadow-sm dark:shadow-none">
      <div className="w-16 h-16 rounded-2xl bg-muted dark:bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-[#E8E9EB] tracking-tight">{title}</h3>
      <p className="text-muted-foreground dark:text-[#A6A9B0] leading-relaxed font-light text-sm">{desc}</p>
    </div>
  );
}
