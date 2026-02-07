import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display, Sora } from "next/font/google";
import LenisProvider from "@/providers/LenisProvider";
import SnowCursorTrail from "@/components/ui/SnowCursorTrail";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shnow Motorsports | Precision. Power. Victory.",
  description:
    "At Shnow Motorsports, we live for the thrill of the challenge. With NFL athlete Dion Dawkins at the helm, we're a drift team built on precision, power, and a relentless pursuit of victory.",
  openGraph: {
    title: "Shnow Motorsports | Precision. Power. Victory.",
    description:
      "A drift team built on precision, power, and a relentless pursuit of victory. Led by NFL athlete Dion Dawkins.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${playfair.variable} ${sora.variable}`}>
      <body className="font-[family-name:var(--font-inter)]">
        <SnowCursorTrail />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
