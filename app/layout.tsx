import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FloatButtons from "@/components/FloatButtons";
import ClientBoot from "@/components/ClientBoot";

// Same two typefaces as the approved prototype, self-hosted at build time (no request to Google, no layout shift).
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-jakarta" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hexamind Life Sciences - Trusted Pharmaceutical & Veterinary Manufacturer",
  description:
    "GMP-certified pharmaceutical and veterinary manufacturer from Vehari, Pakistan — poultry, large animal, pet, human health and cosmetics products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <FloatButtons />
        <div id="main">{children}</div>
        <ClientBoot />
      </body>
    </html>
  );
}
