'use client';

import { useSession } from 'next-auth/react';

export const User = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="text-7xl font-bold mb-3">Client Session</h1>
      <code>{JSON.stringify(session)}</code>
    </>
  );
};
