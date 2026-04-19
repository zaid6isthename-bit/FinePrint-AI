"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string | null;
}

interface AuthContextType {
    user: User | null;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    status: "loading" | "authenticated" | "unauthenticated";
    isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        // Only update user state when session actually changes
        if (session?.user?.email) {
            setUser({
                id: session.user.id || "",
                email: session.user.email,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                image: session.user.image,
            });
        } else if (status === "unauthenticated") {
            setUser(null);
        }
        
        // Mark as initialized once status is determined (not loading)
        if (status !== "loading") {
            setIsInitialized(true);
        }
    }, [session, status]);

    const logout = useCallback(async () => {
        setUser(null);
        setIsInitialized(false);
        await signOut({ callbackUrl: "/login", redirect: true });
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            logout, 
            isLoading: status === "loading",
            isAuthenticated: status === "authenticated",
            status,
            isInitialized
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
