"use client";

import Link from "next/link";
import { FileText, Github, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">FinePrint <span className="text-blue-500">AI</span></span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center space-x-6">
                            {user ? (
                                <>
                                    <Link href="/upload" className="text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium">New Analysis</Link>
                                    <Link href="/history" className="text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium">History</Link>
                                </>
                            ) : (
                                <Link href="/login" className="text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium">Sign In</Link>
                            )}
                            <Link href="https://github.com/zaid6isthename-bit/FinePrint-AI" target="_blank" className="text-zinc-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>

                        {user && (
                            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-xs font-semibold text-white">{user.firstName || user.email.split('@')[0]}</span>
                                    <span className="text-[10px] text-zinc-500">Free Account</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-500/10 hover:text-red-400">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        {!user && (
                            <Link href="/upload" className="md:hidden">
                                <Button variant="outline" size="sm">Get Started</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
