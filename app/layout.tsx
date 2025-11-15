import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "E-Commerce Store",
    template: "%s | E-Commerce Store",
  },
  description: "Shop the latest products at great prices",
  keywords: ["e-commerce", "shopping", "products", "online store"],
  authors: [{ name: "E-Commerce Store" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-store.com",
    title: "E-Commerce Store",
    description: "Shop the latest products at great prices",
    siteName: "E-Commerce Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Store",
    description: "Shop the latest products at great prices",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
