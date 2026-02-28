"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Download, File as FileIcon, ShieldCheck,
    Zap, ChevronRight
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
}

export default function Dashboard() {
    const [data, setData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
    const { id } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const response = await api.get(`/documents/${id}`);
            setData(response.data);
            if (response.data.status === "COMPLETED" && response.data.clauses.length > 0 && !selectedClause) {
                setSelectedClause(response.data.clauses[0]);
            }
            if (response.data.status === "PROCESSING") {
                setTimeout(fetchData, 4000);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
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
            toast({ title: "Draft Copied", description: "Negotiation message is ready for use." });
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-400';
            case 'HIGH': return 'text-orange-400';
            case 'MEDIUM': return 'text-amber-400';
            default: return 'text-primary';
        }
    };

    if (authLoading || (loading && !data)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <AIPresence status="analyzing" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <main className="min-h-screen pt-28 pb-12 px-6 lg:px-12 bg-background relative overflow-hidden">
            {/* Background Calm Atmosphere */}
            <div className="absolute top-0 inset-x-0 h-screen pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-[1600px] mx-auto z-10 relative">
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border ${data.status === 'COMPLETED' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-primary/30 bg-primary/10 text-primary'
                                }`}>
                                {data.status === 'COMPLETED' ? 'Verified Analysis' : 'Processing Live'}
                            </span>
                            <span className="text-zinc-600 text-[10px] tracking-widest uppercase">ID: {String(data.id).slice(0, 8)}</span>
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">{data.title}</h1>
                        <p className="text-zinc-400 font-light max-w-xl">
                            Our AI has completed a comprehensive audit of your legal instrument. Review the identified architectural risks and recommendations below.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <Button variant="outline" className="glass-pane border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-300 rounded-xl h-12 px-6">
                            <Download className="mr-2 h-4 w-4" /> Export Audit
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
                            <ShieldCheck className="mr-2 h-4 w-4" /> Certified View
                        </Button>
                    </motion.div>
                </header>

                {data.status === 'COMPLETED' ? (
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column: Risk Gauge & Clauses */}
                        <section className="col-span-12 lg:col-span-4 space-y-8">
                            {/* Risk Gauge Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-pane p-10 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <h3 className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase mb-8">Architectural Risk Score</h3>

                                <div className="relative w-56 h-56 flex items-center justify-center">
                                    {/* Outer Ring Effect */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border border-dashed border-white/5"
                                    />

                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                        <motion.circle
                                            cx="112" cy="112" r="95"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray="597"
                                            initial={{ strokeDashoffset: 597 }}
                                            animate={{ strokeDashoffset: 597 - (597 * (data.riskScore || 0)) / 100 }}
                                            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                                            className={`${(data.riskScore || 0) > 60 ? 'text-red-400' : 'text-primary'}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            className="text-7xl font-bold tracking-tighter text-foreground"
                                        >
                                            {Math.round(data.riskScore || 0)}
                                        </motion.span>
                                        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mt-2">Score / 100</span>
                                    </div>
                                </div>

                                <div className="mt-10 px-4">
                                    <p className="text-zinc-700 dark:text-zinc-200 font-medium mb-1">
                                        {(data.riskScore || 0) > 60 ? "Elevated Exposure" : "Standard Exposure"}
                                    </p>
                                    <p className="text-zinc-500 text-xs font-light leading-relaxed">
                                        AI identified {data.clauses.length} significant clauses requiring professional scrutiny.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Clause List List */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase ml-4">Identified Clauses</h3>
                                <div className="space-y-3">
                                    {data.clauses.map((clause, idx) => (
                                        <motion.button
                                            key={clause.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => setSelectedClause(clause)}
                                            className={`w-full text-left p-6 rounded-2xl transition-all border duration-300 group
                        ${selectedClause?.id === clause.id
                                                    ? 'glass-pane border-primary/40 bg-zinc-100/50 dark:bg-primary/5 glow-indigo'
                                                    : 'bg-zinc-50/50 dark:bg-white/[0.02] border-zinc-100 dark:border-white/5 hover:border-zinc-200 dark:hover:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.04]'}
                      `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold tracking-widest uppercase py-1 ${getRiskColor(clause.riskLevel)}`}>
                                                    {clause.riskLevel} Risk
                                                </span>
                                                {selectedClause?.id === clause.id && (
                                                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <h4 className="text-foreground font-medium mb-1 flex items-center gap-2 font-semibold">
                                                {clause.clauseType}
                                                <ChevronRight className={`h-4 w-4 transition-transform ${selectedClause?.id === clause.id ? 'translate-x-1' : 'opacity-0'}`} />
                                            </h4>
                                            <p className="text-zinc-500 text-xs truncate font-light italic">{`"${clause.originalText.slice(0, 60)}..."`}</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Right Column: Inspection Panel */}
                        <section className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                            <AnimatePresence mode="wait">
                                {selectedClause ? (
                                    <motion.div
                                        key={selectedClause.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                        className="glass-pane p-12 rounded-[2.5rem] flex-1 relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className={`p-4 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10`}>
                                                <Zap className={`h-6 w-6 ${getRiskColor(selectedClause.riskLevel)}`} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-semibold text-foreground tracking-tight">{selectedClause.clauseType}</h2>
                                                <p className="text-zinc-500 text-sm font-light">Deep inspection report & simplification</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <section>
                                                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4 flex items-center gap-2">
                                                        <FileIcon className="h-3 w-3" /> Original Repository Text
                                                    </h4>
                                                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 font-serif text-zinc-400 text-sm leading-relaxed italic">
                                                        {`"${selectedClause.originalText}"`}
                                                    </div>
                                                </section>

                                                <div className="pt-4 grid grid-cols-2 gap-4">
                                                    <div className="glass-pane p-4 rounded-xl border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">AI Confidence</span>
                                                        <span className="text-lg font-semibold text-foreground">98.4%</span>
                                                    </div>
                                                    <div className="glass-pane p-4 rounded-xl border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Precedent Match</span>
                                                        <span className="text-lg font-semibold text-foreground">High</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <section className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                                        <ShieldCheck className="h-20 w-20 text-primary" />
                                                    </div>
                                                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-2">
                                                        Calm Interpretation
                                                    </h4>
                                                    <p className="text-primary dark:text-blue-100 text-lg font-light leading-relaxed">
                                                        {selectedClause.simplifiedText || "Interpretation in progress..."}
                                                    </p>
                                                </section>

                                                <section className="px-4">
                                                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">Strategic recommendation</h4>
                                                    <ul className="space-y-3">
                                                        <li className="flex items-start gap-3 text-sm text-zinc-400">
                                                            <div className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                                                            Advise counter-party to limit cap to 1x annual fees.
                                                        </li>
                                                        <li className="flex items-start gap-3 text-sm text-zinc-400">
                                                            <div className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                                                            Strike out the auto-renewal clause for multi-year terms.
                                                        </li>
                                                    </ul>
                                                </section>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="glass-pane rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
                                        <AIPresence status="idle" className="mb-6 opacity-30" />
                                        <p className="text-zinc-500 font-light tracking-widest uppercase text-xs">Awaiting Clause Selection</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Negotiation Drawer Mock (as index) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-pane p-10 rounded-[2.5rem] relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground mb-1">Negotiation Strategy</h3>
                                        <p className="text-zinc-500 text-sm font-light">AI-generated draft for resolution</p>
                                    </div>
                                    <Button onClick={copyNegotiation} className="bg-white/5 hover:bg-white/10 text-white rounded-xl gap-2 border border-white/10">
                                        <Copy className="h-4 w-4" /> Copy Protocol
                                    </Button>
                                </div>
                                <div className="bg-black/40 p-1 rounded-2xl border border-white/5">
                                    <pre className="whitespace-pre-wrap font-sans text-zinc-400 p-8 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar italic">
                                        {data.negotiationMsg || "Strategic generation in progress..."}
                                    </pre>
                                </div>
                            </motion.div>
                        </section>
                    </div>
                ) : (
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                        <AIPresence status="analyzing" className="mb-8" />
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">Engaging Intelligence</h2>
                        <p className="text-zinc-500 max-w-md font-light leading-relaxed">
                            Our neural models are mapping the legal architecture and calculating liability surfaces. This process maintains 256-bit isolation.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
