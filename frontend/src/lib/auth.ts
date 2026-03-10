import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createPasswordHash, sanitizeUser } from "@/lib/server/store";
import { findUserByEmail, upsertSocialUser } from "@/lib/server/repository";

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "").trim().toLowerCase();
      const password = String(credentials?.password ?? "");

      if (!email || !password) {
        return null;
      }

      const user = await findUserByEmail(email);
      if (!user?.passwordHash) {
        return null;
      }

      if (user.passwordHash !== createPasswordHash(password)) {
        return null;
      }

      const safeUser = sanitizeUser(user);
      return {
        id: safeUser.id,
        email: safeUser.email,
        name: [safeUser.firstName, safeUser.lastName].filter(Boolean).join(" ") || safeUser.email,
        image: safeUser.image,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
      };
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

      const [firstName, ...rest] = (user.name || "").trim().split(/\s+/).filter(Boolean);
      await upsertSocialUser({
        email: user.email,
        firstName,
        lastName: rest.join(" ") || undefined,
        image: user.image || undefined,
        provider: account.provider,
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.picture = dbUser.image ?? token.picture;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.firstName = typeof token.firstName === "string" ? token.firstName : undefined;
        session.user.lastName = typeof token.lastName === "string" ? token.lastName : undefined;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
      }

      return session;
    },
  },
};
