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
            // 1. Create account
            await api.post("/auth/signup", {
                email,
                password,
                firstName,
                lastName
            });

            // 2. Automatically log in
            const loginResponse = await api.post("/auth/login", { email, password });
            login(loginResponse.data.access_token, loginResponse.data.user);

            toast({
                title: "Account Created",
                description: "Welcome to FinePrint AI!",
            });
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || "Something went wrong. Please try again.";
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
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-pane p-8 sm:p-10 rounded-[2.5rem]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground dark:text-[#E8E9EB]">Create Account</h1>
                        <p className="text-muted-foreground dark:text-[#A6A9B0] font-light">Start analyzing agreements for free.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs font-bold tracking-widest text-muted-foreground dark:text-[#A6A9B0] uppercase ml-1">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="h-12 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs font-bold tracking-widest text-muted-foreground dark:text-[#A6A9B0] uppercase ml-1">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="h-12 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50"
                                />
                            </div>
                        </div>

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
                                    className="pl-12 h-12 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50 placeholder:text-muted-foreground/60 dark:placeholder:text-zinc-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold tracking-widest text-muted-foreground dark:text-[#A6A9B0] uppercase ml-1">Secure Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-[#A6A9B0]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 h-12 bg-muted/50 dark:bg-[#0E0F12]/40 border-border dark:border-white/5 text-foreground dark:text-[#E8E9EB] rounded-2xl focus:ring-primary/50 placeholder:text-muted-foreground/60 dark:placeholder:text-zinc-600"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg bg-primary hover:bg-[#D9A441] text-[#0E0F12] rounded-2xl mt-4 font-semibold shadow-xl shadow-primary/20 transition-all duration-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Expert Account...
                                </>
                            ) : (
                                "Create Expert Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold tracking-[0.1em] text-muted-foreground dark:text-[#A6A9B0] uppercase">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:text-foreground dark:hover:text-white transition-all inline-flex items-center group ml-1">
                            Sign In
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
