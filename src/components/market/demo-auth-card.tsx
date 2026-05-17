"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const demoUserKey = "alphaforge-demo-user";

export function DemoAuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    window.localStorage.setItem(
      demoUserKey,
      JSON.stringify({
        name: name.trim() || cleanEmail.split("@")[0] || "AlphaForge user",
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      })
    );
    window.dispatchEvent(new Event("alphaforge-demo-auth"));
    router.push("/dashboard");
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
              placeholder="Harshith Praveen"
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
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
