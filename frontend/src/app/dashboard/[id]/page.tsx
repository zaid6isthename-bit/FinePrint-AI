"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Download, File as FileIcon, ShieldCheck,
    Zap, ChevronRight, AlertCircle, Loader2, Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AIPresence } from "@/components/AIPresence";
import api from "@/lib/api";

interface Clause {
    id: string;
    clauseType: string;
    riskLevel: string;
    severityScore: number;
    originalText: string;
    simplifiedText: string | null;
}

interface DocumentData {
    id: string;
    title: string;
    riskScore: number | null;
    status: string;
    clauses: Clause[];
    negotiationMsg: string | null;
    errorMessage?: string | null;
}

export default function Dashboard() {
    const [data, setData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
    const { id } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const response = await api.get(`/documents/${id}`);
            setData(response.data);

            if (response.data.status === "COMPLETED") {
                if (response.data.clauses.length > 0 && !selectedClause) {
                    setSelectedClause(response.data.clauses[0]);
                }
                setLoading(false);
            } else if (response.data.status === "FAILED") {
                setLoading(false);
            } else {
                // Keep polling if PROCESSING
                setTimeout(fetchData, 4000);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setError("The neural uplink could not be established. Please verify your connection.");
            setLoading(false);
        }
    }, [id, selectedClause]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (id) fetchData();
    }, [id, user, authLoading, router, fetchData]);

    const copyNegotiation = () => {
        if (data?.negotiationMsg) {
            navigator.clipboard.writeText(data.negotiationMsg);
            toast({
                title: "Protocol Copied",
                description: "Strategy draft is ready for secure deployment."
            });
        }
    };

    const handleExport = () => {
        window.print();
        toast({
            title: "Export Initiated",
            description: "Preparing vaulted audit report for physical output."
        });
    };

    const handleCertifiedView = () => {
        toast({
            title: "Certified View Restricted",
            description: "This view requires Senior Counsel level clearance."
        });
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-400';
            case 'HIGH': return 'text-orange-400';
            case 'MEDIUM': return 'text-gold';
            default: return 'text-emerald-400';
        }
    };

    const getRiskBorder = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'border-red-500/30';
            case 'HIGH': return 'border-orange-500/30';
            case 'MEDIUM': return 'border-gold/30';
            default: return 'border-emerald-500/30';
        }
    };

    if (authLoading || (loading && (!data || data.status === 'PROCESSING'))) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
                <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full animate-brain-pulse" />
                <AIPresence status="analyzing" className="scale-150 mb-12" />
                <h2 className="text-3xl font-serif font-light text-foreground mb-4 tracking-tight">Engaging Intelligence</h2>
                <p className="text-muted-foreground/40 text-[10px] font-mono tracking-[0.3em] uppercase max-w-sm text-center leading-loose">
                    Mapping legal architecture and calculating liability surfaces. 256-bit isolation maintained.
                </p>
            </div>
        );
    }

    if (error || data?.status === 'FAILED') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
                <div className="glass-pane p-12 max-w-md text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-serif text-foreground mb-4">{error ? "Uplink Error" : "Analysis Failed"}</h2>
                    <p className="text-muted-foreground font-light mb-4 italic">
                        {error || data?.errorMessage || "The document could not be processed. This may be due to file corruption, unsupported format, or insufficient text content."}
                    </p>
                    {data?.errorMessage && (
                        <p className="text-muted-foreground/60 text-xs font-mono mb-8 bg-black/10 dark:bg-zinc-900/50 p-4 rounded border border-border">
                            Technical details: {data.errorMessage}
                        </p>
                    )}
                    <Button onClick={() => error ? fetchData() : router.push('/upload')} className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-sm font-mono text-[10px] tracking-widest uppercase h-12 px-8 transition-all">
                        {error ? "Retry Uplink" : "Upload New Instrument"}
                    </Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <main className="min-h-screen pt-28 pb-12 px-6 lg:px-12 bg-background relative overflow-hidden">
            {/* Background Calm Atmosphere */}
            <div className="absolute top-0 inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full animate-brain-pulse delay-[3s]" />
            </div>

            <div className="max-w-[1600px] mx-auto z-10 relative">
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 no-print">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-sm text-[9px] font-mono font-bold tracking-[0.2em] uppercase border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
                                Verified Analysis
                            </span>
                            <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase">Vault ID: {String(data.id).slice(0, 8)}</span>
                        </div>
                        <h1 className="text-5xl font-serif font-light tracking-tight text-foreground mb-4">{data.title}</h1>
                        <p className="text-muted-foreground/60 font-serif italic text-lg max-w-xl">
                            Our AI has completed a comprehensive audit of your legal instrument. Review the identified architectural risks and recommendations below.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-4">
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="bg-midnight/30 border-white/5 hover:bg-white/5 text-zinc-400 rounded-sm h-12 px-6 font-mono text-[10px] tracking-widest uppercase transition-all"
                        >
                            <Printer className="mr-3 h-4 w-4" /> Export Audit
                        </Button>
                        <Button
                            onClick={handleCertifiedView}
                            className="bg-gold/10 hover:bg-gold/20 text-gold rounded-sm h-12 px-6 border border-gold/30 font-mono text-[10px] tracking-widest uppercase transition-all shadow-xl shadow-gold/5 glow-gold"
                        >
                            <ShieldCheck className="mr-3 h-4 w-4" /> Certified View
                        </Button>
                    </motion.div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Risk Gauge & Clauses */}
                    <section className="col-span-12 lg:col-span-4 space-y-10">
                        {/* Risk Gauge Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-pane p-12 rounded-sm flex flex-col items-center text-center relative overflow-hidden group shadow-2xl shadow-black/50"
                        >
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                            <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-zinc-500 uppercase mb-10">Architectural Risk Score</h3>

                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Outer Ring Effect */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border border-dashed border-gold/10"
                                />

                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        cx="128" cy="128" r="110"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray="691"
                                        initial={{ strokeDashoffset: 691 }}
                                        animate={{ strokeDashoffset: 691 - (691 * (data.riskScore || 0)) / 100 }}
                                        transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                                        className={`${(data.riskScore || 0) > 60 ? 'text-red-400' : 'text-gold'}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="text-8xl font-serif font-light tracking-tighter text-foreground"
                                    >
                                        {Math.round(data.riskScore || 0)}
                                    </motion.span>
                                    <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase mt-4">Security Level</span>
                                </div>
                            </div>

                            <div className="mt-12 w-full pt-8 border-t border-white/5">
                                <p className="text-foreground font-serif text-xl mb-2">
                                    {(data.riskScore || 0) > 60 ? "Elevated Exposure" : "Standard Exposure"}
                                </p>
                                <p className="text-zinc-500 text-xs font-mono tracking-wide leading-relaxed">
                                    AI IDENTIFIED {data.clauses.length} ANOMALIES REQUIRING PROFESSIONAL SCRUTINY.
                                </p>
                            </div>
                        </motion.div>

                        {/* Clause List */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-zinc-500 uppercase ml-4">Identified Clauses</h3>
                            <div className="space-y-3 no-print">
                                {data.clauses.map((clause, idx) => (
                                    <motion.button
                                        key={clause.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setSelectedClause(clause)}
                                        className={`w-full text-left p-6 rounded-sm transition-all border duration-500 group
                                            ${selectedClause?.id === clause.id
                                                ? `bg-gold/5 ${getRiskBorder(clause.riskLevel)} glow-gold shadow-lg`
                                                : 'bg-midnight/20 border-white/5 hover:border-gold/20 hover:bg-gold/[0.02]'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[9px] font-mono font-bold tracking-[0.1em] uppercase py-1 ${getRiskColor(clause.riskLevel)}`}>
                                                {clause.riskLevel} SEVERITY
                                            </span>
                                            {selectedClause?.id === clause.id && (
                                                <div className="w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(200,169,106,1)]" />
                                            )}
                                        </div>
                                        <h4 className="text-foreground font-serif text-lg mb-2 flex items-center justify-between">
                                            {clause.clauseType}
                                            <ChevronRight className={`h-4 w-4 transition-transform text-gold/30 ${selectedClause?.id === clause.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                        </h4>
                                        <p className="text-zinc-600 font-mono text-[10px] truncate uppercase tracking-tight italic">"{clause.originalText.slice(0, 50)}..."</p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Inspection Panel */}
                    <section className="col-span-12 lg:col-span-8 flex flex-col gap-10">
                        <AnimatePresence mode="wait">
                            {selectedClause ? (
                                <motion.div
                                    key={selectedClause.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="glass-pane p-14 rounded-sm flex-1 relative overflow-hidden shadow-2xl shadow-black/80"
                                >
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className={`w-16 h-16 rounded-sm flex items-center justify-center bg-gold/5 border border-gold/20 shadow-xl shadow-gold/5`}>
                                            <Zap className={`h-8 w-8 ${getRiskColor(selectedClause.riskLevel)}`} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">{selectedClause.clauseType}</h2>
                                            <p className="text-zinc-500 font-mono text-[9px] tracking-[0.2em] uppercase mt-1">N.E.A.T Inspection Protocol Output</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12">
                                        <div className="space-y-8">
                                            <section>
                                                <h4 className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase mb-5 flex items-center gap-2">
                                                    <FileIcon className="h-3 w-3 text-gold/50" /> Original Forensic Text
                                                </h4>
                                                <div className="bg-midnight/40 p-10 rounded-sm border border-white/5 font-serif text-zinc-400 text-lg leading-relaxed italic border-l-2 border-l-gold/30 shadow-inner">
                                                    "{selectedClause.originalText}"
                                                </div>
                                            </section>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <section className="bg-gold/5 p-10 rounded-sm border border-gold/10 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                                        <ShieldCheck className="h-32 w-32 text-gold" />
                                                    </div>
                                                    <h4 className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase mb-6 flex items-center gap-2">
                                                        Simplification
                                                    </h4>
                                                    <p className="text-foreground text-xl font-serif font-light leading-relaxed">
                                                        {selectedClause.simplifiedText || "DECRYPTING INFLECTION..."}
                                                    </p>
                                                </section>

                                                <div className="flex flex-col gap-4">
                                                    <div className="bg-midnight/30 p-6 rounded-sm border border-white/5">
                                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-2">Confidence Level</span>
                                                        <span className="text-2xl font-serif text-foreground">99.782%</span>
                                                    </div>
                                                    <div className="bg-midnight/30 p-6 rounded-sm border border-white/5">
                                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-2">Precedent Match</span>
                                                        <span className="text-2xl font-serif text-foreground italic">High-Fidelity</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-pane rounded-sm flex-1 flex flex-col items-center justify-center text-center p-20 border-dashed border-white/5">
                                    <AIPresence status="idle" className="mb-10 opacity-20" />
                                    <p className="text-zinc-600 font-mono tracking-[0.4em] uppercase text-[10px]">Awaiting forensic focus</p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Negotiation Strategy */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-pane p-12 rounded-sm relative overflow-hidden shadow-2xl shadow-black"
                        >
                            <div className="flex items-center justify-between mb-10 no-print">
                                <div>
                                    <h3 className="text-2xl font-serif font-light text-foreground mb-1">Negotiation Strategy</h3>
                                    <p className="text-zinc-500 font-mono text-[9px] tracking-[0.2em] uppercase">Tactical response blueprint</p>
                                </div>
                                <Button
                                    onClick={copyNegotiation}
                                    className="bg-gold/10 hover:bg-gold/20 text-gold rounded-sm gap-3 border border-gold/30 font-mono text-[9px] tracking-widest uppercase h-11 px-6 transition-all"
                                >
                                    <Copy className="h-3.5 w-3.5" /> Initialize Protocol
                                </Button>
                            </div>
                            <div className="bg-black/60 p-1 rounded-sm border border-white/5">
                                <pre className="whitespace-pre-wrap font-serif text-zinc-400 p-10 text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar italic tracking-wide">
                                    {data.negotiationMsg || "STRATEGY OPTIMIZATION IN PROGRESS..."}
                                </pre>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .glass-pane { border: 1px solid #ccc !important; box-shadow: none !important; background: white !important; }
                    .text-foreground { color: black !important; }
                    .text-zinc-500, .text-zinc-600, .text-muted-foreground { color: #555 !important; }
                    .bg-midnight, .bg-black { background: white !important; }
                    main { padding-top: 20px !important; }
                }
            `}</style>
        </main>
    );
}
