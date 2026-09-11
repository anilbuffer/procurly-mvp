import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { UnifiedDataProvider } from "@/context/unified-data-context";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Procurly | Unified Autohub Admin & Customer Platform",
  description: "Procurly — Unified B2B Automotive Procurement Platform built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          <UnifiedDataProvider>{children}</UnifiedDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
