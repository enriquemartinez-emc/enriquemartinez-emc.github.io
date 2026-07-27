import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Enrique Martinez | Full-stack developer",
  description: "A scroll journey through Enrique Martinez's software work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="aedd3fdc-c7cd-4840-87f0-b89c1fed95ea" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
