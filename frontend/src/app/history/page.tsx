"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HISTORY = [
    { id: "demo-id", title: "Startup Employment Contract", date: "2026-02-25", score: 68.5 },
    { id: "doc-2", title: "Gym Membership Agmt", date: "2026-02-20", score: 25.0 },
    { id: "doc-3", title: "Apartment Rental Lease", date: "2026-02-15", score: 45.2 },
];

export default function HistoryPage() {
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
                {HISTORY.map((doc, idx) => (
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
                                <p className="text-sm text-zinc-400">Analyzed on {doc.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right hidden sm:block">
                                <span className={`text-xl font-bold ${doc.score > 60 ? "text-red-400" : doc.score > 30 ? "text-yellow-400" : "text-emerald-400"
                                    }`}>
                                    {doc.score}
                                </span>
                                <span className="text-sm text-zinc-500 ml-1">/100</span>
                                <p className="text-xs text-zinc-400">Risk Score</p>
                            </div>
                            <Link href={`/dashboard/${doc.id}`}>
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white/10">
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
