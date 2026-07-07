import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SimplifiedHeader from "./components/layout/SimplifiedHeader";
import SimplifiedFooter from "./components/layout/SimplifiedFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Origin — Formation for Life",
  description: "Master life's essential skills with our six universal courses designed for ages 10-45.",
};

export default function SimplifiedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <SimplifiedHeader />
          <main className="flex-1">{children}</main>
          <SimplifiedFooter />
        </div>
      </body>
    </html>
  );
}
