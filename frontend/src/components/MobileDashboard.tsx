"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Download, File as FileIcon,
    Zap, ChevronRight, AlertCircle, Loader2, Printer, Check, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

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

interface MobileDashboardProps {
    data: DocumentData;
    onExport: () => void;
    onCopyNegotiation: () => void;
}

export default function MobileDashboard({ data, onExport, onCopyNegotiation }: MobileDashboardProps) {
    const [selectedClause, setSelectedClause] = useState<Clause | null>(
        data.clauses.length > 0 ? data.clauses[0] : null
    );

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-400';
            case 'HIGH': return 'text-orange-400';
            case 'MEDIUM': return 'text-gold';
            default: return 'text-emerald-400';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans pt-12 pb-24 md:hidden overflow-x-hidden">
            {/* Header */}
            <div className="px-6 flex items-center justify-between mb-8">
                <Link href="/history" className="p-2 -ml-2 text-gold/60">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <span className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase opacity-60">
                    Audit Report
                </span>
                <button onClick={onExport} className="p-2 -mr-2 text-gold/60">
                    <Printer className="h-5 w-5" />
                </button>
            </div>

            {/* Document Title & Score */}
            <div className="px-6 mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[8px] font-mono font-bold tracking-[0.2em] uppercase text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5">
                        Verified
                    </span>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">#{String(data.id).slice(0, 8)}</span>
                </div>
                <h1 className="text-3xl font-serif font-light mb-6 tracking-tight leading-tight">{data.title}</h1>
                
                {/* Risk Circle (Mini version for mobile) */}
                <div className="bg-card/40 backdrop-blur-md p-6 flex items-center gap-6 border border-white/5 dark:border-white/5">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/5" />
                            <motion.circle
                                cx="40" cy="40" r="36"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray="226"
                                initial={{ strokeDashoffset: 226 }}
                                animate={{ strokeDashoffset: 226 - (226 * (data.riskScore || 0)) / 100 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`${(data.riskScore || 0) > 60 ? 'text-red-400' : 'text-gold'}`}
                            />
                        </svg>
                        <span className="absolute text-2xl font-serif">{Math.round(data.riskScore || 0)}</span>
                    </div>
                    <div>
                        <p className="font-mono text-[8px] tracking-widest uppercase text-gold mb-1">Risk Intensity</p>
                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                            {(data.riskScore || 0) > 60 ? 'Critical vulnerabilities detected.' : 'Minimal architectural friction.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Clauses Horizontal Scroll */}
            <div className="mb-10">
                <div className="px-6 flex justify-between items-end mb-4">
                    <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-white/40 dark:text-white/20 uppercase">Anomalies</h3>
                    <span className="text-[8px] font-mono text-gold/40">{data.clauses.length} detected</span>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar -mx-6 scroll-px-6 snap-x">
                    {data.clauses.map((clause) => (
                        <button
                            key={clause.id}
                            onClick={() => setSelectedClause(clause)}
                            className={`flex-none w-64 p-5 text-left border snap-start transition-all duration-500 backdrop-blur-sm
                                ${selectedClause?.id === clause.id 
                                    ? 'bg-gold/5 border-gold/40 shadow-xl shadow-gold/5' 
                                    : 'bg-card/10 border-white/5 dark:border-white/5 opacity-60'}
                            `}
                        >
                            <span className={`text-[8px] font-mono block mb-2 font-bold tracking-widest ${getRiskColor(clause.riskLevel)}`}>
                                {clause.riskLevel}
                            </span>
                            <h4 className="font-serif text-base mb-1 truncate">{clause.clauseType}</h4>
                            <p className="text-[9px] font-mono text-muted-foreground/40 italic line-clamp-1">"{clause.originalText}"</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Clause Inspection */}
            <AnimatePresence mode="wait">
                {selectedClause && (
                    <motion.div
                        key={selectedClause.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-6 flex-1"
                    >
                        <div className="bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/5 p-8 relative overflow-hidden">
                            <Zap className={`absolute top-0 right-0 h-32 w-32 -mr-16 -mt-16 opacity-[0.03] ${getRiskColor(selectedClause.riskLevel)}`} />
                            
                            <section className="mb-8">
                                <h5 className="text-[8px] font-mono tracking-widest uppercase text-gold/40 mb-3">Interpretation</h5>
                                <p className="text-lg font-serif italic text-foreground leading-relaxed">
                                    {selectedClause.simplifiedText || "Parsing..."}
                                </p>
                            </section>

                            <section>
                                <h5 className="text-[8px] font-mono tracking-widest uppercase text-gold/40 mb-3">Original Forensic</h5>
                                <p className="text-[11px] font-serif text-muted-foreground/60 leading-loose italic bg-black/10 dark:bg-black/20 p-4 border-l border-gold/30">
                                    "{selectedClause.originalText}"
                                </p>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Negotiation Bottom Sheet Mock */}
            <div className="mt-12 px-6">
                <div className="bg-background border border-gold/20 p-8 shadow-2xl shadow-gold/5">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-serif text-xl">Strategy</h4>
                        <button onClick={onCopyNegotiation} className="text-gold p-2">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground/60 font-serif italic leading-relaxed line-clamp-4">
                        {data.negotiationMsg || "Generating tactical response..."}
                    </p>
                    <Button 
                        onClick={onCopyNegotiation}
                        className="w-full mt-8 h-12 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-none text-[9px] font-mono tracking-widest uppercase"
                    >
                        Initialize Protocol
                    </Button>
                </div>
            </div>
            
            <div className="h-12" />
        </div>
    );
}

// Global no-scrollbar style (already in globals.css hopefully, but adding just in case for local use if needed)
