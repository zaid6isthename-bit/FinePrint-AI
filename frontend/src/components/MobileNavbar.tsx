"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, History, LayoutDashboard, User, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function MobileNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Don't show on auth pages if needed, but the user requested it for the UI
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 h-16 bg-white/40 dark:bg-black/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-full flex items-center justify-around px-2 z-50 md:hidden shadow-2xl shadow-black/10 dark:shadow-black no-print">
      <NavIconButton 
        icon={<LayoutDashboard className="h-5 w-5" />} 
        active={pathname === "/"} 
        href="/" 
      />
      <NavIconButton 
        icon={<FileSearch className="h-5 w-5" />} 
        active={pathname === "/upload"} 
        href="/upload" 
      />
      
      {/* Theme Toggle in the middle or end? Let's put it as an extra item */}
      <button 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-3 rounded-full text-zinc-500 hover:text-gold transition-colors relative"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mounted && (
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <NavIconButton 
        icon={<History className="h-5 w-5" />} 
        active={pathname.startsWith("/history") || pathname.startsWith("/dashboard")} 
        href="/history" 
      />
      <NavIconButton 
        icon={<User className="h-5 w-5" />} 
        active={pathname === "/profile"} 
        href="/profile" 
      />
    </div>
  );
}

function NavIconButton({ icon, active, href }: { icon: React.ReactNode, active?: boolean, href: string }) {
  return (
    <Link 
      href={href} 
      className={`relative p-3 rounded-full transition-all duration-500 ${
        active 
          ? 'text-gold' 
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeNavTab"
          className="absolute inset-0 bg-gold/15 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className="relative z-10">
        {icon}
      </div>
    </Link>
  );
}
