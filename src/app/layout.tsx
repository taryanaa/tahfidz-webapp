import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Monitoring Tahfidz",
  description: "Sistem monitoring dan pelaporan progres hafalan Al-Qur'an santri pesantren",
  keywords: ["Tahfidz", "Monitoring", "Hafalan", "Qur'an", "Pesantren"],
  authors: [{ name: "Tim Pengembang" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sistem Monitoring Tahfidz",
    description: "Sistem monitoring dan pelaporan progres hafalan Al-Qur'an santri pesantren",
    url: "/",
    siteName: "Sistem Monitoring Tahfidz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem Monitoring Tahfidz",
    description: "Sistem monitoring dan pelaporan progres hafalan Al-Qur'an santri pesantren",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
