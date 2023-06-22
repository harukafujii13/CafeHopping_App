import {
  LoginButton,
  LogoutButton,
  RegisterButton,
  ProfileButton,
} from '@/components/buttons.component';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/components/user.component';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex justify-center items-center h-[70vh]">
      <div>
        <LoginButton />
        <RegisterButton />
        <ProfileButton />
        <LogoutButton />
        <h1 className="text-7xl font-bold mb-3">Server Session</h1>
        <code>{JSON.stringify(session)}</code>
        <User />
      </div>
    </main>
  );
}

//memo1
//session: The getServerSession function is called to retrieve the server session
//using the provided authOptions. The resulting session object is stored in the session variable.
