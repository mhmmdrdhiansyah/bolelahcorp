import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Bolehah Corp - IT Solutions & Web Development",
  description: "Professional IT services company specializing in WordPress, PHP, Next.js, and full-stack web development with 5+ years of experience.",
  keywords: ["web development", "IT services", "WordPress", "PHP", "Next.js", "full-stack", "Bolehah Corp"],
  authors: [{ name: "Bolehah Corp" }],
  openGraph: {
    title: "Bolehah Corp - IT Solutions & Web Development",
    description: "Professional IT services company specializing in WordPress, PHP, Next.js, and full-stack web development with 5+ years of experience.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolehah Corp - IT Solutions & Web Development",
    description: "Professional IT services company specializing in WordPress, PHP, Next.js, and full-stack web development with 5+ years of experience.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
