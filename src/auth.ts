import NextAuth, { Session, User } from "next-auth";
import Github from 'next-auth/providers/github';
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const hasGithubOAuth = !!GITHUB_CLIENT_ID && !!GITHUB_CLIENT_SECRET;

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  providers: hasGithubOAuth
    ? [
        Github({
          clientId: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET,
          checks: ["state"],
        }),
      ]
    : [
        Credentials({
          id: "ci-placeholder",
          name: "CI Placeholder",
          credentials: {},
          authorize: async () => null,
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