"use client";

import { motion } from "framer-motion";
import { Copy, AlertTriangle, Info, MessageSquare, Download, CheckCircle2, File as FileIcon, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
    const [activeTab, setActiveTab] = useState("overview");
    const { id } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (id) {
            fetchData();
        }
    }, [id, user, authLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/documents/${id}`);
            setData(response.data);

            // If still processing, poll again in 5 seconds
            if (response.data.status === "PROCESSING") {
                setTimeout(fetchData, 5000);
            }
        } catch (error) {
            console.error("Failed to fetch document:", error);
            toast({
                title: "Error",
                description: "Failed to load document analysis.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (data?.negotiationMsg) {
            navigator.clipboard.writeText(data.negotiationMsg);
            toast({
                title: "Copied to clipboard",
                description: "You can now paste this message into WhatsApp or Email.",
            });
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 30) return "text-emerald-400";
        if (score < 60) return "text-yellow-400";
        return "text-red-400";
    };

    if (authLoading || (loading && !data)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
                    <div className="text-zinc-400 flex items-center gap-3">
                        {data.status === "COMPLETED" ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                Analysis Complete
                            </span>
                        ) : data.status === "PROCESSING" ? (
                            <span className="flex items-center gap-2 text-blue-400">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                AI is analyzing...
                            </span>
                        ) : (
                            <span className="text-red-400">Analysis Failed</span>
                        )}
                        <span className="text-zinc-600">•</span>
                        <span>ID: {data.id}</span>
                    </div>
                </div>
                <Button variant="outline" className="gap-2" disabled={data.status !== "COMPLETED"}>
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {data.status === "COMPLETED" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Score Card */}
                    <Card className="p-8 lg:col-span-1 bg-white/[0.02] border-white/10 flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-medium text-zinc-400 mb-6">Overall Risk Score</h3>
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="96" cy="96" r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray="502"
                                    strokeDashoffset={502 - (502 * (data.riskScore || 0)) / 100}
                                    className={`${getScoreColor(data.riskScore || 0)} transition-all duration-1000 ease-in-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-6xl font-black ${getScoreColor(data.riskScore || 0)}`}>
                                    {Math.round(data.riskScore || 0)}
                                </span>
                                <span className="text-sm font-medium text-zinc-500 mt-1">out of 100</span>
                            </div>
                        </div>
                        <p className="mt-6 text-zinc-300">
                            {(data.riskScore || 0) > 60 ? "High risk detected. Proceed with caution and consider negotiating." : "Generally safe, but review highlighted terms."}
                        </p>
                    </Card>

                    {/* Details Tabs */}
                    <Card className="lg:col-span-2 bg-white/[0.02] border-white/10 p-0 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                            <div className="px-6 pt-6 pb-2 border-b border-white/10">
                                <TabsList className="bg-white/5 border border-white/10 p-1 w-full sm:w-auto h-12">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 px-6">Risky Clauses</TabsTrigger>
                                    <TabsTrigger value="negotiate" className="data-[state=active]:bg-blue-600 px-6">Negotiation Message</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                                <TabsContent value="overview" className="mt-0 space-y-6">
                                    {data.clauses.map((clause, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={clause.id}
                                            className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden"
                                        >
                                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-xs font-bold
                        ${clause.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                                    clause.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-yellow-500/20 text-yellow-400'}
                      `}>
                                                {clause.riskLevel} RISK
                                            </div>

                                            <div className="flex items-center gap-3 mb-4">
                                                <AlertTriangle className={`h-5 w-5 ${clause.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`} />
                                                <h4 className="text-lg font-semibold">{clause.clauseType}</h4>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-500 mb-2 flex items-center gap-1">
                                                        <FileIcon className="h-4 w-4" /> Original Legal Text
                                                    </p>
                                                    <p className="text-zinc-300 text-sm italic border-l-2 border-white/10 pl-3 py-1">
                                                        "{clause.originalText}"
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                                    <p className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-1">
                                                        <Info className="h-4 w-4" /> Simple Explanation
                                                    </p>
                                                    <p className="text-blue-100 text-sm">
                                                        {clause.simplifiedText || "Simplifying..."}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {data.clauses.length === 0 && (
                                        <p className="text-center py-10 text-zinc-500">No risky clauses detected.</p>
                                    )}
                                </TabsContent>

                                <TabsContent value="negotiate" className="mt-0 h-full">
                                    <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5 text-blue-400" />
                                                Suggested Message
                                            </h3>
                                            <Button variant="secondary" size="sm" onClick={copyToClipboard} className="gap-2">
                                                <Copy className="h-4 w-4" />
                                                Copy to Clipboard
                                            </Button>
                                        </div>
                                        <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl">
                                            <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed text-sm">
                                                {data.negotiationMsg || "Generating message..."}
                                            </pre>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <RefreshCw className="h-16 w-16 text-blue-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Analyzing your document...</h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        Our legal transformer models are scanning your agreement for hidden risks. This usually takes 30-60 seconds.
                    </p>
                </div>
            )}
        </div>
    );
}
