import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nerf’s Movie List — Screen Ranking',
  description:
    'Rank Nerf’s personal pool of 130 modern favorites, international landmarks, and established classics through head-to-head choices.',
  alternates: {
    canonical: '/movies/cinephile-140',
  },
  openGraph: {
    type: 'website',
    url: '/movies/cinephile-140',
    siteName: 'Screen Ranking',
    title: 'Nerf’s Movie List — Screen Ranking',
    description:
      'Rank Nerf’s personal pool of 130 modern favorites, international landmarks, and established classics through head-to-head choices.',
    images: [
      {
        url: '/social/og-nerfs-movie-list.png',
        width: 1200,
        height: 630,
        alt: 'Nerf’s Movie List — 140 Films. A Personal Canon.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nerf’s Movie List — Screen Ranking',
    description:
      'Rank Nerf’s personal pool of 130 modern favorites, international landmarks, and established classics through head-to-head choices.',
    images: ['/social/og-nerfs-movie-list.png'],
  },
};

export default function CinephileSorterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
