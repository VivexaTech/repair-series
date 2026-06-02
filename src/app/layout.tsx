import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Repair Series",
    template: "%s · Repair Series",
  },
  description:
    "Book trusted home repair services. Choose a service, pick a slot, and track your booking end-to-end.",
  metadataBase: new URL("https://repairseries.example"),
  openGraph: {
    type: "website",
    siteName: "Repair Series",
    title: "Repair Series",
    description:
      "Book trusted home repair services. Choose a service, pick a slot, and track your booking end-to-end.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Series",
    description:
      "Book trusted home repair services. Choose a service, pick a slot, and track your booking end-to-end.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
