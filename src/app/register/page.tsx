import { RegisterForm } from './form';

export default function RegisterPage() {
  return (
    <div className="flex h-[70vh] justify-center items-center">
      <div>
        <h1 className="text-7xl font-bold mb-3">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
