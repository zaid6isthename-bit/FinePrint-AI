"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-200">AI-Powered Legal Risk Analysis</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent">
          READ THE <span className="text-blue-500">FINE PRINT</span>
          <br /> BEFORE YOU SIGN.
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload any legal agreement and our ML engine will detect hidden clauses,
          calculate a risk score, and translate legal jargon into plain English instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/upload">
            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full group transition-all">
              Analyze Document Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/history">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5">
              View Past Analyses
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl z-10"
      >
        <FeatureCard
          icon={<ShieldAlert className="h-8 w-8 text-red-400" />}
          title="Detect Hidden Risks"
          desc="Automatically spots Auto-Renewals, Arbitration clauses, and hidden fees."
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8 text-blue-400" />}
          title="Plain English Translation"
          desc="Converts complex legal jargon into simple, easy-to-understand terms."
        />
        <FeatureCard
          icon={<CheckCircle2 className="h-8 w-8 text-emerald-400" />}
          title="Negotiation Ready"
          desc="Generates professional messages to negotiate better terms with counter-parties."
        />
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
