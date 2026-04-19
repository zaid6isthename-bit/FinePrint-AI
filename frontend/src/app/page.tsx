"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Scale, Search, BarChart3, PenTool, Zap, Upload, ScanLine, FileCheck, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MobileHome from "@/components/MobileHome";
import { useRef } from "react";

// Risk category data
const riskCategories = [
  { name: "Auto-Renewal Clauses", level: "high" },
  { name: "Hidden Fees & Charges", level: "high" },
  { name: "Binding Arbitration", level: "high" },
  { name: "Non-Compete Clauses", level: "high" },
  { name: "IP Ownership Transfer", level: "high" },
  { name: "Liability Waivers", level: "moderate" },
  { name: "Indemnification Terms", level: "moderate" },
  { name: "Termination Penalties", level: "moderate" },
  { name: "Data Usage Rights", level: "moderate" },
  { name: "Warranty Disclaimers", level: "moderate" },
  { name: "Cancellation Rights", level: "low" },
  { name: "Force Majeure", level: "low" },
  { name: "Confidentiality Terms", level: "low" },
  { name: "Payment Terms", level: "low" },
  { name: "Governing Law", level: "low" },
  { name: "Amendment Clauses", level: "low" },
];

const tickerItems = [
  "Auto-Renewal Detection",
  "Hidden Fees Analysis",
  "Arbitration Clause Check",
  "Plain English Translation",
  "Risk Score 0–100",
  "IP Ownership Scan",
  "Termination Penalties",
  "Liability Assessment",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Mobile Content */}
      <div className="md:hidden">
        <MobileHome />
      </div>

      {/* Desktop Content */}
      <main ref={containerRef} className="hidden md:block overflow-x-hidden">

        {/* ===================== HERO SECTION ===================== */}
        <section className="relative min-h-screen flex items-center pt-[68px] bg-[#F2EFE9] dark:bg-[#0E0F12] overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,169,106,0.1)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse pointer-events-none" />
          <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(80,100,160,0.06)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse pointer-events-none" style={{ animationDelay: "4s" }} />

          <div className="max-w-7xl mx-auto px-12 w-full grid grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-gold" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase">Legal Intelligence Platform</span>
              </div>

              <h1 className="text-6xl lg:text-[5.5rem] font-serif font-light tracking-tight leading-[1.05] mb-8">
                Read the<br />
                <span className="italic text-gold">fine print.</span><br />
                Before it costs you.
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed font-light">
                Barrister AI scans every clause of your contracts with AI precision — detecting hidden risks, quantifying exposure, and explaining what you&apos;re actually agreeing to.
              </p>

              <div className="flex items-center gap-4">
                <Button asChild size="lg" className="h-14 px-10 text-[10px] font-mono font-bold tracking-[0.15em] bg-gold/15 hover:bg-gold/20 text-gold rounded-sm border border-gold/30 uppercase transition-all duration-500 shadow-2xl shadow-gold/10 glow-gold group">
                  <Link href="/upload">
                    Analyze Your Contract
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-[10px] font-mono font-bold tracking-[0.15em] rounded-sm border-border text-muted-foreground hover:border-gold/30 hover:text-gold uppercase transition-all">
                  <a href="#features">See How It Works</a>
                </Button>
              </div>
            </motion.div>

            {/* Right - Document Mockup Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-white/5 rounded-lg shadow-2xl shadow-black/10 dark:shadow-black/40 p-8 border border-black/5 dark:border-white/10 max-w-md ml-auto">
                {/* Document Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif text-lg text-foreground dark:text-white">Software License &amp; Service Terms</h3>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">Uploaded 2 minutes ago</p>
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-1.5">
                    <span className="text-2xl font-serif font-light text-red-500">74</span>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-red-500 font-bold">Risk</span>
                  </div>
                </div>

                {/* Clause Items */}
                <div className="space-y-3">
                  <ClausePill label="Auto-Renewal" risk="high" />
                  <ClausePill label="Binding Arbitration" risk="high" />
                  <ClausePill label="Liability Waiver" risk="moderate" />
                  <ClausePill label="IP Ownership Transfer" risk="high" />
                  <ClausePill label="Cancellation Rights" risk="low" />
                  <ClausePill label="Data Usage Rights" risk="moderate" />
                </div>

                {/* Scan line animation */}
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <div className="scan-line absolute inset-x-0" />
                </div>
              </div>

              {/* Floating decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold/20 rounded-full opacity-40 animate-brain-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-gold/10 rounded-full opacity-30 animate-brain-pulse" style={{ animationDelay: "2s" }} />
            </motion.div>
          </div>
        </section>

        {/* ===================== STATS BAR ===================== */}
        <section className="bg-[#F2EFE9] dark:bg-[#0E0F12] border-t border-black/5 dark:border-white/5">
          <div className="max-w-5xl mx-auto py-12 flex justify-between items-center px-12">
            <TrustStat num="14+" label="Risk Vectors" />
            <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
            <TrustStat num="< 2s" label="Analysis Time" />
            <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
            <TrustStat num="256-bit" label="Encryption" />
            <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
            <TrustStat num="100%" label="Private" />
          </div>
        </section>

        {/* ===================== TICKER / MARQUEE ===================== */}
        <section className="bg-foreground dark:bg-white py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="mx-8 text-[11px] font-mono uppercase tracking-[0.2em] text-background/40 dark:text-foreground/40 flex items-center gap-6">
                {item}
                <span className="text-gold text-lg">◆</span>
              </span>
            ))}
          </div>
        </section>

        {/* ===================== CAPABILITIES SECTION ===================== */}
        <section id="features" className="bg-[#F2EFE9] dark:bg-[#0E0F12] py-32">
          <div className="max-w-6xl mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase block mb-6">Core Capabilities</span>
              <h2 className="text-5xl lg:text-6xl font-serif font-light tracking-tight">
                Your contract,<br />
                <span className="italic text-gold">fully decoded.</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto font-light text-lg leading-relaxed">
                Four AI systems working in concert to protect you before you put pen to paper — or finger to trackpad.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityCard num="01" icon={<Search className="h-6 w-6" />} title="Zero-Shot Clause Detection" desc="BART-large-MNLI classifies over 14 risk categories including auto-renewals, hidden charges, and arbitration clauses — without ever needing examples of your specific contract." />
              <CapabilityCard num="02" icon={<BarChart3 className="h-6 w-6" />} title="Composite Risk Scoring" desc="A weighted mathematical formula combining clause severity, frequency, and pattern recognition delivers a precise 0–100 risk index. Know immediately if a contract is safe or treacherous." />
              <CapabilityCard num="03" icon={<PenTool className="h-6 w-6" />} title="Plain English Engine" desc="T5 transformer models distill dense legalese into clear, actionable summaries. Understand exactly what you are — and aren't — agreeing to, before it's too late." />
              <CapabilityCard num="04" icon={<Zap className="h-6 w-6" />} title="Negotiation Synthesis" desc="Automatically drafts professional email and WhatsApp negotiation scripts targeting your highest-risk clauses. Walk into any negotiation knowing exactly what to push back on." />
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section id="how" className="bg-foreground dark:bg-[#111215] text-background dark:text-foreground py-32">
          <div className="max-w-6xl mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase block mb-6">The Process</span>
              <h2 className="text-5xl lg:text-6xl font-serif font-light tracking-tight">
                From upload to<br />
                <span className="italic text-gold">actionable insight</span><br />
                in under two seconds.
              </h2>
              <p className="text-background/50 dark:text-foreground/50 mt-6 max-w-xl mx-auto font-light text-lg leading-relaxed">
                No setup required. No legal expertise needed. Just drop in a file and let the AI do the heavy lifting.
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              <StepCard num="01" icon={<Upload className="h-8 w-8" />} title="Upload Your Document" desc="Drop in any PDF or image of your contract — lease, software terms, employment agreement, NDA, anything. We handle it all." />
              <StepCard num="02" icon={<ScanLine className="h-8 w-8" />} title="AI Scans Every Clause" desc="Our models run 14+ risk classifiers across every paragraph, identifying dangerous language, hidden obligations, and unfair terms." />
              <StepCard num="03" icon={<FileCheck className="h-8 w-8" />} title="Get Your Risk Report" desc="Receive a full breakdown: your Risk Score, flagged clauses in plain English, and ready-to-send negotiation scripts. Sign with confidence — or push back with precision." />
            </div>
          </div>
        </section>

        {/* ===================== RISK CATEGORIES ===================== */}
        <section id="risks" className="bg-[#F2EFE9] dark:bg-[#0E0F12] py-32">
          <div className="max-w-6xl mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase block mb-6">What We Detect</span>
              <h2 className="text-5xl lg:text-6xl font-serif font-light tracking-tight">
                14+ risk vectors.<br />
                <span className="italic text-gold">Nothing slips through.</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto font-light text-lg leading-relaxed">
                From the obvious to the obscure, Barrister AI flags every category of contractual risk before you sign.
              </p>
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {riskCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm hover:border-gold/30 transition-all group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cat.level === 'high' ? 'bg-red-500' : cat.level === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-mono tracking-wide text-foreground group-hover:text-gold transition-colors">{cat.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== TESTIMONIAL ===================== */}
        <section className="bg-[#F2EFE9] dark:bg-[#0E0F12] py-24 border-t border-black/5 dark:border-white/5">
          <div className="max-w-5xl mx-auto px-12 grid grid-cols-5 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="col-span-3"
            >
              <Quote className="h-8 w-8 text-gold/30 mb-6" />
              <blockquote className="text-2xl font-serif font-light leading-relaxed italic text-foreground mb-6">
                I almost signed a freelance contract with an IP ownership clause that would have handed over all my code to the client. Barrister AI caught it in seconds.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gold" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Software Engineer, Mumbai</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="col-span-2 space-y-4"
            >
              <div className="p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm text-center">
                <div className="font-serif text-3xl text-gold mb-1">14+</div>
                <div className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Risk Vectors Analyzed</div>
              </div>
              <div className="p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm text-center">
                <div className="font-serif text-3xl text-gold mb-1">&lt; 2s</div>
                <div className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Full Contract Scan</div>
              </div>
              <div className="p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm text-center">
                <div className="font-serif text-3xl text-gold mb-1">100%</div>
                <div className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Private &amp; Secure</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="bg-foreground dark:bg-[#111215] text-background dark:text-foreground py-32">
          <div className="max-w-4xl mx-auto px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl lg:text-6xl font-serif font-light tracking-tight mb-6">
                Stop signing contracts<br />
                you <span className="italic text-gold">don&apos;t understand.</span>
              </h2>
              <p className="text-background/50 dark:text-foreground/50 font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                Every contract hides something. Barrister AI makes sure you know what it is before you&apos;re bound by it. Upload your first document in seconds.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/upload">
                  <Button size="lg" className="h-14 px-10 text-[10px] font-mono font-bold tracking-[0.15em] bg-gold/20 hover:bg-gold/30 text-gold rounded-sm border border-gold/40 uppercase transition-all duration-500 glow-gold group">
                    Analyze a Contract Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-[10px] font-mono font-bold tracking-[0.15em] rounded-sm border-background/20 dark:border-foreground/20 text-background/70 dark:text-foreground/70 hover:border-gold/40 hover:text-gold uppercase transition-all">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="bg-[#F2EFE9] dark:bg-[#0E0F12] border-t border-black/5 dark:border-white/5 py-12">
          <div className="max-w-6xl mx-auto px-12 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-light text-foreground">
              Barrister AI
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/upload" className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors">Analyze</Link>
              <Link href="/signup" className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors">Sign Up</Link>
              <Link href="/login" className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors">Login</Link>
            </div>
            <p className="text-[10px] font-mono tracking-wider text-muted-foreground/50">© 2026 Barrister AI — Know Before You Sign</p>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ==================== SUB-COMPONENTS ==================== */

function ClausePill({ label, risk }: { label: string; risk: string }) {
  const colors = {
    high: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    moderate: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    low: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-sm border ${colors[risk as keyof typeof colors]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${risk === 'high' ? 'bg-red-500' : risk === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      <span className="text-xs font-mono tracking-wide">{label}</span>
    </div>
  );
}

function TrustStat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-center group">
      <div className="font-serif text-3xl font-light text-foreground group-hover:text-gold transition-colors duration-500">{num}</div>
      <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase mt-1">{label}</div>
    </div>
  );
}

function CapabilityCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: parseFloat(num) * 0.1 }}
      className="p-8 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm hover:border-gold/30 hover:bg-gold/5 transition-all duration-500 group"
    >
      <div className="text-gold/40 group-hover:text-gold transition-colors mb-6">{icon}</div>
      <span className="font-mono text-[10px] text-gold/60 tracking-[0.2em] mb-4 block">{num}</span>
      <h3 className="text-xl font-serif font-normal mb-3 text-foreground tracking-tight leading-snug">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-light text-xs">{desc}</p>
    </motion.div>
  );
}

function StepCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: parseFloat(num) * 0.15 }}
      className="text-center group"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold/20 text-gold/40 group-hover:text-gold group-hover:border-gold/40 transition-all duration-500 mb-8">
        {icon}
      </div>
      <span className="font-mono text-[10px] text-gold tracking-[0.2em] mb-4 block">{num}</span>
      <h3 className="text-2xl font-serif font-light mb-4">{title}</h3>
      <p className="text-background/50 dark:text-foreground/50 font-light text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
    </motion.div>
  );
}
