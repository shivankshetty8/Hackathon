import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Certified USCIS Translations in 100+ Languages - Verdacert',
  description:
    'Native-speaker review on every document. Delivered in 14–48 hours. 100% USCIS acceptance guaranteed per 8 CFR § 103.2(b)(3).',
  icons: {
    icon: '/favicon.ico',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF6F0] text-[#121214] font-sans antialiased selection:bg-[#FED7AA] selection:text-[#7C2D12]">
        {children}
      </body>
    </html>
  );
}
