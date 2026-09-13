import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://screenranking.com'),
  title: 'Screen Ranking — Make the List Yours',
  description:
    'Head-to-head sorting games for movies, television, and everything worth ranking.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Screen Ranking',
    title: 'Screen Ranking — Make the List Yours',
    description:
      'Head-to-head sorting games for movies, television, and everything worth ranking.',
    images: [
      {
        url: '/social/og-home-v2.png',
        width: 1200,
        height: 630,
        alt: 'Screen Ranking — Make the List Yours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Screen Ranking — Make the List Yours',
    description:
      'Head-to-head sorting games for movies, television, and everything worth ranking.',
    images: ['/social/og-home-v2.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
