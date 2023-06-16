import { RegisterForm } from './form';
import { RegisterFrame } from '@/components/register.component';

export default function RegisterPage() {
  return (
    // <div className="flex h-[70vh] justify-center items-center">
    //   <div>
    // <h1 className="text-7xl font-bold mb-3">Register</h1>
    <RegisterFrame>
      <RegisterForm />
    </RegisterFrame>

    //   </div>
    // </div>
  );
}
