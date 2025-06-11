import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Web3Provider } from "@/contexts/Web3Context";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arena Social Media",
  description: "A Web3-powered social media platform with wallet authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <Web3Provider>
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </Web3Provider>
        </Providers>
      </body>
    </html>
  );
}
