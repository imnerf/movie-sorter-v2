import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Screen Ranking — Make the List Yours',
  description:
    'Head-to-head sorting games for movies, television, and everything worth ranking.',
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
