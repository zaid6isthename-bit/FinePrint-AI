"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileIcon, Loader2, Sparkles, Lock } from "lucide-react";
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

            const response = await api.post(`/documents/upload?title=${encodeURIComponent(title)}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Minimum analysis duration for UX/perceived quality
            setTimeout(() => {
                setStep("completed");
                setTimeout(() => {
                    router.push(`/dashboard/${response.data.id}`);
                }, 1500);
            }, 8000);

        } catch (error: unknown) {
            setStep("upload");
            setIsUploading(false);
            const message = (error as any).response?.data?.detail || "Could not upload the document. Please try again.";
            toast({
                title: "Upload Failed",
                description: message,
                variant: "destructive",
            });
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AIPresence status="analyzing" />
            </div>
        );
    }

    return (
        <main className={`min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden transition-colors duration-1000 ${step === 'analyzing' ? 'bg-[#0E0F12]/95 text-[#E8E9EB]' : 'bg-[#0E0F12] text-[#E8E9EB]'}`}>
            {/* Background Calm Atmosphere */}
            <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[10%] w-[60%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-10 right-[10%] w-[40%] h-[30%] bg-[#C8A96A]/5 blur-[100px] rounded-full" />
            </div>

            <AnimatePresence mode="wait">
                {step === "upload" ? (
                    <motion.div
                        key="upload-ui"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.8 } }}
                        className="w-full max-w-2xl z-10"
                    >
                        <div className="text-center mb-12">
                            <AIPresence status="idle" className="mb-8" />
                            <h1 className="text-4xl font-semibold mb-4 tracking-tight text-[#E8E9EB]">Secure Agreement Analysis</h1>
                            <p className="text-[#A6A9B0] text-lg font-light leading-relaxed">
                                Step into a quieter legal experience. Your documents are analyzed <br /> with 256-bit encryption and proprietary legal AI.
                            </p>
                        </div>

                        <div className="glass-pane p-8 sm:p-10 rounded-[2.5rem] space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-xs font-bold tracking-[0.25em] text-[#A6A9B0] uppercase ml-1">Document Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., MSA - FinePrint AI"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-[#0E0F12]/40 border-white/5 h-16 text-xl rounded-2xl focus:ring-primary focus:border-primary/50 transition-all font-light px-6 text-[#E8E9EB]"
                                />
                            </div>

                            <div
                                {...getRootProps()}
                                className={`group relative border-2 border-dashed rounded-[2.5rem] p-16 text-center cursor-pointer transition-all duration-700
                  ${isDragActive ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10" : "border-white/5 hover:border-primary/50 hover:bg-white/[0.02]"}
                  ${file ? "bg-[#1C1F26]/30 border-solid border-primary/20" : ""}
                `}
                            >
                                <input {...getInputProps()} />

                                <AnimatePresence mode="wait">
                                    {file ? (
                                        <motion.div
                                            key="file-ready"
                                            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            className="flex flex-col items-center gap-6"
                                        >
                                            <motion.div
                                                layoutId="file-icon-box"
                                                className="p-6 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-lg"
                                            >
                                                <FileIcon className="h-12 w-12 text-primary" />
                                            </motion.div>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-semibold text-[#E8E9EB] tracking-tight">{file.name}</p>
                                                <p className="text-[#A6A9B0] font-mono text-[10px] uppercase tracking-[0.2em]">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • SECURE ARCHIVE READY
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                className="text-[#A6A9B0] hover:text-red-400 hover:bg-red-400/5 transition-all text-[10px] font-bold tracking-widest uppercase mt-2 h-10 px-6 rounded-full"
                                            >
                                                DISCARD DOCUMENT
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="drop-prompt"
                                            className="flex flex-col items-center gap-6"
                                        >
                                            <motion.div
                                                layoutId="file-icon-box"
                                                className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500"
                                            >
                                                <Upload className="h-12 w-12 text-[#A6A9B0] group-hover:text-primary transition-colors" />
                                            </motion.div>
                                            <div>
                                                <p className="text-2xl font-semibold mb-2 text-[#E8E9EB] tracking-tight">
                                                    {isDragActive ? "Drop to Inspect" : "Relinquish Document Here"}
                                                </p>
                                                <p className="text-[#A6A9B0] text-sm font-light">Drag & drop for a quiet legal inspection</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-4 flex flex-col items-center gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full"
                                >
                                    <Button
                                        size="lg"
                                        className={`w-full h-18 text-xl bg-primary hover:bg-[#D9A441] text-[#0E0F12] rounded-[1.5rem] shadow-xl transition-all duration-700 group relative overflow-hidden
                                            ${(file && title) ? "shadow-primary/30 glow-gold" : "opacity-50"}
                                        `}
                                        onClick={handleUpload}
                                        disabled={!file || !title || isUploading}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 font-semibold tracking-tight">
                                            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                                            BEGIN INTENSIVE SCAN
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: "0%" }}
                                            transition={{ duration: 0.6, ease: "circOut" }}
                                        />
                                    </Button>
                                </motion.div>
                                <div className="flex items-center gap-3 text-[#A6A9B0] text-[10px] font-bold tracking-[0.25em] uppercase">
                                    <Lock className="h-3 w-3" />
                                    256-bit isolation • Proprietary Legal NLP
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
                        <div className="mb-12">
                            <AIPresence status={step === "completed" ? "completed" : "analyzing"} />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === "completed" ? (
                                <motion.div
                                    key="completed-msg"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-10"
                                >
                                    <div className="text-center">
                                        <h2 className="text-4xl font-semibold text-[#E8E9EB] tracking-tight mb-3">Architecture Validated</h2>
                                        <p className="text-[#A6A9B0] text-lg font-light">The quiet audit is complete. Finalizing report...</p>
                                    </div>

                                    {/* Animated Risk Meter Feedback - Legal Gold */}
                                    <div className="relative w-72 h-36 flex flex-col items-center justify-end overflow-hidden">
                                        <motion.div
                                            initial={{ rotate: -90 }}
                                            animate={{ rotate: 180 }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className="absolute top-0 w-72 h-72 rounded-full border-[12px] border-white/5"
                                        />
                                        <motion.div
                                            initial={{ rotate: -90 }}
                                            animate={{ rotate: 30 }} // Mock score of 66
                                            transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                                            className="absolute top-0 w-72 h-72 rounded-full border-[12px] border-[#C8A96A] border-t-transparent border-l-transparent z-10 shadow-[0_0_30px_rgba(200,169,106,0.25)]"
                                        />
                                        <div className="z-20 flex flex-col items-center">
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1 }}
                                                className="text-6xl font-bold text-[#E8E9EB] tracking-tighter"
                                            >
                                                66
                                            </motion.span>
                                            <span className="text-[10px] font-bold text-[#A6A9B0] uppercase tracking-[0.3em] mb-4">Risk Intensity</span>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.8 }}
                                        className="h-1 w-48 bg-white/5 rounded-full overflow-hidden"
                                    >
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="h-full w-1/2 bg-[#C8A96A] blur-sm"
                                        />
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <div key="theatre-box" className="w-full">
                                    <AnalysisTheatre />
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
