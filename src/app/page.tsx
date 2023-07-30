import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LoginPage from './login/page';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <div>
        <LoginPage />
      </div>
    </main>
  );
}

//memo1
//session: The getServerSession function is called to retrieve the server session
//using the provided authOptions. The resulting session object is stored in the session variable.
