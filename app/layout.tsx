import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ============================================================================
// Fonts
// ============================================================================

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: "Bolehah Corp - Portfolio & Blog",
  description: "Professional portfolio and tech blog by Muhammad Ardhiansyah",
  keywords: ["portfolio", "blog", "web development", "full-stack developer"],
  authors: [{ name: "Muhammad Ardhiansyah" }],
  openGraph: {
    title: "Bolehah Corp - Portfolio & Blog",
    description: "Professional portfolio and tech blog by Muhammad Ardhiansyah",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolehah Corp - Portfolio & Blog",
    description: "Professional portfolio and tech blog by Muhammad Ardhiansyah",
  },
};

// ============================================================================
// Root Layout
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-navy text-off-white">
        {children}
      </body>
    </html>
  );
}
