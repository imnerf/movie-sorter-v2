import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Screen Ranking — Rank Your Favorite Films',
  description:
    'Choose between two movies at a time and discover your definitive personal ranking.',
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
