import './globals.css';
import { NextAuthProvider } from './providers';
import { Inter, Rubik } from 'next/font/google';

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
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
