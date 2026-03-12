"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SocialSignInButtons } from "@/components/auth/SocialSignInButtons";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Attempting login with email:", email);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/upload",
            });

            console.log("SignIn result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);
                toast({
                    title: "Login Failed",
                    description: result.error || "Invalid email or password.",
                    variant: "destructive",
                });
                return;
            }

            if (result?.ok) {
                console.log("Login successful, redirecting to /upload");
                window.location.href = "/upload";
            }
        } catch (error) {
            console.error("Login exception:", error);
            toast({
                title: "Login Failed",
                description: "Something went wrong while starting your session.",
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
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-brain-pulse" />
                <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full animate-brain-pulse" style={{ animationDelay: "3s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-pane p-1 shadow-2xl shadow-black/50">
                    <div className="bg-background/40 p-8 sm:p-10 rounded-sm">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[4px] bg-gold/10 border border-gold/20 mb-6">
                                <Shield className="h-6 w-6 text-gold" />
                            </div>
                            <h1 className="text-3xl font-serif font-light text-foreground mb-2">Vault Access</h1>
                            <p className="text-muted-foreground/60 text-xs font-mono tracking-widest uppercase">Verified Expert Login</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase ml-1">Archive ID (Email)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="expert@fineprint.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-13 bg-background/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 placeholder:text-muted-foreground/20 font-mono text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="password" className="text-[9px] font-mono font-bold tracking-[0.25em] text-muted-foreground/60 uppercase">Encryption Key</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 h-13 bg-midnight/30 border-white/5 text-foreground rounded-sm focus:ring-gold/50 placeholder:text-muted-foreground/20 font-mono text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-[10px] font-mono font-bold tracking-[0.2em] bg-gold/10 hover:bg-gold/20 text-gold rounded-sm border border-gold/30 uppercase transition-all duration-700 shadow-xl shadow-gold/5 glow-gold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Validating...
                                    </>
                                ) : (
                                    "Initialize Session"
                                )}
                            </Button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">or</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <SocialSignInButtons />

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-[9px] font-mono tracking-[0.1em] text-muted-foreground/40 uppercase">
                                New operative?{" "}
                                <Link href="/signup" className="text-gold hover:text-white transition-all inline-flex items-center group ml-1">
                                    Request Access
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

