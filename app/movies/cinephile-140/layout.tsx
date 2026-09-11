import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Cinephile List — Screen Ranking',
  description:
    'Rank 140 modern favorites, international landmarks, and established classics through head-to-head choices.',
};

export default function CinephileSorterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
