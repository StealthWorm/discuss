import Link from "next/link";

export const dynamic = "force-dynamic";

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

const errorMessages: Record<string, string> = {
  Configuration:
    "Auth configuration failed. If you opened a preview URL, use the production site or wait for this fix to deploy.",
  AccessDenied: "Access was denied. You can try signing in again.",
  Verification: "The sign-in link is invalid or has expired.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method.",
  Default: "Sign in failed. Please try again from the home page.",
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = await searchParams;
  const message = errorMessages[error ?? "Default"] ?? errorMessages.Default;

  return (
    <div className="mx-auto mt-16 max-w-lg space-y-4 rounded border p-6">
      <h1 className="text-2xl font-bold">Could not sign in</h1>
      <p className="text-gray-700">{message}</p>
      {error ? (
        <p className="text-sm text-gray-500">Error code: {error}</p>
      ) : null}
      <Link className="inline-block underline" href="/">
        Back to home
      </Link>
    </div>
  );
}
