"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, Calendar, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AIPresence } from "@/components/AIPresence";
import api from "@/lib/api";

interface DocHistory {
    id: string;
    title: string;
    uploadDate: string;
    riskScore: number | null;
    status: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<DocHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
            return;
        }
        if (isAuthenticated && user) {
            fetchHistory();
        }
    }, [user, authLoading, isAuthenticated, router]);

    const fetchHistory = async () => {
        try {
            const response = await api.get("/documents/history");
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <AIPresence status="analyzing" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 lg:px-24 bg-transparent relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full animate-brain-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <div className="max-w-6xl mx-auto z-10 relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 no-print">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6 backdrop-blur-md">
                            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-gold uppercase">Secure Archive</span>
                        </div>
                        <h1 className="text-5xl font-serif font-light tracking-tight text-foreground mb-4">Document Vault</h1>
                        <p className="text-muted-foreground/60 font-serif italic text-lg max-w-xl">
                            Access your full history of neural architectural audits and confidential risk profile reports.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <Link href="/upload">
                            <Button className="bg-gold/15 hover:bg-gold/25 text-gold rounded-sm h-14 px-10 border border-gold/30 font-mono text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-gold/5 glow-gold">
                                New Analysis Scan
                            </Button>
                        </Link>
                    </motion.div>
                </header>

                <div className="space-y-4">
                    {history.length > 0 ? (
                        history.map((doc, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
                                key={doc.id}
                                className="group relative flex items-center justify-between p-8 rounded-sm glass-pane bg-white/[0.02] border-white/5 hover:border-gold/30 hover:bg-gold/[0.03] transition-all duration-700 overflow-hidden shadow-xl shadow-black/40"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-14 h-14 rounded-sm bg-midnight/40 border border-white/5 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all duration-700 shadow-inner">
                                        <FileText className="h-6 w-6 text-zinc-500 group-hover:text-gold transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-normal text-foreground tracking-tight mb-2">{doc.title}</h3>
                                        <div className="flex items-center gap-6">
                                            <span className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-zinc-600 uppercase">
                                                <Calendar className="h-3 w-3 opacity-50" />
                                                {new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase">
                                                {doc.status === 'COMPLETED' ? (
                                                    <span className="flex items-center gap-2 text-emerald-500/60">
                                                        <Shield className="h-3 w-3" />
                                                        Analyzed
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-gold/60">
                                                        <Clock className="h-3 w-3" />
                                                        In Progress
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 relative z-10">
                                    <div className="text-right hidden sm:block">
                                        {doc.status === "COMPLETED" ? (
                                            <div>
                                                <div className="flex items-baseline justify-end">
                                                    <span className={`text-4xl font-serif font-light tracking-tighter ${(doc.riskScore || 0) > 60 ? "text-red-400" : (doc.riskScore || 0) > 30 ? "text-gold" : "text-emerald-400"
                                                        }`}>
                                                        {Math.round(doc.riskScore || 0)}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold text-zinc-600 ml-2 uppercase tracking-[0.3em]">Score</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-5 py-2 rounded-sm border border-gold/20 bg-gold/5">
                                                <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-widest">
                                                    Processing...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/dashboard/${doc.id}`}>
                                        <Button variant="ghost" className="h-14 w-14 p-0 rounded-sm hover:bg-gold/10 text-zinc-600 hover:text-gold border border-white/5 hover:border-gold/30 group-hover:translate-x-1 transition-all duration-500">
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 rounded-sm glass-pane border-dashed border-white/10"
                        >
                            <AIPresence status="idle" className="mb-10 opacity-10 mx-auto" />
                            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">The vault is currently empty</p>
                            <Link href="/upload">
                                <Button className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-sm px-12 h-14 font-mono text-[10px] tracking-widest uppercase transition-all duration-700">
                                    Initiate First Scan
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
