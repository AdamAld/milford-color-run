import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Milford Sources of Strength Color Run 5K | May 2, 2026",
  description:
    "Join Milford High School's Sources of Strength for a colorful 5K run at Miami Meadows Park. Run for strength, celebrate in color! May 2, 2026 at 10:00 AM.",
  keywords: [
    "color run",
    "5K",
    "Milford",
    "Sources of Strength",
    "mental health",
    "fundraiser",
    "Miami Meadows Park",
    "Ohio",
  ],
  authors: [{ name: "Milford High School Sources of Strength" }],
  openGraph: {
    title: "Milford Sources of Strength Color Run 5K",
    description:
      "Run for strength, celebrate in color! Join us May 2, 2026 at Miami Meadows Park.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to map tile CDN for faster map loading */}
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://c.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
