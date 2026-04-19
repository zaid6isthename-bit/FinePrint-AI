"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Download, File as FileIcon,
    Zap, ChevronRight, AlertCircle, Loader2, Printer, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AIPresence } from "@/components/AIPresence";
import MobileDashboard from "@/components/MobileDashboard";
import { BarristerLogo, BarristerTextLogo } from "@/components/Logo";
import api from "@/lib/api";
import AnimatedList from "@/components/AnimatedList";

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
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const fetchData = useCallback(async () => {
        if (!id) return;

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
                setTimeout(fetchData, 800);
            }
        } catch (err: any) {
            console.error("Fetch error:", err);

            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
            } else {
                const message = err.response?.data?.detail || err.message || "The neural uplink could not be established.";
                const status = err.response?.status ? ` (Status: ${err.response.status})` : "";
                setError(`${message}${status}. Please verify your connection.`);
                setLoading(false);
            }
        }
    }, [id, selectedClause, retryCount]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        // Initial fetch or retry fetch
        if (id) {
            const timer = setTimeout(fetchData, retryCount > 0 ? 1500 * retryCount : 0);
            return () => clearTimeout(timer);
        }
    }, [id, user, authLoading, router, fetchData, retryCount]);

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
                <AIPresence status="analyzing" className="scale-125 md:scale-150 mb-12" />
                <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-4 tracking-tight">Engaging Intelligence</h2>
                <p className="text-muted-foreground/40 text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase max-w-[280px] md:max-w-sm text-center leading-loose">
                    Mapping legal architecture and calculating liability surfaces. 256-bit isolation maintained.
                </p>
            </div>
        );
    }

    if (error || data?.status === 'FAILED') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm p-12 max-w-md text-center shadow-lg shadow-black/5">
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
        <main className="min-h-screen pt-[40px] md:pt-28 pb-12 px-0 md:px-6 lg:px-12 bg-background relative overflow-hidden">
            {/* Mobile UI */}
            <div className="md:hidden no-print">
                <MobileDashboard 
                    data={data} 
                    onExport={handleExport}
                    onCopyNegotiation={copyNegotiation}
                />
            </div>

            {/* Desktop UI */}
            <div className="hidden md:block max-w-[1600px] mx-auto z-10 relative">
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
                            className="bg-white/40 dark:bg-card/60 border-black/5 dark:border-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-muted/80 text-muted-foreground rounded-sm h-12 px-6 font-mono text-[10px] tracking-widest uppercase transition-all"
                        >
                            <Printer className="mr-3 h-4 w-4" /> Export Audit
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
                            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm p-12 flex flex-col items-center text-center relative overflow-hidden group shadow-lg shadow-black/5 dark:shadow-black/40"
                        >
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                            <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-muted-foreground/60 uppercase mb-10">Architectural Risk Score</h3>

                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Outer Ring Effect */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border border-dashed border-gold/10"
                                />

                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-black/5 dark:text-white/5" />
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
                                    <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground/60 uppercase mt-4">Security Level</span>
                                </div>
                            </div>

                            <div className="mt-12 w-full pt-8 border-t border-black/5 dark:border-white/5">
                                <p className="text-foreground font-serif text-xl mb-2">
                                    {(data.riskScore || 0) > 60 ? "Elevated Exposure" : "Standard Exposure"}
                                </p>
                                <p className="text-muted-foreground/70 text-xs font-mono tracking-wide leading-relaxed">
                                    AI IDENTIFIED {data.clauses.length} ANOMALIES REQUIRING PROFESSIONAL SCRUTINY.
                                </p>
                            </div>
                        </motion.div>

                        {/* Clause List */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-muted-foreground/60 uppercase ml-4">Identified Clauses</h3>
                            <div className="no-print">
                                <AnimatedList 
                                    items={data.clauses}
                                    displayScrollbar={false}
                                    showGradients={true}
                                    onItemSelect={(clause: any) => setSelectedClause(clause)}
                                    renderItem={(clause: any, index: number, isSelected: boolean) => (
                                        <button
                                            className={`w-full text-left p-6 rounded-2xl transition-all border duration-500 group
                                                ${isSelected
                                                    ? `bg-gold/5 ${getRiskBorder(clause.riskLevel)} glow-gold shadow-lg`
                                                    : 'bg-transparent border-black/10 dark:border-white/10 hover:border-gold/20 hover:bg-gold/[0.02]'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[9px] font-mono font-bold tracking-[0.1em] uppercase py-1 ${getRiskColor(clause.riskLevel)}`}>
                                                    {clause.riskLevel} SEVERITY
                                                </span>
                                                {isSelected && (
                                                    <div className="w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(200,169,106,1)]" />
                                                )}
                                            </div>
                                            <h4 className="text-foreground font-serif text-lg mb-2 flex items-center justify-between">
                                                {clause.clauseType}
                                                <ChevronRight className={`h-4 w-4 transition-transform text-gold/30 ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                            </h4>
                                            <p className="text-muted-foreground/60 font-mono text-[10px] truncate uppercase tracking-tight italic">"{clause.originalText.slice(0, 50)}..."</p>
                                        </button>
                                    )}
                                />
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
                                    className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 p-14 rounded-sm flex-1 relative overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/40"
                                >
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className={`w-16 h-16 rounded-sm flex items-center justify-center bg-gold/5 border border-gold/20 shadow-xl shadow-gold/5`}>
                                            <Zap className={`h-8 w-8 ${getRiskColor(selectedClause.riskLevel)}`} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">{selectedClause.clauseType}</h2>
                                            <p className="text-muted-foreground/60 font-mono text-[9px] tracking-[0.2em] uppercase mt-1">N.E.A.T Inspection Protocol Output</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12">
                                        <div className="space-y-8">
                                            <section>
                                                <h4 className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground/60 uppercase mb-5 flex items-center gap-2">
                                                    <FileIcon className="h-3 w-3 text-gold/50" /> Original Forensic Text
                                                </h4>
                                                <div className="bg-transparent p-10 rounded-sm border border-black/10 dark:border-white/10 font-serif text-muted-foreground text-lg leading-relaxed italic border-l-2 border-l-gold/30 shadow-inner">
                                                    "{selectedClause.originalText}"
                                                </div>
                                            </section>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <section className="bg-gold/5 p-10 rounded-sm border border-gold/10 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                                        <Check className="h-32 w-32 text-gold" />
                                                    </div>
                                                    <h4 className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase mb-6 flex items-center gap-2">
                                                        Simplification
                                                    </h4>
                                                    <p className="text-foreground text-xl font-serif font-light leading-relaxed">
                                                        {selectedClause.simplifiedText || "DECRYPTING INFLECTION..."}
                                                    </p>
                                                </section>

                                                <div className="flex flex-col gap-4">
                                                    <div className="bg-transparent p-6 rounded-sm border border-black/10 dark:border-white/10">
                                                        <span className="text-[9px] font-mono tracking-widest text-muted-foreground/60 uppercase block mb-2">Confidence Level</span>
                                                        <span className="text-2xl font-serif text-foreground">99.782%</span>
                                                    </div>
                                                    <div className="bg-transparent p-6 rounded-sm border border-black/10 dark:border-white/10">
                                                        <span className="text-[9px] font-mono tracking-widest text-muted-foreground/60 uppercase block mb-2">Precedent Match</span>
                                                        <span className="text-2xl font-serif text-foreground italic">High-Fidelity</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm flex-1 flex flex-col items-center justify-center text-center p-20 border-dashed border-black/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20">
                                    <AIPresence status="idle" className="mb-10 opacity-20" />
                                    <p className="text-muted-foreground/60 font-mono tracking-[0.4em] uppercase text-[10px]">Awaiting forensic focus</p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Negotiation Strategy */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 p-12 rounded-sm relative overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/40"
                        >
                            <div className="flex items-center justify-between mb-10 no-print">
                                <div>
                                    <h3 className="text-2xl font-serif font-light text-foreground mb-1">Negotiation Strategy</h3>
                                    <p className="text-muted-foreground/60 font-mono text-[9px] tracking-[0.2em] uppercase">Tactical response blueprint</p>
                                </div>
                                <Button
                                    onClick={copyNegotiation}
                                    className="bg-gold/10 hover:bg-gold/20 text-gold rounded-sm gap-3 border border-gold/30 font-mono text-[9px] tracking-widest uppercase h-11 px-6 transition-all"
                                >
                                    <Copy className="h-3.5 w-3.5" /> Initialize Protocol
                                </Button>
                            </div>
                            <div className="bg-muted/50 p-1 rounded-sm border border-black/10 dark:border-white/5">
                                <pre className="whitespace-pre-wrap font-serif text-muted-foreground p-10 text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar italic tracking-wide">
                                    {data.negotiationMsg || "STRATEGY OPTIMIZATION IN PROGRESS..."}
                                </pre>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </div>

            {/* ===== PRINT-ONLY AUDIT REPORT (hidden on screen) ===== */}
            <div className="print-report">
                {/* Report Header */}
                <div className="pr-header">
                    <div className="pr-header-left">
                        <div className="flex items-center gap-3">
                            <BarristerLogo className="h-12 w-12 text-foreground" />
                            <BarristerTextLogo />
                        </div>
                        <div className="pr-subtitle">Confidential Legal Intelligence Report</div>
                    </div>
                    <div className="pr-header-right">
                        <div className="pr-meta-line">Vault ID: {String(data.id).slice(0, 8).toUpperCase()}</div>
                        <div className="pr-meta-line">Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        <div className="pr-meta-line">Status: COMPLETED</div>
                    </div>
                </div>
                <div className="pr-rule" />

                {/* Document Title & Risk Overview */}
                <div className="pr-section">
                    <h1 className="pr-doc-title">{data.title}</h1>
                    <div className="pr-risk-overview">
                        <div className="pr-risk-score-block">
                            <div className="pr-risk-number" style={{ color: (data.riskScore || 0) > 60 ? '#dc2626' : '#b45309' }}>
                                {Math.round(data.riskScore || 0)}<span className="pr-risk-max">/100</span>
                            </div>
                            <div className="pr-risk-label">COMPOSITE RISK INDEX</div>
                            <div className="pr-risk-verdict" style={{ color: (data.riskScore || 0) > 60 ? '#dc2626' : '#78350f' }}>
                                {(data.riskScore || 0) > 60 ? '⚠ Elevated Legal Exposure' : '✓ Standard Legal Exposure'}
                            </div>
                        </div>
                        <div className="pr-risk-stats">
                            <div className="pr-stat-item">
                                <span className="pr-stat-num">{data.clauses.length}</span>
                                <span className="pr-stat-desc">Total Clauses Identified</span>
                            </div>
                            <div className="pr-stat-item">
                                <span className="pr-stat-num" style={{ color: '#dc2626' }}>
                                    {data.clauses.filter(c => c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH').length}
                                </span>
                                <span className="pr-stat-desc">High-Risk Clauses</span>
                            </div>
                            <div className="pr-stat-item">
                                <span className="pr-stat-num" style={{ color: '#b45309' }}>
                                    {data.clauses.filter(c => c.riskLevel === 'MEDIUM').length}
                                </span>
                                <span className="pr-stat-desc">Medium-Risk Clauses</span>
                            </div>
                            <div className="pr-stat-item">
                                <span className="pr-stat-num" style={{ color: '#15803d' }}>
                                    {data.clauses.filter(c => c.riskLevel === 'LOW').length}
                                </span>
                                <span className="pr-stat-desc">Low-Risk Clauses</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pr-rule" />

                {/* Identified Clauses */}
                <div className="pr-section">
                    <h2 className="pr-section-title">IDENTIFIED CLAUSES &amp; RISK ANALYSIS</h2>
                    {data.clauses.map((clause, idx) => {
                        const riskColor = clause.riskLevel === 'CRITICAL' ? '#dc2626'
                            : clause.riskLevel === 'HIGH' ? '#ea580c'
                            : clause.riskLevel === 'MEDIUM' ? '#b45309'
                            : '#15803d';
                        return (
                            <div key={clause.id} className="pr-clause">
                                <div className="pr-clause-header">
                                    <div className="pr-clause-index">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="pr-clause-meta">
                                        <div className="pr-clause-type">{clause.clauseType}</div>
                                        <div className="pr-clause-badges">
                                            <span className="pr-badge" style={{ color: riskColor, borderColor: riskColor }}>
                                                {clause.riskLevel} RISK
                                            </span>
                                            <span className="pr-badge-score" style={{ color: riskColor }}>
                                                Severity Score: {Math.round(clause.severityScore * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pr-severity-bar-wrap">
                                        <div className="pr-severity-bar-bg">
                                            <div className="pr-severity-bar-fill" style={{ width: `${Math.round(clause.severityScore * 100)}%`, backgroundColor: riskColor }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-clause-original">
                                    <div className="pr-field-label">ORIGINAL TEXT</div>
                                    <div className="pr-field-text-quote">&ldquo;{clause.originalText}&rdquo;</div>
                                </div>
                                {clause.simplifiedText && (
                                    <div className="pr-clause-simplified">
                                        <div className="pr-field-label" style={{ color: '#b45309' }}>PLAIN ENGLISH EXPLANATION</div>
                                        <div className="pr-field-text">{clause.simplifiedText}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="pr-rule" />

                {/* Negotiation Strategy */}
                {data.negotiationMsg && (
                    <div className="pr-section pr-atomic">
                        <h2 className="pr-section-title">NEGOTIATION STRATEGY &amp; RECOMMENDED ACTIONS</h2>
                        <div className="pr-negotiation">
                            <pre className="pr-negotiation-text">{data.negotiationMsg}</pre>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="pr-footer">
                    <div>This report was generated by Barrister AI. All analysis is AI-assisted and should be reviewed by a qualified legal professional before any action is taken.</div>
                    <div>&copy; {new Date().getFullYear()} Barrister AI &mdash; Confidential</div>
                </div>
            </div>

            {/* Print CSS */}
            <style jsx global>{`
                .print-report { display: none; }

                @media print {
                    nav, header, .no-print { display: none !important; }
                    body { background: white !important; color: #111 !important; margin: 0; padding: 0; font-family: Georgia, serif; }
                    main { padding: 0 !important; background: white !important; }
                    main > *:not(.print-report) { display: none !important; }
                    .print-report { display: block !important; padding: 40px 48px; }

                    .pr-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
                    .pr-logo { font-size: 22px; font-weight: 700; letter-spacing: 0.05em; color: #111; }
                    .pr-subtitle { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #777; margin-top: 4px; }
                    .pr-header-right { text-align: right; }
                    .pr-meta-line { font-size: 9px; font-family: 'Courier New', monospace; color: #777; letter-spacing: 0.08em; line-height: 1.8; text-transform: uppercase; }
                    .pr-rule { border: none; border-top: 1px solid #d4b896; margin: 20px 0; }
                    .pr-section { margin-bottom: 24px; }
                    .pr-atomic { page-break-inside: avoid; }
                    .pr-doc-title { font-size: 28px; font-weight: 300; letter-spacing: -0.02em; color: #111; margin: 0 0 20px 0; }

                    .pr-risk-overview { display: flex; gap: 32px; align-items: flex-start; }
                    .pr-risk-score-block { border: 2px solid #d4b896; padding: 16px 24px; text-align: center; min-width: 140px; }
                    .pr-risk-number { font-size: 52px; font-weight: 300; line-height: 1; letter-spacing: -0.03em; }
                    .pr-risk-max { font-size: 20px; color: #aaa; }
                    .pr-risk-label { font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-top: 4px; font-family: 'Courier New', monospace; }
                    .pr-risk-verdict { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; margin-top: 8px; }
                    .pr-risk-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
                    .pr-stat-item { border-left: 3px solid #d4b896; padding-left: 12px; }
                    .pr-stat-num { display: block; font-size: 26px; font-weight: 300; color: #111; line-height: 1; }
                    .pr-stat-desc { display: block; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #777; margin-top: 3px; font-family: 'Courier New', monospace; }

                    .pr-section-title { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #b45309; font-family: 'Courier New', monospace; margin: 0 0 16px 0; font-weight: 700; }

                    .pr-clause { border: 1px solid #e5d5c0; margin-bottom: 16px; page-break-inside: avoid; }
                    .pr-clause-header { display: flex; align-items: center; gap: 16px; background: #faf7f3; padding: 12px 16px; border-bottom: 1px solid #e5d5c0; }
                    .pr-clause-index { font-size: 22px; font-weight: 300; color: #ccc; min-width: 36px; font-family: 'Courier New', monospace; }
                    .pr-clause-meta { flex: 1; }
                    .pr-clause-type { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
                    .pr-clause-badges { display: flex; align-items: center; gap: 12px; }
                    .pr-badge { font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; font-family: 'Courier New', monospace; font-weight: 700; border: 1px solid; padding: 2px 7px; }
                    .pr-badge-score { font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.05em; color: #555; }
                    .pr-severity-bar-wrap { min-width: 100px; }
                    .pr-severity-bar-bg { height: 6px; background: #e5d5c0; border-radius: 3px; overflow: hidden; }
                    .pr-severity-bar-fill { height: 100%; border-radius: 3px; }

                    .pr-clause-original, .pr-clause-simplified { padding: 12px 16px; }
                    .pr-clause-simplified { background: #fffbf5; border-top: 1px solid #e5d5c0; }
                    .pr-field-label { font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; font-family: 'Courier New', monospace; margin-bottom: 6px; font-weight: 700; }
                    .pr-field-text-quote { font-size: 11px; color: #444; line-height: 1.65; font-style: italic; }
                    .pr-field-text { font-size: 12px; color: #333; line-height: 1.65; font-weight: 500; }

                    .pr-negotiation { border: 1px solid #d4b896; background: #faf7f3; padding: 20px 24px; }
                    .pr-negotiation-text { font-family: Georgia, serif; font-size: 11px; line-height: 1.8; color: #333; white-space: pre-wrap; margin: 0; }

                    .pr-footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5d5c0; font-size: 8px; color: #aaa; font-family: 'Courier New', monospace; letter-spacing: 0.05em; text-align: center; line-height: 1.6; }
                }
            `}</style>
        </main>
    );
}

