"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function AuthControls() {
  if (!clerkEnabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        title="Add Clerk keys to enable Google sign-in."
        className="hidden sm:inline-flex"
      >
        <LogIn className="size-4" aria-hidden />
        Sign in
      </Button>
    );
  }

  return <ClerkAuthControls />;
}

function ClerkAuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Button variant="outline" size="sm" disabled className="hidden sm:inline-flex">
        <LogIn className="size-4" aria-hidden />
        Sign in
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
    <div className="hidden items-center sm:flex">
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Button>
      </SignInButton>
    </div>
  );
}
