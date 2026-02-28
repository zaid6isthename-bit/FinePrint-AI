"use client";

import Link from "next/link";
import { Github, LogOut, Shield, Layout, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-white/[0.05]">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-500 border border-primary/20">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg tracking-tight text-foreground leading-none">FinePrint <span className="text-primary font-bold">AI</span></span>
                                <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-1">Leg Tech Systems</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center space-x-1">
                            {user ? (
                                <>
                                    <NavLink href="/upload" icon={<PlusCircle className="h-4 w-4" />}>Analysis</NavLink>
                                    <NavLink href="/history" icon={<Layout className="h-4 w-4" />}>Vault</NavLink>
                                </>
                            ) : (
                                <NavLink href="/login">Sign In</NavLink>
                            )}
                        </div>

                        <div className="h-6 w-px bg-white/10 hidden md:block" />

                        <div className="flex items-center gap-3 sm:gap-6">
                            <ModeToggle />
                            <Link href="https://github.com/zaid6isthename-bit/FinePrint-AI" target="_blank" className="text-zinc-500 hover:text-foreground transition-all p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/5">
                                <Github className="h-4 w-4" />
                            </Link>

                            {user && (
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-xs font-semibold text-white tracking-tight">{user.firstName || user.email.split('@')[0]}</span>
                                        <span className="text-[9px] font-bold text-primary/70 tracking-widest uppercase">Verified Expert</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={logout}
                                        className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {!user && (
                                <Link href="/signup">
                                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-10 font-medium tracking-tight shadow-lg shadow-primary/20">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-zinc-400 hover:text-white transition-all px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/5"
        >
            {icon}
            {children}
        </Link>
    );
}
