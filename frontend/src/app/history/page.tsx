"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Analysis History</h1>
                <Link href="/upload">
                    <Button variant="outline" className="gap-2">
                        New Document
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {history.length > 0 ? (
                    history.map((doc, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={doc.id}
                            className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <FileText className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                                    <p className="text-sm text-zinc-400">Analyzed on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                    {doc.status === "COMPLETED" ? (
                                        <>
                                            <span className={`text-xl font-bold ${(doc.riskScore || 0) > 60 ? "text-red-400" : (doc.riskScore || 0) > 30 ? "text-yellow-400" : "text-emerald-400"
                                                }`}>
                                                {Math.round(doc.riskScore || 0)}
                                            </span>
                                            <span className="text-sm text-zinc-500 ml-1">/100</span>
                                            <p className="text-xs text-zinc-400">Risk Score</p>
                                        </>
                                    ) : (
                                        <span className="text-xs uppercase tracking-widest text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                                            {doc.status}
                                        </span>
                                    )}
                                </div>
                                <Link href={`/dashboard/${doc.id}`}>
                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white/10">
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
                        <p className="text-zinc-500">No documents analyzed yet.</p>
                        <Link href="/upload" className="mt-4 inline-block">
                            <Button variant="link" className="text-blue-500">Upload your first agreement</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
