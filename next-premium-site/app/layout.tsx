import type { Metadata } from 'next';
import { Sora, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Premium Personal Interface',
  description: 'A premium, minimal, content-first personal website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${plexSans.variable} bg-bg text-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
