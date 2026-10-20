import type { Metadata } from "next";
import { Geist, Orbitron, Oxanium } from "next/font/google";
import Script from "next/script";
import { profile } from "@/data/site";
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

const siteUrl = "https://enriquemartinez-emc.github.io";
const title = `${profile.name} | Full-stack developer`;
const description =
  "Full-stack developer building .NET, React and PostgreSQL software. Public projects, skills and contact details.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-stack developer",
  url: siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.githubUrl],
  knowsAbout: [".NET", "C#", "React", "Next.js", "PostgreSQL", "Azure"],
}).replace(/</g, "\\u003c");

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
