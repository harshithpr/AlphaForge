import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { CustomCursor } from "@/components/market/custom-cursor";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apforges.vercel.app"),
  title: "AlphaForge | Market Intelligence Operating System",
  description:
    "Institutional-grade market intelligence with transparent scoring, risk controls, market state, and backtesting.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AlphaForge | Market Intelligence Operating System",
    description:
      "Institutional-grade market intelligence with transparent scoring, risk controls, market state, and backtesting.",
    url: "https://apforges.vercel.app",
    siteName: "AlphaForge",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070B14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const document = (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return document;
  }

  return <ClerkProvider>{document}</ClerkProvider>;
}
