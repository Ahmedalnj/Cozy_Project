/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

// 🧠 تهيئة الإعدادات
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }

        // ✅ نحذف كلمة المرور ونُعيد المستخدم
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          emailVerified: user.emailVerified ?? undefined,
          role: user.role ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.image = user.image ?? undefined;
        token.role = (user as any).role ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // يمكنك تغييره لمسارك المخصص لتسجيل الدخول
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default NextAuth(authOptions);
