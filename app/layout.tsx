import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaviCraft - Craft Perfect Favicons Instantly",
  description: "Create professional favicons in all required sizes for your website. Get PNG, ICO formats with proper HTML code for browser tabs, mobile devices, and PWA support.",
  keywords: ["favicon", "generator", "icon", "website", "browser", "mobile", "PWA", "apple touch icon", "favicraft"],
  authors: [{ name: "Vinod Jangid", url: "https://github.com/vinodjangid07" }],
  creator: "Vinod Jangid",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "FaviCraft - Craft Perfect Favicons Instantly",
    description: "Create professional favicons in all required sizes for your website. Get PNG, ICO formats with proper HTML code for browser tabs, mobile devices, and PWA support.",
    url: "https://github.com/vinodjangid07/FaviCraft",
    siteName: "FaviCraft",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "FaviCraft - Professional Favicon Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaviCraft - Craft Perfect Favicons Instantly",
    description: "Create professional favicons in all required sizes for your website. Get PNG, ICO formats with proper HTML code for browser tabs, mobile devices, and PWA support.",
    images: ["/preview.png"],
    creator: "@vinodjangid07",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Standard favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

        {/* Apple Touch Icons (iOS & macOS) */}
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />

        {/* Android/Chrome (PWA) */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#8b5cf6" />

        {/* Windows 8/10/11 Tiles */}
        <meta name="msapplication-TileImage" content="/favicon-144x144.png" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6" />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
