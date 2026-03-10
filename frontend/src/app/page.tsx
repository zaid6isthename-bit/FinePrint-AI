"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden bg-transparent">
      {/* Background Calm Atmosphere */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,169,106,0.12)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse" />
        <div
          className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(80,100,160,0.08)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 backdrop-blur-md">
          <span className="text-[10px] font-mono font-bold tracking-[0.28em] text-gold uppercase">Proprietary Legal Intelligence</span>
        </div>

        <h1 className="text-6xl sm:text-[6.5rem] font-serif font-light tracking-tight mb-8 leading-[1.05] text-foreground">
          The quiet expert. <br />
          <span className="italic text-gold italic">Powered by AI.</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed font-light">
          FinePrint AI reads every clause of your contracts with the precision of a senior counsel - detecting hidden risks, quantifying exposure, and translating legalese before you sign.
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
                className="h-14 px-10 text-xs font-bold tracking-[0.15em] bg-gold/15 hover:bg-gold/20 text-gold rounded-sm border border-gold/30 uppercase transition-all duration-500 shadow-2xl shadow-gold/10 glow-gold relative overflow-hidden w-full group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Begin Intensive Scan
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/5"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </Link>
          <Link href="/history" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="h-14 px-10 text-xs font-bold tracking-[0.15em] rounded-sm border-border bg-transparent text-muted-foreground hover:border-gold/30 hover:text-gold uppercase transition-all w-full">
              Vault History
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground/50 uppercase">
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

      <div className="flex items-center gap-8 my-20 w-full max-w-3xl opacity-30">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Capabilities</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 md:grid-cols-4 gap-px w-full max-w-6xl z-10 border border-border rounded-sm overflow-hidden bg-border/5"
      >
        <FeatureItem
          num="01"
          title="Zero-Shot Clause Detection"
          desc="BART-large-MNLI classifies over 14 risk categories including auto-renewals, hidden charges, and arbitration clauses."
        />
        <FeatureItem
          num="02"
          title="Composite Risk Scoring"
          desc="A weighted mathematical formula combining clause severity, frequency, and pattern recognition to deliver a 0-100 risk index."
        />
        <FeatureItem
          num="03"
          title="Plain English Engine"
          desc="T5 transformer models distill dense legalese into clear, actionable summaries - understand exactly what you are agreeing to."
        />
        <FeatureItem
          num="04"
          title="Negotiation Synthesis"
          desc="Auto-drafts professional email and informal WhatsApp negotiation scripts targeting your highest-risk clauses."
        />
      </motion.div>

      <div className="mt-20 flex gap-12 justify-center opacity-70">
        <TrustStat num="14+" label="Risk Vectors" />
        <TrustStat num="<2s" label="Analysis Time" />
        <TrustStat num="256-Bit" label="Isolation" />
        <TrustStat num="100%" label="Private" />
      </div>
    </main>
  );
}

function FeatureItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="p-8 bg-transparent hover:bg-gold/5 transition-all duration-700 group cursor-default relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <span className="font-mono text-[10px] text-gold tracking-[0.2em] mb-4 block">{num}</span>
      <h3 className="text-xl font-serif font-normal mb-3 text-foreground tracking-tight leading-snug">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-light text-xs">{desc}</p>
    </div>
  );
}

function TrustStat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-center group">
      <div className="font-serif text-3xl font-light text-gold group-hover:scale-110 transition-transform duration-500">{num}</div>
      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase mt-1">{label}</div>
    </div>
  );
}
