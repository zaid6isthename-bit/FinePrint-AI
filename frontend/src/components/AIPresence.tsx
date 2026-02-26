"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface AIPresenceProps {
    status: "idle" | "analyzing" | "completed";
    className?: string;
}

export function AIPresence({ status, className = "" }: AIPresenceProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <AnimatePresence mode="wait">
                {status === "completed" ? (
                    <motion.div
                        key="completed"
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="relative w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                        <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />

                        {/* Checkmark Burst Particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`burst-${i}`}
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{
                                    scale: [0, 1.5],
                                    opacity: [1, 0],
                                    x: Math.cos(i * 60 * Math.PI / 180) * 40,
                                    y: Math.sin(i * 60 * Math.PI / 180) * 40
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                            />
                        ))}

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="orb"
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Outer Glow */}
                        <motion.div
                            animate={{
                                scale: status === "analyzing" ? [1, 1.2, 1] : [1, 1.05, 1],
                                opacity: status === "analyzing" ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
                            }}
                            transition={{
                                duration: status === "analyzing" ? 2 : 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-[-20px] rounded-full bg-[#C8A96A]/30 blur-2xl"
                        />

                        {/* Inner Core */}
                        <motion.div
                            animate={{
                                scale: status === "analyzing" ? [1, 1.1, 1] : [1, 1, 1],
                            }}
                            transition={{
                                duration: status === "analyzing" ? 1.5 : 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C8A96A] to-[#D9A441] shadow-[0_0_20px_rgba(200,169,106,0.5)] border border-white/20"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
