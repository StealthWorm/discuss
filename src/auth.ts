import NextAuth, { Session, User } from "next-auth";
import Github from 'next-auth/providers/github';
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const hasGithubOAuth = !!GITHUB_CLIENT_ID && !!GITHUB_CLIENT_SECRET;

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const redirectProxyUrl =
  process.env.AUTH_REDIRECT_PROXY_URL ||
  (process.env.VERCEL_ENV === "preview" && productionHost
    ? `https://${productionHost}/api/auth`
    : undefined);

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  ...(redirectProxyUrl ? { redirectProxyUrl } : {}),
  pages: {
    error: "/auth/error",
  },
  providers: hasGithubOAuth
    ? [
        Github({
          clientId: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET,
          checks: ["state"],
          // GitHub sends iss=https://github.com/login/oauth (RFC 9207).
          // Auth.js otherwise infers https://github.com and the callback 500s.
          issuer: "https://github.com/login/oauth",
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
