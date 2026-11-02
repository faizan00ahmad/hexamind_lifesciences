import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import FloatButtons from "@/components/FloatButtons";
import ClientBoot from "@/components/ClientBoot";

export const metadata: Metadata = {
  title: "Hexamind Life Sciences - Trusted Pharmaceutical & Veterinary Manufacturer",
  description:
    "GMP-certified pharmaceutical and veterinary manufacturer from Vehari, Pakistan — poultry, large animal, pet, human health and cosmetics products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <FloatButtons />
        {children}
        <ClientBoot />
      </body>
    </html>
  );
}
