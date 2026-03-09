"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Analyze", href: "/upload" },
        { name: "History", href: "/history" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-[68px] flex items-center justify-between px-6 sm:px-10 bg-midnight/80 backdrop-blur-[24px] border-b border-white/5 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-gold to-gold2 flex items-center justify-center text-[10px] font-bold text-midnight shadow-lg shadow-gold/20 transform group-hover:rotate-12 transition-transform duration-300">
                        ⚖
                    </div>
                    <span className="font-serif text-xl tracking-[0.08em] text-foreground">
                        Fine<span className="text-gold">Print</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative px-4 py-2 text-[10px] font-mono font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${pathname === link.href ? "text-gold" : "text-muted-foreground hover:text-gold"
                                }`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-[20%] right-[20%] h-px bg-gold"
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white/5 border border-white/10">
                            <User className="h-3 w-3 text-gold" />
                            <span className="text-[10px] font-mono tracking-wider text-muted-foreground max-w-[100px] truncate">
                                {user.email}
                            </span>
                        </div>
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="h-8 w-8 hover:bg-gold/10 hover:text-gold text-muted-foreground transition-all rounded-[4px]"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-[10px] font-mono tracking-[0.12em] uppercase text-muted-foreground hover:text-gold border border-transparent hover:border-white/5 px-4 h-9 rounded-[4px]">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 px-5 h-9 rounded-[4px] glow-gold transition-all duration-300 shadow-xl shadow-gold/5">
                                Get Access
                            </Button>
                        </Link>
                    </div>
                )}
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground rounded-[4px]">
                    <Menu className="h-4 w-4" />
                </Button>
            </div>
        </nav>
    );
}
