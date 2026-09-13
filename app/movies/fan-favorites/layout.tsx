import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fan Favorites — Screen Ranking',
  description:
    'Rank 90 modern favorites, blockbusters, enduring classics, and widely loved movies through head-to-head choices.',
  alternates: {
    canonical: '/movies/fan-favorites',
  },
  openGraph: {
    type: 'website',
    url: '/movies/fan-favorites',
    siteName: 'Screen Ranking',
    title: 'Fan Favorites — Screen Ranking',
    description:
      'Rank 90 modern favorites, blockbusters, enduring classics, and widely loved movies through head-to-head choices.',
    images: [
      {
        url: '/social/og-fan-favorites-v2.png',
        width: 1200,
        height: 630,
        alt: 'Fan Favorites — 90 Movies. One Ranking.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fan Favorites — Screen Ranking',
    description:
      'Rank 90 modern favorites, blockbusters, enduring classics, and widely loved movies through head-to-head choices.',
    images: ['/social/og-fan-favorites-v2.png'],
  },
};

export default function FanFavoritesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
