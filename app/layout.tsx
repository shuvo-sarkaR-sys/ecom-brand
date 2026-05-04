import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'LUXE — Premium eCommerce',
    template: '%s | LUXE',
  },
  description: 'Discover curated premium products. Fast shipping, easy returns.',
  keywords: ['ecommerce', 'shopping', 'premium', 'luxury'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LUXE Store',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-cream antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#fefef9',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
              },
              success: { iconTheme: { primary: '#a8ff3e', secondary: '#1a1a2e' } },
              error: { iconTheme: { primary: '#ff6b6b', secondary: '#1a1a2e' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
