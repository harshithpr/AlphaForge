"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function AuthControls() {
  if (!clerkEnabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        title="Add Clerk keys to enable Google sign-in and sign-up."
        className="hidden min-h-11 px-4 sm:inline-flex md:min-h-8"
      >
        <LogIn className="size-4" aria-hidden />
        Sign in / up
      </Button>
    );
  }

  return <ClerkAuthControls />;
}

function ClerkAuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Button variant="outline" size="sm" disabled className="hidden min-h-11 px-4 sm:inline-flex md:min-h-8">
        <LogIn className="size-4" aria-hidden />
        Sign in / up
      </Button>
    );
  }

  if (isSignedIn) {
    return (
      <div className="hidden items-center sm:flex">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <SignInButton mode="modal">
        <Button variant="outline" size="sm" className="min-h-11 px-4 md:min-h-8">
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm" className="min-h-11 bg-cyan-300 px-4 text-black hover:bg-cyan-200 md:min-h-8">
          <UserPlus className="size-4" aria-hidden />
          Sign up
        </Button>
      </SignUpButton>
    </div>
  );
}
