import type { Metadata } from 'next';
import { Space_Grotesk, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/ui/ReduxProvider';
import VideoBackground from '@/components/layout/VideoBackground';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/ui/CookieConsent';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkinVault — CS2 Skins Marketplace',
  description: 'Buy and sell CS2 skins safely on SkinVault. 10,000+ skins, instant delivery.',
  icons: { icon: '/images/logo-aim.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0e1a' }}>
        <ReduxProvider>
          {/* Fixed video background */}
          <VideoBackground />

          {/* Animated tech grid */}
          <div
            className="fixed inset-0 pointer-events-none tech-grid-bg z-0"
            style={{ opacity: 0.06 }}
          />

          {/* Content layers */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <CookieConsent />
        </ReduxProvider>
      </body>
    </html>
  );
}
