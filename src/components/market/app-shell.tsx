"use client";

import Link from "next/link";
import { BarChart3, Bell, BrainCircuit, Menu, Search, Star, UserRound } from "lucide-react";
import { AlphaForgeMark, AlphaForgeWordmark } from "@/components/market/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Disclaimer } from "@/components/market/disclaimer";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/screener", label: "Screener", icon: Search },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/ai-explain", label: "AI Explain", icon: BrainCircuit },
  { href: "/about", label: "About", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-3" aria-label="AlphaForge AI home">
            <AlphaForgeMark className="size-8" />
            <AlphaForgeWordmark className="max-[390px]:hidden" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {nav.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Alerts">
                  <Bell className="size-4" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Meaningful signal alerts</TooltipContent>
            </Tooltip>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation">
                  <Menu className="size-4" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <AlphaForgeMark className="size-8" />
                    <AlphaForgeWordmark />
                  </SheetTitle>
                  <SheetDescription>Primary navigation</SheetDescription>
                </SheetHeader>
                <div className="mt-6 grid gap-2">
                  {nav.map((item) => (
                    <Button key={item.href} asChild variant="ghost" className="justify-start">
                      <Link href={item.href}>
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Disclaimer />
    </div>
  );
}
