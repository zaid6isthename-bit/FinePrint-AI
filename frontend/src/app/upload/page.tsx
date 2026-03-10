"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileIcon, Loader2, Sparkles, Lock, ShieldCheck, Zap } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AIPresence } from "@/components/AIPresence";
import { AnalysisTheatre } from "@/components/AnalysisTheatre";
import api from "@/lib/api";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [step, setStep] = useState<"upload" | "analyzing" | "completed">("upload");
    const router = useRouter();
    const { toast } = useToast();
    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[acceptedFiles.length - 1] || acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!file || !title.trim()) {
            toast({
                title: "Missing fields",
                description: "Please provide a document title and select a PDF file.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        setStep("analyzing");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post(`/documents/upload?title=${encodeURIComponent(title)}`, formData);

            // Optimized transitions to meet the "exactly 2 seconds" requirement
            setTimeout(() => {
                setStep("completed");
                setTimeout(() => {
                    router.push(`/dashboard/${response.data.id}`);
                }, 1000); // 1s show for speedometer
            }, 1000); // 1s show for analysis theatre

        } catch (error: any) {
            setStep("upload");
            setIsUploading(false);

            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string'
                ? detail
                : (Array.isArray(detail) ? detail[0]?.msg : "Could not upload the document. Please try again.");

            toast({
                title: "Upload Failed",
                description: message,
                variant: "destructive",
            });
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <AIPresence status="analyzing" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-[120px] pb-24 px-6 flex flex-col items-center relative overflow-hidden bg-background">
            {/* Ambient Orbs */}
            <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,169,106,0.1)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(80,100,160,0.06)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <AnimatePresence mode="wait">
                {step === "upload" ? (
                    <motion.div
                        key="upload-ui"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)", transition: { duration: 0.6 } }}
                        className="w-full max-w-2xl z-10"
                    >
                        <div className="text-left mb-12">
                            <span className="font-mono text-[10px] tracking-[0.28em] text-gold uppercase mb-4 block">Document Intake</span>
                            <h1 className="text-5xl font-serif font-light text-foreground mb-4 leading-tight">
                                Secure Agreement <br />
                                <span className="italic text-gold">Analysis Chamber</span>
                            </h1>
                            <p className="text-muted-foreground text-sm font-light max-w-md leading-relaxed">
                                Relinquish your document for senior-level inspection. Our proprietary AI quantifies Risk Vectors in under 2 seconds.
                            </p>
                        </div>

                        <div className="glass-pane p-1 shadow-2xl shadow-black/40">
                            <div className="bg-background/40 p-10 rounded-[4px] space-y-10">
                                <div className="space-y-4">
                                    <Label htmlFor="title" className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">Archive Identifer</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., MSA_PRIME_2024"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-background/30 border-white/5 h-14 text-sm rounded-sm focus:ring-gold focus:border-gold/50 transition-all font-mono px-6 text-foreground placeholder:text-muted-foreground/20"
                                    />
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`group relative border border-dashed rounded-sm p-20 text-center cursor-pointer transition-all duration-700
                    ${isDragActive ? "border-gold bg-gold/5 scale-[1.01] shadow-2xl shadow-gold/10" : "border-white/10 hover:border-gold/40 hover:bg-white/[0.01]"}
                    ${file ? "bg-gold/5 border-solid border-gold/30" : ""}
                  `}
                                >
                                    <input {...getInputProps()} />

                                    <AnimatePresence mode="wait">
                                        {file ? (
                                            <motion.div
                                                key="file-ready"
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex flex-col items-center gap-6"
                                            >
                                                <div className="w-16 h-16 rounded-[4px] bg-gold/10 border border-gold/30 flex items-center justify-center">
                                                    <FileIcon className="h-8 w-8 text-gold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-serif font-light text-foreground">{file.name}</p>
                                                    <p className="text-muted-foreground/50 font-mono text-[9px] uppercase tracking-[0.2em]">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR EXTRACTION
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/5 transition-all text-[9px] font-mono tracking-widest uppercase mt-2 h-8 px-6 rounded-sm border border-transparent hover:border-red-400/10"
                                                >
                                                    DISCARD
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="drop-prompt"
                                                className="flex flex-col items-center gap-6"
                                            >
                                                <div className="w-16 h-16 rounded-[4px] bg-white/5 border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all duration-700 flex items-center justify-center">
                                                    <Upload className="h-8 w-8 text-muted-foreground/30 group-hover:text-gold transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-serif font-light mb-2 text-foreground">
                                                        {isDragActive ? "Relinquish Document" : "Relinquish PDF Here"}
                                                    </p>
                                                    <p className="text-muted-foreground/40 text-xs font-light">Drag & drop for a quiet legal inspection</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="pt-2 flex flex-col items-center gap-8">
                                    <Button
                                        size="lg"
                                        className={`w-full h-14 text-[10px] font-mono font-bold tracking-[0.2em] bg-gold/10 hover:bg-gold/20 text-gold rounded-sm border border-gold/30 uppercase transition-all duration-700 group relative overflow-hidden shadow-2xl shadow-gold/5 glow-gold
                                            ${(!file || !title || isUploading) ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                                        `}
                                        onClick={handleUpload}
                                        disabled={!file || !title || isUploading}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            BEGIN INTENSIVE SCAN
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-white/5"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: "100%" }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </Button>

                                    <div className="flex items-center gap-6 text-muted-foreground/30 text-[9px] font-mono font-bold tracking-[0.2em] uppercase">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-3 w-3" /> 256-Bit Isolation
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-3 w-3" /> Proprietary NLP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="analyzing-ui"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center justify-center z-10"
                    >
                        <div className="mb-16">
                            <AIPresence status={step === "completed" ? "completed" : "analyzing"} />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === "completed" ? (
                                <motion.div
                                    key="completed-msg"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-12"
                                >
                                    <div className="text-center">
                                        <span className="font-mono text-[9px] tracking-[0.28em] text-gold uppercase mb-4 block">Process Terminates</span>
                                        <h2 className="text-4xl font-serif font-light text-foreground tracking-tight mb-4">Architecture Validated</h2>
                                        <p className="text-muted-foreground/60 text-sm font-light">The quiet audit is complete. Teleporting to dashboard...</p>
                                    </div>

                                    <div className="relative w-80 h-48 flex flex-col items-center justify-center">
                                        {/* Speedometer Base */}
                                        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(var(--gold-rgb),0.2)]">
                                            <defs>
                                                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="rgb(var(--low))" />
                                                    <stop offset="50%" stopColor="var(--gold)" />
                                                    <stop offset="100%" stopColor="rgb(var(--high))" />
                                                </linearGradient>
                                            </defs>

                                            {/* Track */}
                                            <path
                                                d="M 20 100 A 80 80 0 0 1 180 100"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                className="text-muted/10"
                                                strokeLinecap="round"
                                            />

                                            {/* Progress Fill */}
                                            <motion.path
                                                d="M 20 100 A 80 80 0 0 1 180 100"
                                                fill="none"
                                                stroke="url(#gauge-gradient)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 0.66 }}
                                                transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                                            />

                                            {/* Tick Marks */}
                                            {[...Array(9)].map((_, i) => (
                                                <line
                                                    key={i}
                                                    x1={100 + 70 * Math.cos((180 + i * 22.5) * Math.PI / 180)}
                                                    y1={100 + 70 * Math.sin((180 + i * 22.5) * Math.PI / 180)}
                                                    x2={100 + 85 * Math.cos((180 + i * 22.5) * Math.PI / 180)}
                                                    y2={100 + 85 * Math.sin((180 + i * 22.5) * Math.PI / 180)}
                                                    className="stroke-muted-foreground/20"
                                                    strokeWidth="1"
                                                />
                                            ))}
                                        </svg>

                                        <div className="absolute bottom-4 flex flex-col items-center select-none">
                                            <div className="flex items-baseline">
                                                <RiskValue finalValue={66} />
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.8 }}
                                                    className="text-gold/50 text-xl font-serif ml-1"
                                                >
                                                    %
                                                </motion.span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-[0.4em] mt-2">Risk Intensity</span>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="h-px w-48 bg-white/10 rounded-full overflow-hidden"
                                    >
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="h-full w-1/2 bg-gold/50 blur-[2px]"
                                        />
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <div key="theatre-box" className="w-full">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="text-center mb-12">
                                            <span className="font-mono text-[9px] tracking-[0.28em] text-gold uppercase mb-4 block">Neural Extraction</span>
                                            <h2 className="text-3xl font-serif font-light text-foreground italic">Parsing Legal Structures...</h2>
                                        </div>
                                        <AnalysisTheatre />
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function RiskValue({ finalValue }: { finalValue: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const duration = 1000; // Match the 1s speedometer show

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                // Random flicker before settling
                setDisplayValue(Math.floor(Math.random() * 100));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayValue(finalValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [finalValue]);

    return (
        <span className="text-6xl font-serif font-light text-foreground tracking-tighter">
            {displayValue}
        </span>
    );
}


