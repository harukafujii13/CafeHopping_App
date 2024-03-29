import './globals.css';
import { NextAuthProvider } from './providers';
import { Inter, Rubik } from 'next/font/google';
import { GoogleMapsProvider } from '@/contexts/googleMapContext';
import { CafeProvider } from '@/contexts/cafeContext';

export const metadata = {
  title: 'Cafe Hopping',
  description: 'Cafe finder APP',
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter',
});

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-rubik',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable}${rubik.variable}`}>
      <body className="h-screen">
        <NextAuthProvider>
          <GoogleMapsProvider>
            <CafeProvider>{children}</CafeProvider>
          </GoogleMapsProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
