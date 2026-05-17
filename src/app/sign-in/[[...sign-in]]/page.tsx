import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
        <section className="max-w-lg rounded-lg border border-white/10 bg-[#0E1628]/80 p-6">
          <h1 className="text-3xl font-semibold">Sign-in is almost ready.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add Clerk keys to enable Google sign-in and protected watchlists.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
      <div className="rounded-lg border border-white/10 bg-[#0E1628]/80 p-4">
        <SignIn />
      </div>
    </main>
  );
}
