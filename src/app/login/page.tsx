import { LoginForm } from './form';
import Googlemap from '@/components/googlemap.component';

export default function LoginPage() {
  return (
    <>
      <div className="flex h-[70vh] justify-center items-center">
        <div>
          <h1 className="text-7xl font-bold mb-3">Login</h1>
          <LoginForm />
          <Googlemap />
        </div>
      </div>
    </>
  );
}
