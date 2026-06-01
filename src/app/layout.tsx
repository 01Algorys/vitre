import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cherif Ouali — Photographer",
  description:
    "Photographer & visual artist based in Tunisia and Paris. When photography is not all about just taking photos, but telling a story.",
  keywords: ["photographer", "photography", "portfolio", "wedding", "portrait", "Tunisia", "Paris", "Cherif Ouali"],
  openGraph: {
    title: "Cherif Ouali — Photographer",
    description: "When photography is not all about just taking photos, but telling a story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
        <LoadingScreen />
        <CustomCursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
