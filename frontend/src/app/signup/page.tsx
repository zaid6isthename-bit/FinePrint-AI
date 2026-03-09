"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/auth/signup", {
                email,
                password,
                firstName,
                lastName
            });

            const loginResponse = await api.post("/auth/login", { email, password });
            login(loginResponse.data.access_token, loginResponse.data.user);

            toast({
                title: "Account Created",
                description: "Welcome to FinePrint AI!",
            });
        } catch (error: any) {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string'
                ? detail
                : (Array.isArray(detail) ? detail[0]?.msg : "Something went wrong. Please try again.");

            toast({
                title: "Signup Failed",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-transparent">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full animate-brain-pulse delay-[2s]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-pane p-1 shadow-2xl shadow-black/50">
                    <div className="bg-midnight/40 p-8 sm:p-10 rounded-sm">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[4px] bg-gold/10 border border-gold/20 mb-6">
                                <UserPlus className="h-6 w-6 text-gold" />
                            </div>
                            <h1 className="text-3xl font-serif font-light text-foreground mb-2">Operative Registration</h1>
                            <p className="text-muted-foreground/60 text-xs font-mono tracking-widest uppercase">Establish Security Credentials</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="firstName" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-12 bg-midnight/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 font-mono text-xs px-4"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="lastName" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-12 bg-midnight/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 font-mono text-xs px-4"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">Official Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="legal@corporate.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12 bg-midnight/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 placeholder:text-muted-foreground/20 font-mono text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">Desired Passkey</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 h-12 bg-midnight/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 placeholder:text-muted-foreground/20 font-mono text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-[10px] font-mono font-bold tracking-[0.2em] bg-gold/10 hover:bg-gold/20 text-gold rounded-sm border border-gold/30 uppercase transition-all duration-700 shadow-xl shadow-gold/5 glow-gold mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Establishing...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-[9px] font-mono tracking-[0.1em] text-muted-foreground/40 uppercase">
                                Already activated?{" "}
                                <Link href="/login" className="text-gold hover:text-white transition-all inline-flex items-center group ml-1">
                                    Sign In
                                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
