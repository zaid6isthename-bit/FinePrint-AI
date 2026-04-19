import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import MouseHalo from "@/components/MouseHalo";
import ParticlePixelGrid from "@/components/ParticlePixelGrid";
import { AppProviders } from "@/components/providers";
import MobileNavbar from "@/components/MobileNavbar"; // Added this import

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  style: ["normal", "italic"]
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Barrister AI - Legal Agreement Risk Analyzer",
  description: "Detect hidden clauses and get a risk score from user-uploaded legal agreements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorantGaramond.variable} ${dmMono.variable} font-sans min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <AppProviders>
            <div className="hidden md:block">
              <ParticlePixelGrid />
              <MouseHalo />
            </div>
            <Navbar />
            {children}
            <MobileNavbar />
            <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
