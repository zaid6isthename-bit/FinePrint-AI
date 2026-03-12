import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Extend the session types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      image?: string | null;
      name?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const apiUrl = baseUrl.includes("/api") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/api`;
        
        // Fetch from backend auth service
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          console.error("Backend auth response not ok:", response.status);
          return null;
        }

        const data = await response.json();
        const user = data.user;

        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
          image: user.image ?? null,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
        };
      } catch (error) {
        console.error("Auth provider error:", error);
        return null;
      }
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fineprint-dev-secret-change-me",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      // Allow sign in for both credentials and OAuth providers
      if (account?.provider === "credentials" && user?.email) {
        return true;
      }

      // For OAuth providers, allow if user has email
      if (user?.email && account?.provider) {
        return true;
      }

      return false;
    },
    async jwt({ token, user, account }) {
      // Initial JWT creation (when user logs in)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      // Reconstruct session from JWT token
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.picture ?? null;
        session.user.name = [token.firstName, token.lastName]
          .filter(Boolean)
          .join(" ") || token.email;
      }

      return session;
    },
  },
};

