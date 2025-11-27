/**
 * Root layout for the entire application
 * Handles global styles and metadata
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bank Sampah Kelurahan Pekayon - Warga",
  description: "Aplikasi Bank Sampah untuk Warga Kelurahan Pekayon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
