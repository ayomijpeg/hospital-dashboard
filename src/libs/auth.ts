import { NextAuthOptions } from "next-auth";
import { prisma } from '@/libs/prisma'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { devAuthStore } from "@/libs/devAuthStore";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();

        // 1. Instant Dev Store Check (Eliminates 5-second database TCP timeout in offline/dev environments)
        const devUser = devAuthStore.findByEmail(email);
        if (devUser && (await bcrypt.compare(credentials.password, devUser.password))) {
          return {
            id: devUser.id.toString(),
            email: devUser.email,
            name: devUser.name,
            role: devUser.role.toUpperCase(),
            department: devUser.department || (devUser.role === 'doctor' ? 'Medical Staff' : 'Patient Care'),
            avatar: devUser.avatar || 'default-male.jpg',
          };
        }

        // 2. Primary Database Authentication
        try {
          const userAccount = await prisma.user.findUnique({
            where: { email },
          });

          if (userAccount && (await bcrypt.compare(credentials.password, userAccount.password))) {
            let department: string | null = null;
            let avatar: string | null = null;

            if (userAccount.role?.toLowerCase() === 'doctor') {
              const doc = await prisma.doctor.findUnique({ where: { email } });
              department = doc?.department || 'Medical Staff';
              avatar = doc?.avatar || (doc?.gender === 'Female' ? 'female-doctor.jpg' : 'male-doctor.jpg');
            } else if (userAccount.role?.toLowerCase() === 'admin') {
              department = 'Hospital Administration';
              avatar = 'doctor1.jpg';
            } else {
              department = 'Patient Care';
              avatar = 'default-male.jpg';
            }

            return {
              id: userAccount.id.toString(),
              email: userAccount.email,
              name: userAccount.name,
              role: userAccount.role.toUpperCase(),
              department,
              avatar,
            };
          }

          // Fallback check for existing Doctor records in DB
          const doc = await prisma.doctor.findUnique({
            where: { email },
          });

          if (doc && (await bcrypt.compare(credentials.password, doc.password))) {
            return {
              id: doc.id.toString(),
              email: doc.email,
              name: doc.name,
              role: "DOCTOR",
              department: doc.department,
              avatar: doc.avatar || (doc.gender === 'Female' ? 'female-doctor.jpg' : 'male-doctor.jpg'),
            };
          }
        } catch (dbError) {
          console.warn("[AUTH_DB_FALLBACK] Database offline or unreachable:", dbError);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.department = user.department;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
