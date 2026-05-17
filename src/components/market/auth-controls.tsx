"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const demoUserKey = "alphaforge-demo-user";
const demoAuthKey = "alphaforge-demo-auth";

type DemoUser = {
  name: string;
  email: string;
};

export function AuthControls() {
  if (!clerkEnabled) {
    return <DemoAuthControls />;
  }

  return <ClerkAuthControls />;
}

function readDemoUser(): DemoUser | null {
  try {
    const raw = window.localStorage.getItem(demoUserKey);
    if (raw) return JSON.parse(raw) as DemoUser;

    const cookieUser = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${demoUserKey}=`))
      ?.split("=")[1];

    return cookieUser ? (JSON.parse(decodeURIComponent(cookieUser)) as DemoUser) : null;
  } catch {
    return null;
  }
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function DemoAuthControls() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const update = () => setUser(readDemoUser());
    const id = window.setTimeout(update, 0);
    window.addEventListener("storage", update);
    window.addEventListener("alphaforge-demo-auth", update);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("storage", update);
      window.removeEventListener("alphaforge-demo-auth", update);
    };
  }, []);

  if (user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <span className="max-w-32 truncate text-xs text-muted-foreground" title={user.email}>
          {user.name || user.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 px-4 md:min-h-8"
          onClick={() => {
            window.localStorage.removeItem(demoUserKey);
            clearCookie(demoAuthKey);
            clearCookie(demoUserKey);
            window.dispatchEvent(new Event("alphaforge-demo-auth"));
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <Button asChild variant="outline" size="sm" className="min-h-11 px-4 md:min-h-8">
        <Link href="/sign-in">
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Link>
      </Button>
      <Button asChild size="sm" className="min-h-11 bg-cyan-300 px-4 text-black hover:bg-cyan-200 md:min-h-8">
        <Link href="/sign-up">
          <UserPlus className="size-4" aria-hidden />
          Sign up
        </Link>
      </Button>
    </div>
  );
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
