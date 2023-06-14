import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Profile() {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect('/');
  // }

  return (
    <main className="flex justify-center items-center h-[70vh]">
      <h1 className="text-7xl font-bold mb-3">Profile Page</h1>
    </main>
  );
}
