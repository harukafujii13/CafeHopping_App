import { LoginForm } from './form';

export default function LoginPage() {
  return (
    <>
      <div className="flex h-[70vh] justify-center items-center">
        <div>
          <h1 className="text-7xl font-bold mb-3">Login</h1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
