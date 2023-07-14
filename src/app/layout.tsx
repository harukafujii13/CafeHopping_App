import './globals.css';
import { NextAuthProvider } from './providers';
import { Roboto } from 'next/font/google';

export const metadata = {
  title: 'Cafe Hopping',
  description: 'Cafe finder APP',
};
//The metadata object contains information about the application,
//such as the title and description. It can be used for SEO purposes or any other metadata-related functionality.

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={roboto.className}>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
