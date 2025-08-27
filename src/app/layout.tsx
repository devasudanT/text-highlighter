import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Text Highlighter - Highlight and Annotate Text Online",
  description: "An online text highlighter application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui for easy text annotation and sharing.",
  keywords: ["text highlighter", "annotate text", "online highlighter", "web highlighter", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "devasudan" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Text Highlighter",
    description: "Highlight and annotate text online",
    url: "https://text-highlighter.example.com",
    siteName: "Text Highlighter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Highlighter",
    description: "Highlight and annotate text online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
