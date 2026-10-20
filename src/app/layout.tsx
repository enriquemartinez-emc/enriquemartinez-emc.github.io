import type { Metadata } from "next";
import { Geist, Orbitron, Oxanium } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  display: "swap",
});
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enrique Martinez | Full-stack developer",
  description: "A scroll journey through Enrique Martinez's software work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${oxanium.variable} ${orbitron.variable}`}
      >
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="aedd3fdc-c7cd-4840-87f0-b89c1fed95ea"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
