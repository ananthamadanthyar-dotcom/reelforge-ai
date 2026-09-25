import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Tell TypeScript about our custom database fields!
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
      premiumOverride: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    plan?: string;
    premiumOverride?: boolean;
  }
  
  // We moved the JWT augmentation in here!
  interface JWT {
    id?: string;
    role?: string;
    plan?: string;
    premiumOverride?: boolean;
  }
}

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
        token.plan = user.plan as string;
        token.premiumOverride = user.premiumOverride as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
        session.user.premiumOverride = token.premiumOverride as boolean;
      }
      return session;
    }
  }
});