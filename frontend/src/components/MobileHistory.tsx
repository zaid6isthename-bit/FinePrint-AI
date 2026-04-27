"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, Calendar, Shield, Clock, ArrowLeft, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GlassEffect, GlassFilter } from "@/components/ui/liquid-glass";

interface DocHistory {
    id: string;
    title: string;
    uploadDate: string;
    riskScore: number | null;
    status: string;
}

interface MobileHistoryProps {
    history: DocHistory[];
    loading: boolean;
    onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function MobileHistory({ history, loading, onDelete }: MobileHistoryProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans pt-12 pb-24 px-6 md:hidden overflow-x-hidden">
            <GlassFilter />
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <Link href="/" className="p-2 -ml-2 text-gold/60">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <span className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase opacity-60">
                    Vault History
                </span>
                <button className="p-2 -mr-2 text-gold/60">
                    <Search className="h-5 w-5" />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-serif font-light mb-3 leading-tight">
                    Secure <br />
                    <span className="italic text-gold">Archives.</span>
                </h1>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Historical audits preserved in cryptographic isolation.
                </p>
            </motion.div>

            {/* List */}
            <div className="flex-1 space-y-6">
                {history.length > 0 ? (
                    history.map((doc, idx) => (
                        <GlassEffect 
                            key={doc.id}
                            className="bg-card/20 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg shadow-black/5"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-5"
                            >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-serif text-lg text-foreground line-clamp-1">{doc.title}</h3>
                                    <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest mt-1">
                                        {new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                {doc.riskScore !== null && (
                                    <div className="text-right">
                                        <span className={`text-2xl font-serif ${doc.riskScore > 60 ? 'text-red-400' : doc.riskScore > 30 ? 'text-gold' : 'text-emerald-400'}`}>
                                            {Math.round(doc.riskScore)}
                                        </span>
                                        <span className="text-[8px] font-mono block text-muted-foreground/40 -mt-1">INDEX</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <span className={`flex items-center gap-1.5 text-[8px] font-mono tracking-widest uppercase ${doc.status === 'COMPLETED' ? 'text-emerald-500/60' : 'text-gold/60'}`}>
                                        {doc.status === 'COMPLETED' ? <Shield className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                                        {doc.status === 'COMPLETED' ? 'Validated' : 'Queued'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={(e) => onDelete(e, doc.id)}
                                        className="text-red-400/60 hover:text-red-400 p-1 transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                    <Link href={`/dashboard/${doc.id}`} className="text-gold flex items-center gap-1">
                                        <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Inquiry</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                            </motion.div>
                        </GlassEffect>
                    ))
                ) : (
                    !loading && (
                        <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/5 opacity-50">
                            <p className="font-mono text-[9px] tracking-widest uppercase">Archive Void</p>
                        </div>
                    )
                )}
                {loading && (
                    <div className="h-20 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-gold" />
                    </div>
                )}
            </div>

            {/* Bottom Nav Spacer */}
            <div className="h-12" />
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={` animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
}
