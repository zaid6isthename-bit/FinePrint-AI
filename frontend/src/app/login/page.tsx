"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.access_token, response.data.user);
            toast({
                title: "Login Successful",
                description: "Welcome back to FinePrint AI.",
            });
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.detail || "Invalid email or password.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-pane p-8 sm:p-10 rounded-[2.5rem]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground dark:text-[#E8E9EB]">Sign In</h1>
                        <p className="text-muted-foreground dark:text-[#A6A9B0] font-light">Access your legal agreement history.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-muted-foreground dark:text-[#A6A9B0] uppercase ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-[#A6A9B0]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-13 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50 placeholder:text-muted-foreground/60 dark:placeholder:text-zinc-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <Label htmlFor="password" className="text-xs font-bold tracking-widest text-muted-foreground dark:text-[#A6A9B0] uppercase">Password</Label>
                                <Link href="#" className="text-[10px] font-bold text-primary hover:text-foreground dark:hover:text-white uppercase tracking-tighter transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-[#A6A9B0]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 h-13 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50 placeholder:text-muted-foreground/60 dark:placeholder:text-zinc-600"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg bg-primary hover:bg-[#D9A441] text-[#0E0F12] rounded-2xl font-semibold shadow-xl shadow-primary/20 transition-all duration-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Accessing Vault...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold tracking-[0.1em] text-muted-foreground dark:text-[#A6A9B0] uppercase">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:text-foreground dark:hover:text-white transition-all inline-flex items-center group ml-1">
                            Create one
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
