import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsent } from "@/components/market/cookie-consent";
import { CustomCursor } from "@/components/market/custom-cursor";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const siteUrl = "https://apforges.vercel.app";
const siteDescription =
  "Futuristic market intelligence and global stock research platform focused on live data, sentiment, risk analysis, and advanced market insights.";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AlphaForge",
    template: "%s | AlphaForge",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AlphaForge",
    description: siteDescription,
    url: siteUrl,
    siteName: "AlphaForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AlphaForge market intelligence social preview with finance charts and AI signal lines.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaForge",
    description: siteDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return document;
  }

  return <ClerkProvider>{document}</ClerkProvider>;
}
