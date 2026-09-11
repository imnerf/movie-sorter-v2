import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fan Favorites — Screen Ranking',
  description:
    'Rank 90 modern favorites, blockbusters, enduring classics, and widely loved movies through head-to-head choices.',
};

export default function FanFavoritesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
