"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Scale, Menu, FileSearch, History, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MobileHome() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden pt-20 pb-24 px-6 md:hidden">
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <div className="inline-block px-3 py-1 mb-6 border-l-2 border-gold/40 bg-gold/5">
          <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-gold uppercase">
            Protocol v4.2 // Mobile Terminal
          </span>
        </div>

        <h1 className="text-5xl font-serif font-light tracking-tight leading-[1.1] mb-6">
          The <span className="italic text-gold">Digital</span> <br />
          Barrister.
        </h1>

        <p className="text-base text-muted-foreground font-light leading-relaxed max-w-[280px]">
          Sophisticated AI that distills complex legal risks into clear, actionable intelligence.
        </p>
      </motion.div>

      {/* Primary Action Card - Tonal Shift instead of border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative mb-12"
      >
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
        
        <Link href="/upload" className="block relative z-10">
          <div className="p-8 bg-card/40 backdrop-blur-xl rounded-sm border-l border-gold/30 group">
            <div className="flex justify-between items-start mb-12">
              <div className="h-10 w-px bg-gold/50" />
              <span className="font-mono text-[9px] text-gold/60 uppercase tracking-[0.3em]">Ready for Intake</span>
            </div>
            
            <h2 className="text-2xl font-serif mb-2 group-hover:italic transition-all duration-500">Begin Intensive Scan</h2>
            <p className="text-xs text-muted-foreground mb-8 font-light max-w-[200px]">Upload any PDF or image for instant hazard quantification.</p>
            
            <div className="flex items-center gap-2 text-gold group-hover:translate-x-1 transition-transform duration-500">
               <span className="text-[10px] font-mono font-bold tracking-[0.1em] uppercase">Initialize</span>
               <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Feature Grid - Asymmetrical */}
      <div className="grid grid-cols-2 gap-4 mb-16">
        <FeatureCard 
          icon={<ShieldCheck className="h-4 w-4 text-gold/70" />}
          title="Risk Index"
          desc="Mathematical risk quantification"
        />
        <div className="mt-8">
            <FeatureCard 
              icon={<Scale className="h-4 w-4 text-gold/70" />}
              title="Fair Terms"
              desc="Arbitration & Renewal checks"
            />
        </div>
      </div>

      {/* Bottom Stats - Mono Metadata */}
      <div className="mt-auto border-t border-white/5 pt-8 flex justify-between items-end opacity-60 px-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">LATENCY</span>
          <span className="font-mono text-xs text-gold">0.8s SYN</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">ENCRYPTION</span>
          <span className="font-mono text-xs text-gold">AES-256</span>
        </div>
      </div>

      {/* Bottom Stats - Mono Metadata */}
      <div className="mt-auto border-t border-white/5 pt-8 flex justify-between items-end opacity-60 px-2 pb-12">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">LATENCY</span>
          <span className="font-mono text-xs text-gold">0.8s SYN</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">ENCRYPTION</span>
          <span className="font-mono text-xs text-gold">AES-256</span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-5 bg-card/40 backdrop-blur-md rounded-sm border-t border-white/5 dark:border-white/5">
      <div className="mb-4">{icon}</div>
      <h3 className="font-serif text-lg mb-1">{title}</h3>
      <p className="text-[10px] leading-relaxed text-muted-foreground font-light">{desc}</p>
    </div>
  );
}

function NavIconButton({ icon, active, href }: { icon: React.ReactNode, active?: boolean, href: string }) {
  return (
    <Link href={href} className={`p-3 rounded-full transition-all duration-300 ${active ? 'bg-gold/20 text-gold shadow-lg shadow-gold/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
      {icon}
    </Link>
  );
}
