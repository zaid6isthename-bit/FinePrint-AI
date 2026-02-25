import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinePrint AI - Legal Agreement Risk Analyzer",
  description: "Detect hidden clauses and get a risk score from user-uploaded legal agreements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground bg-[#0a0a0a]`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
