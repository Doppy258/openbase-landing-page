import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "../../public/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
});

const jetbrainsMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../../public/fonts/jbmono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/jbmono-500.woff2", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Exact – AI Code Editor Landing Page Template",
  description:
    "The AI-native code editor that gets it exactly right. No approximation. No bloat. Just perfect code, every time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
