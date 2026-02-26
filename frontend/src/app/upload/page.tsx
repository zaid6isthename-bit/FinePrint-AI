"use client";

import { motion } from "framer-motion";
import { Upload, FileIcon, Loader2, AlertCircle } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);
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
            setFile(acceptedFiles[0]);
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

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post(`/documents/upload?title=${encodeURIComponent(title)}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast({
                title: "Analysis Started",
                description: "Your document is being processed by our ML engine.",
            });

            router.push(`/dashboard/${response.data.id}`);
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error.response?.data?.detail || "Could not upload the document. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl font-bold mb-4">Upload Agreement</h1>
                    <p className="text-zinc-400 text-lg">
                        Drag and drop your legal document below to begin the AI risk analysis.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
                >
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-lg">Document Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Startup Employment Contract"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-black/50 border-white/10 h-14 text-lg"
                        />
                    </div>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"}
              ${file ? "bg-white/5 border-solid border-white/20" : ""}
            `}
                    >
                        <input {...getInputProps()} />

                        {file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-blue-500/20 rounded-full">
                                    <FileIcon className="h-10 w-10 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold mb-1">{file.name}</p>
                                    <p className="text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                    Remove File
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-full">
                                    <Upload className="h-10 w-10 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold mb-2">
                                        {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
                                    </p>
                                    <p className="text-zinc-400">or click to browse files</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl"
                            onClick={handleUpload}
                            disabled={!file || !title || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing Document...
                                </>
                            ) : (
                                "Start AI Analysis"
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
