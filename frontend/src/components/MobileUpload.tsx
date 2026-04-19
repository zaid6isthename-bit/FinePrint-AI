"use client";

import { motion } from "framer-motion";
import { Upload, FileIcon, Loader2, Sparkles, Lock, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface MobileUploadProps {
  file: File | null;
  title: string;
  setTitle: (title: string) => void;
  isUploading: boolean;
  onUpload: () => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  setFile: (file: File | null) => void;
}

export default function MobileUpload({
  file,
  title,
  setTitle,
  isUploading,
  onUpload,
  getRootProps,
  getInputProps,
  isDragActive,
  setFile,
}: MobileUploadProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans pt-12 pb-24 px-6 md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="p-2 -ml-2 text-gold/60">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase opacity-60">
          Extraction Chamber
        </span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-serif font-light mb-3 leading-tight text-foreground">
          Relinquish <br />
          <span className="italic text-gold">Document.</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          The quiet audit begins upon submission. Securely encrypted and analyzed in isolation.
        </p>
      </motion.div>

      {/* Input Section */}
      <div className="space-y-8 mb-10">
        <div className="space-y-3">
          <Label htmlFor="mobile-title" className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase ml-1 opacity-70">
            Archive Identifier
          </Label>
          <Input
            id="mobile-title"
            placeholder="e.g. NDAs_SECURE_24"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-card/40 border-l-2 border-l-gold/30 border-t-0 border-r-0 border-b-0 h-14 rounded-none text-sm font-mono focus:ring-0 focus:border-l-gold transition-all"
          />
        </div>

        <div
          {...getRootProps()}
          className={`relative border-t border-b border-white/5 dark:border-white/5 py-12 text-center transition-all duration-700
            ${isDragActive ? "bg-gold/5 border-gold/40" : "bg-card/10"}
            ${file ? "bg-gold/5 border-gold/20" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          {file ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 flex items-center justify-center border border-gold/20">
                <FileIcon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm font-serif">{file.name}</p>
                <p className="text-[8px] font-mono text-gold/50 uppercase tracking-widest mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-[9px] font-mono text-muted-foreground hover:text-gold uppercase tracking-widest underline underline-offset-4"
              >
                Discard
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-muted/50 flex items-center justify-center border border-white/5 dark:border-white/5">
                <Upload className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-serif italic text-muted-foreground">Select PDF for Intake</p>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto">
        <Button
          onClick={onUpload}
          disabled={!file || !title || isUploading}
          className="w-full h-16 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 rounded-none text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-xl shadow-gold/5"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Extracting..." : "Initialize Scan"}
        </Button>
        
        <div className="mt-6 flex justify-around opacity-30">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            <span className="text-[8px] font-mono tracking-widest uppercase">Secret</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" />
            <span className="text-[8px] font-mono tracking-widest uppercase">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
