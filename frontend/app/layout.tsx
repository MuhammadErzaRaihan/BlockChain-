import type { Metadata } from "next";
import { Geist, Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const ibmPlexMono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TrustLink - Proof of Existence",
  description: "Cryptographically secure your high-value documents on-chain.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${syne.variable} ${ibmPlexMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

