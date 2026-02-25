"use client";

import { motion } from "framer-motion";
import { Copy, AlertTriangle, Info, MessageSquare, Download, CheckCircle2, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Demo data - to be replaced by API
const DEMO_DATA = {
    id: "doc-123",
    title: "Startup Employment Contract",
    riskScore: 68.5,
    clauses: [
        {
            id: "cl-1",
            clauseType: "Termination Clauses",
            riskLevel: "HIGH",
            severityScore: 0.7,
            originalText: "The Employer reserves the right to terminate this agreement at any time, with or without cause, without any prior notice.",
            simplifiedText: "They can fire you at any time without a reason and without warning."
        },
        {
            id: "cl-2",
            clauseType: "Data Sharing Consent",
            riskLevel: "CRITICAL",
            severityScore: 0.9,
            originalText: "By signing this, employee agrees to allow Employer to distribute personal metrics and usage data to third-party affiliates for evaluation and marketing purposes indefinitely.",
            simplifiedText: "They can share your personal data with other companies forever."
        },
        {
            id: "cl-3",
            clauseType: "Arbitration Clauses",
            riskLevel: "MEDIUM",
            severityScore: 0.4,
            originalText: "Any dispute arising from this contract shall be exclusively resolved through binding arbitration in the state of Delaware.",
            simplifiedText: "If you want to sue them, you can't go to normal court; you have to go to private arbitration in Delaware."
        }
    ],
    negotiationMsg: "Hi there,\n\nI reviewed the contract and have a few concerns, mostly around these points:\n\n- Regarding 'Termination Clauses': They can fire you at any time without a reason and without warning.\n- Regarding 'Data Sharing Consent': They can share your personal data with other companies forever.\n\nCould we please discuss modifying these sections? Let me know your thoughts.\n\nThanks!"
};

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(DEMO_DATA.negotiationMsg);
        toast({
            title: "Copied to clipboard",
            description: "You can now paste this message into WhatsApp or Email.",
        });
    };

    const getScoreColor = (score: number) => {
        if (score < 30) return "text-emerald-400";
        if (score < 60) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{DEMO_DATA.title}</h1>
                    <p className="text-zinc-400 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Analysis Complete • ID: {DEMO_DATA.id}
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Score Card */}
                <Card className="p-8 lg:col-span-1 bg-white/[0.02] border-white/10 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium text-zinc-400 mb-6">Overall Risk Score</h3>
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Simple CSS circle for demo */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                            <circle
                                cx="96" cy="96" r="80"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray="502"
                                strokeDashoffset={502 - (502 * DEMO_DATA.riskScore) / 100}
                                className={`${getScoreColor(DEMO_DATA.riskScore)} transition-all duration-1000 ease-in-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className={`text-6xl font-black ${getScoreColor(DEMO_DATA.riskScore)}`}>
                                {Math.round(DEMO_DATA.riskScore)}
                            </span>
                            <span className="text-sm font-medium text-zinc-500 mt-1">out of 100</span>
                        </div>
                    </div>
                    <p className="mt-6 text-zinc-300">
                        {DEMO_DATA.riskScore > 60 ? "High risk detected. Proceed with caution and consider negotiating." : "Generally safe, but review highlighted terms."}
                    </p>
                </Card>

                {/* Details Tabs */}
                <Card className="lg:col-span-2 bg-white/[0.02] border-white/10 border-0 p-0 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                        <div className="px-6 pt-6 pb-2 border-b border-white/10">
                            <TabsList className="bg-white/5 border border-white/10 p-1 w-full sm:w-auto h-12">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 px-6">Risky Clauses</TabsTrigger>
                                <TabsTrigger value="negotiate" className="data-[state=active]:bg-blue-600 px-6">Negotiation Message</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                            <TabsContent value="overview" className="mt-0 space-y-6">
                                {DEMO_DATA.clauses.map((clause, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={clause.id}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden"
                                    >
                                        {/* Risk Badge */}
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
                                                    {clause.simplifiedText}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
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
                                            {DEMO_DATA.negotiationMsg}
                                        </pre>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
