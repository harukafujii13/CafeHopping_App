export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/profile', '/main', '/bookmark'],
};

// It can also be used to protect certain routes and redirect if a user isn't signed in.
