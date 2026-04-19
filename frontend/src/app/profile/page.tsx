"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Settings, Award, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MobileProfile from "@/components/MobileProfile";

export default function ProfilePage() {
    const { user, logout, isInitialized, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push("/login");
        }
    }, [isInitialized, isAuthenticated, router]);

    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen pt-[40px] md:pt-[120px] pb-24 px-0 md:px-6 relative overflow-hidden bg-background">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,169,106,0.1)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(80,100,160,0.06)_0%,transparent_70%)] blur-[120px] rounded-full animate-brain-pulse" style={{ animationDelay: "4s" }} />
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <MobileProfile />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block w-full max-w-5xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Sidebar / Identity Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-80 space-y-6"
                    >
                        <div className="glass-pane p-1 shadow-2xl shadow-black/40">
                            <div className="bg-background/40 p-8 rounded-sm text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
                                        {user?.image ? (
                                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-gold" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
                                        <Shield className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                                <h1 className="text-2xl font-serif font-light text-foreground">{user?.firstName} {user?.lastName}</h1>
                                <p className="text-[10px] font-mono text-gold tracking-widest uppercase mt-2 opacity-60">Operative ID: {user?.id.slice(0, 12)}</p>
                            </div>
                        </div>

                        <Button 
                            variant="outline"
                            onClick={logout}
                            className="w-full h-14 border-red-500/20 text-red-500 hover:bg-red-500/5 hover:border-red-500/40 transition-all font-mono text-[10px] tracking-widest uppercase"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Terminate Session
                        </Button>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        <section>
                            <div className="mb-6">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase opacity-60">Neural Profile</span>
                                <h2 className="text-4xl font-serif font-light text-foreground mt-2">Authenticated <span className="italic text-gold">Identity.</span></h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="glass-pane p-8 bg-background/20 space-y-4">
                                    <div className="flex items-center gap-3 text-gold/40">
                                        <Mail className="h-4 w-4" />
                                        <span className="font-mono text-[9px] tracking-widest uppercase font-bold">Encrypted Email</span>
                                    </div>
                                    <p className="text-lg font-serif">{user?.email}</p>
                                </div>
                                <div className="glass-pane p-8 bg-background/20 space-y-4">
                                    <div className="flex items-center gap-3 text-gold/40">
                                        <Award className="h-4 w-4" />
                                        <span className="font-mono text-[9px] tracking-widest uppercase font-bold">Clearance Level</span>
                                    </div>
                                    <p className="text-lg font-serif">Level 4 // Auditor</p>
                                </div>
                            </div>
                        </section>

                        <section className="pt-8 border-t border-white/5">
                            <h3 className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase mb-8">Performance Metrics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <MetricCard icon={<FileText />} label="Audits" value="12" />
                                <MetricCard icon={<Shield />} label="Precision" value="99.4%" />
                                <MetricCard icon={<Settings />} label="Isolation" value="256b" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-6 bg-card/5 border border-white/5 rounded-sm hover:border-gold/20 transition-all group">
            <div className="text-gold/20 group-hover:text-gold/40 transition-colors mb-4">{icon}</div>
            <div className="text-2xl font-serif text-foreground mb-1">{value}</div>
            <div className="font-mono text-[8px] tracking-widest uppercase text-muted-foreground/40">{label}</div>
        </div>
    );
}
