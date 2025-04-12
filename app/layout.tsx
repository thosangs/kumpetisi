import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Kumpetisi - Bracket Competition Management",
    template: "%s | Kumpetisi",
  },
  description:
    "The ultimate platform for organizing and managing pushbike race competitions with ease.",
  keywords: [
    "competition",
    "bracket",
    "pushbike",
    "race",
    "management",
    "tournament",
  ],
  authors: [
    {
      name: "Kumpetisi Team",
    },
  ],
  creator: "Kumpetisi Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kumpetisi.vercel.app",
    title: "Kumpetisi - Bracket Competition Management",
    description:
      "The ultimate platform for organizing and managing pushbike race competitions with ease.",
    siteName: "Kumpetisi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumpetisi - Bracket Competition Management",
    description:
      "The ultimate platform for organizing and managing pushbike race competitions with ease.",
    creator: "@kumpetisi",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
