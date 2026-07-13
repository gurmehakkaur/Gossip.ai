import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gossip.ai",
  description: "Your AI best friend — here to listen, hype, and keep it real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#080808" }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
