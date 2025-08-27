import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTF Arena",
  description: "CTF Leaderboard & Challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0b1020] dark:via-[#0b0f1a] dark:to-[#0d1324]">
          <Navbar />
          <div className="mx-auto max-w-6xl px-4 py-8">
            {children}
          </div>
          <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_60%)]">
            <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>
        </div>
      </body>
    </html>
  );
}
