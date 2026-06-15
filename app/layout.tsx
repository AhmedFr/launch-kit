import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Launch Kit — Product Hunt post generator",
  description: "Turn a project folder into a complete Product Hunt launch kit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
