import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const DESCRIPTION =
  "Turn any project folder into launch-ready posts tailored to each audience — Product Hunt, Hacker News, Reddit, and AppSumo. Copy, gallery shots, a video storyboard, and a launch-day plan.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Launch Kit — your repo, launch-ready",
    template: "%s · Launch Kit",
  },
  description: DESCRIPTION,
  applicationName: "Launch Kit",
  authors: [{ name: "Ahmed Abouelleil" }],
  creator: "Ahmed Abouelleil",
  keywords: [
    "product launch",
    "launch kit",
    "Product Hunt",
    "Hacker News",
    "Show HN",
    "Reddit",
    "AppSumo",
    "lifetime deal",
    "indie hackers",
    "makers",
  ],
  openGraph: {
    type: "website",
    siteName: "Launch Kit",
    title: "Launch Kit — your repo, launch-ready",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Kit — your repo, launch-ready",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
