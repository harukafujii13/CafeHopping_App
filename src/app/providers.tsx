'use client';

import { SessionProvider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

//memo1
//The NextAuthProvider component is a functional component that takes in the children prop
//and returns the SessionProvider component with the children prop passed as its content.
//This effectively wraps the child components with the session management capabilities provided
//by SessionProvider.

//By using the NextAuthProvider component and placing it higher up in the component hierarchy
//of a Next.js application, you can ensure that all child components have access to session-related
//data and authentication features provided by SessionProvider. This allows for easy management of
//user sessions and authentication within your Next.js application.
