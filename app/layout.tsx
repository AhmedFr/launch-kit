import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { WizardProvider } from "@/lib/wizard/WizardProvider";
import { AppHeader } from "@/components/brand/AppHeader";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata: Metadata = {
  title: "Launch Kit — your launch, ready to ship",
  description:
    "Turn a project folder into a complete launch kit: copy, gallery, video storyboard, and launch ops.",
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
        <WizardProvider>
          <AppHeader />
          <main className="flex-1 py-8">{children}</main>
        </WizardProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
