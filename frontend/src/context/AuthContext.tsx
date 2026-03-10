"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.user?.id && session.user.email) {
            setUser({
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                image: session.user.image,
            });
        } else {
            setUser(null);
        }
    }, [session]);

    const logout = () => {
        setUser(null);
        void signOut({ callbackUrl: "/login" });
    };

    return (
        <AuthContext.Provider value={{ user, logout, isLoading: status === "loading" }}>
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
