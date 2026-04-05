import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeToggle } from "@/frontend/components/theme-toggle";
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
  title: "Shortener-Paste",
  description: "Shorten links & share text instantly :)",
  metadataBase: new URL(
    process.env.BASE_URL || "https://url.stephen-ali.com"
  ),
  openGraph: {
    title: "Shortener-Paste",
    description: "Shorten links & share text instantly :)",
    url: "/",
    siteName: "Shortener-Paste",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shortener-Paste",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shortener-Paste",
    description: "Shorten links & share text instantly :)",
    images: ["/og-image.png"],
  },
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    var d;
    if (t === 'light' || t === 'dark') {
      d = t === 'dark';
    } else {
      d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    document.documentElement.classList.toggle('dark', d);
    document.documentElement.classList.toggle('light', !d);
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
