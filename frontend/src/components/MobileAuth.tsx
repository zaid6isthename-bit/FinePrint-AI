"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Shield, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface MobileAuthProps {
  type: "login" | "signup";
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  name?: string;
  setName?: (name: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MobileAuth({
  type,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isLoading,
  onSubmit,
}: MobileAuthProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans pt-20 pb-12 px-8 md:hidden overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full -mr-32 -mt-32" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative z-10"
      >
        <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center mb-8">
          <Shield className="h-6 w-6 text-gold" />
        </div>
        <h1 className="text-4xl font-serif font-light mb-4 leading-tight">
          {type === "login" ? "Vault" : "Request"} <br />
          <span className="italic text-gold">{type === "login" ? "Access." : "Entry."}</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-[240px]">
          {type === "login" 
            ? "Secure neural uplink with 256-bit isolation protocols." 
            : "Register your identity for high-fidelity legal audits."}
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-8 relative z-10 flex-1">
        {type === "signup" && setName && (
          <div className="space-y-2">
            <Label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase opacity-70 ml-1">Archive Name</Label>
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card/40 border-l border-gold/30 border-t-0 border-r-0 border-b-0 h-14 rounded-none text-sm font-mono focus:ring-0 focus:border-l-gold transition-all"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase opacity-70 ml-1">Archive ID</Label>
          <div className="relative">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/30" />
            <Input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b border-white/10 border-t-0 border-r-0 border-l-0 pl-8 h-12 rounded-none text-sm font-mono focus:ring-0 focus:border-b-gold transition-all"
              required
            />
          </div>
        </div>

        {setPassword && (
          <div className="space-y-2">
            <Label className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase opacity-70 ml-1">Security Key</Label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/30" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-b border-white/10 border-t-0 border-r-0 border-l-0 pl-8 h-12 rounded-none text-sm font-mono focus:ring-0 focus:border-b-gold transition-all"
                required
              />
            </div>
          </div>
        )}

        <div className="pt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 rounded-none text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-xl shadow-gold/5"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              type === "login" ? "Initialize Uplink" : "Transmit Credentials"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-12 text-center relative z-10">
        <p className="text-[10px] font-mono tracking-widest text-muted-foreground/40 uppercase">
          {type === "login" ? "New operative?" : "Existing operative?"}{" "}
          <Link 
            href={type === "login" ? "/signup" : "/login"} 
            className="text-gold underline underline-offset-4 ml-2"
          >
            {type === "login" ? "Register" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
