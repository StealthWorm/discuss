import NextAuth, { Session, User } from "next-auth";
import Github from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing Github OAuth Credentials");
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Usually  not needed, here we are fixing a bug in nextAuth
    async session({ session, user }: { session: Session; user: User }) {
      //  the bug avoids the fill of the ID of the user in the session, that's why we are setting it below
      if (session?.user && user) {
        session.user.id = user.id;
      }

      return {
        ...session,
        user,
      }
    },
  }
});