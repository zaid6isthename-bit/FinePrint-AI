import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { findUserByEmail, upsertSocialUser } from "@/lib/server/repository";

const providers: Provider[] = [
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

        // High-fidelity proxy to backend auth service
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        const user = data.user;

        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
          accessToken: data.access_token,
        };
      } catch (error) {
        console.error("Auth proxy failure:", error);
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
  },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) {
        return false;
      }

      if (account.provider === "credentials") {
        return true;
      }

      // TODO: Implement unified backend social sync for a billion-dollar architecture
      // For now, we trust the OAuth session but bypass local filesystem persistence to prevent 500 errors on Vercel
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        if ("firstName" in user) {
          token.firstName = user.firstName;
        }
        if ("lastName" in user) {
          token.lastName = user.lastName;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.firstName = typeof token.firstName === "string" ? token.firstName : undefined;
        session.user.lastName = typeof token.lastName === "string" ? token.lastName : undefined;
        session.user.image = typeof token.picture === "string" ? token.picture : (session.user.image ?? undefined);
      }

      return session;
    },
  },
};
