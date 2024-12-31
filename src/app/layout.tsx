import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/NavBar/Navbar";

// import {
//   ClerkProvider,
//   SignInButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin | Great Rift Run",
  description: "Admin control of the main website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="icon"
            type="image/png"
            href="/favicon/favicon-96x96.png"
            sizes="96x96"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <meta name="apple-mobile-web-app-title" content="Great Rift Run" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} relative z-0 antialiased`}
        >
          <Navbar />
          <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
