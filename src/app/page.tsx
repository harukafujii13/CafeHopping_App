import {
  LoginButton,
  LogoutButton,
  RegisterButton,
  ProfileButton,
} from '@/components/buttons.components';

export default function Home() {
  return (
    <main className="flex justify-center items-center h-[70vh]">
      <LoginButton />
      <RegisterButton />
      <ProfileButton />
      <LogoutButton />
    </main>
  );
}
