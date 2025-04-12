import { Inter } from "next/font/google";
import localFont from "next/font/local";

// If using Google Fonts
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Geist fonts
export const geist = localFont({
  src: "../public/fonts/GeistVF.woff",
  display: "swap",
  variable: "--font-geist",
});

export const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  display: "swap",
  variable: "--font-geist-mono",
});
