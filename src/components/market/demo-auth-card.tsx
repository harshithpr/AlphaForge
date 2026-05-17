"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const demoUserKey = "alphaforge-demo-user";
const demoAuthKey = "alphaforge-demo-auth";
const cookieMaxAge = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax${secure}`;
}

function redirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get("redirect_url");

  if (target && target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }

  return "/dashboard";
}

function sendLoginEmail(user: { name: string; email: string }) {
  void fetch("/api/auth/demo-login-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    keepalive: true,
  }).catch(() => {
    // Email is a best-effort confirmation and should never block sign-in.
  });
}

export function DemoAuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    const user = {
      name: name.trim() || cleanEmail.split("@")[0] || "AlphaForge user",
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    };
    const serializedUser = JSON.stringify(user);

    window.localStorage.setItem(demoUserKey, serializedUser);
    setCookie(demoAuthKey, "1");
    setCookie(demoUserKey, serializedUser);
    window.dispatchEvent(new Event("alphaforge-demo-auth"));
    sendLoginEmail(user);
    router.push(redirectTarget());
  }

  const isSignUp = mode === "sign-up";

  return (
    <section className="w-full max-w-md rounded-lg border border-white/10 bg-[#0E1628]/80 p-6">
      <h1 className="text-2xl font-semibold">
        {isSignUp ? "Create your AlphaForge account" : "Sign in to AlphaForge"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Clerk keys are not configured on this deployment yet, so this creates a local demo session
        on this device. Add Clerk environment variables in Vercel to enable real Google sign-in.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        {isSignUp ? (
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button className="min-h-11 bg-cyan-300 text-black hover:bg-cyan-200" type="submit">
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
      </form>
    </section>
  );
}
