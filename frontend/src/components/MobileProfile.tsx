"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Settings, Award, FileText, ArrowRight, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function MobileProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans pt-16 pb-24 px-6 md:hidden overflow-x-hidden">
      {/* Header / Identity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-10"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center relative z-10 overflow-hidden backdrop-blur-md">
            {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <User className="h-10 w-10 text-gold" />
            )}
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-background z-20 flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Shield className="h-3 w-3 text-white" />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold/5 blur-2xl rounded-full" />
        </div>

        <h1 className="text-2xl font-serif font-light mb-1">
          {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Authenticated Operative"}
        </h1>
        <p className="font-mono text-[9px] tracking-[0.2em] text-gold uppercase opacity-60">
          Rank: Senior Auditor
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-4 bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/5 rounded-sm">
          <FileText className="h-4 w-4 text-gold mb-3 opacity-60" />
          <div className="text-xl font-serif">12</div>
          <div className="text-[8px] font-mono tracking-widest uppercase text-muted-foreground/50">Audits Performed</div>
        </div>
        <div className="p-4 bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/5 rounded-sm">
          <Award className="h-4 w-4 text-emerald-400 mb-3 opacity-60" />
          <div className="text-xl font-serif">A+</div>
          <div className="text-[8px] font-mono tracking-widest uppercase text-muted-foreground/50">Reliability Grade</div>
        </div>
      </div>

      {/* Menu / Settings */}
      <div className="space-y-2 flex-1">
        <h3 className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase pl-1 mb-4">Configuration</h3>
        
        <ProfileMenuItem icon={<Mail className="h-4 w-4" />} label="Identity Details" value={user?.email || "pending..."} />
        <ProfileMenuItem icon={<Bell className="h-4 w-4" />} label="Security Notifications" />
        <ProfileMenuItem icon={<Settings className="h-4 w-4" />} label="Encryption Settings" />
        
        <div className="h-6" />
        
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full h-14 justify-between px-6 bg-red-500/5 hover:bg-red-500/10 text-red-500/60 rounded-none border border-red-500/10 transition-all font-mono text-[9px] tracking-[0.2em] uppercase"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            De-authenticate
          </span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="mt-8 text-center opacity-30">
        <p className="text-[8px] font-mono tracking-[0.3em] uppercase">Protocol v4.2.0-SEC</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-5 bg-card/20 backdrop-blur-sm border-white/5 dark:border-white/5 border-l-2 border-l-transparent hover:border-l-gold hover:bg-card/40 transition-all group">
      <div className="flex items-center gap-4">
        <div className="text-gold/40 group-hover:text-gold transition-colors">{icon}</div>
        <div className="text-left">
          <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-foreground/80">{label}</div>
          {value && <div className="text-[9px] font-mono text-muted-foreground/40 mt-0.5">{value}</div>}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-gold transition-colors" />
    </button>
  );
}
