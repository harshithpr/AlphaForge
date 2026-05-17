import { SignIn } from "@clerk/nextjs";
import { DemoAuthCard } from "@/components/market/demo-auth-card";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
        <DemoAuthCard mode="sign-in" />
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
