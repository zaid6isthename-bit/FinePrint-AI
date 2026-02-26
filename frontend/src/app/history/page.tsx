"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2, Calendar, Shield, Clock } from "lucide-react";
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
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user) {
            fetchHistory();
        }
    }, [user, authLoading, router]);

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

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <AIPresence status="analyzing" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-12 px-6 lg:px-12 bg-background relative overflow-hidden">
            {/* Background Calm Atmosphere */}
            <div className="absolute top-0 inset-x-0 h-screen pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto z-10 relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">Document Vault</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-light">Access your full history of legal architectural audits and risk profile reports.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link href="/upload">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
                                New Analysis Scan
                            </Button>
                        </Link>
                    </motion.div>
                </header>

                <div className="grid gap-4">
                    {history.length > 0 ? (
                        history.map((doc, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                                key={doc.id}
                                className="group relative flex items-center justify-between p-6 rounded-2xl glass-pane border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 bg-zinc-50/50 dark:bg-white/[0.04] transition-all duration-500"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-3.5 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                        <FileText className="h-6 w-6 text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-foreground tracking-tight">{doc.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-light">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-zinc-700">•</span>
                                            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-light capitalize">
                                                {doc.status === 'COMPLETED' ? <Shield className="h-3 w-3 text-emerald-500/50" /> : <Clock className="h-3 w-3 text-primary/50" />}
                                                {doc.status.toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right hidden sm:block">
                                        {doc.status === "COMPLETED" ? (
                                            <div>
                                                <div className="flex items-baseline justify-end">
                                                    <span className={`text-2xl font-bold tracking-tighter ${(doc.riskScore || 0) > 60 ? "text-red-400" : (doc.riskScore || 0) > 30 ? "text-amber-400" : "text-primary"
                                                        }`}>
                                                        {Math.round(doc.riskScore || 0)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-zinc-600 ml-1 uppercase tracking-widest">/ 100</span>
                                                </div>
                                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-0.5">Risk Intensity</p>
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 rounded-full border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/5">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                                                    In Queue
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/dashboard/${doc.id}`}>
                                        <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 group-hover:translate-x-1 transition-all">
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
                            className="text-center py-32 rounded-3xl glass-pane border-dashed border-white/10"
                        >
                            <div className="flex flex-col items-center">
                                <AIPresence status="idle" className="mb-6 opacity-30" />
                                <p className="text-zinc-500 font-light text-lg mb-8">Your vault is currently empty.</p>
                                <Link href="/upload">
                                    <Button variant="outline" className="glass-pane border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 px-8 h-12 rounded-xl text-zinc-600 dark:text-zinc-300">
                                        Scan First Agreement
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
