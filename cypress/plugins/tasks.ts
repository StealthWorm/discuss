import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const prisma = new PrismaClient();

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Add other OAuth providers as needed
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      return {
        ...session,
        user,
      }
    }
  },
});
