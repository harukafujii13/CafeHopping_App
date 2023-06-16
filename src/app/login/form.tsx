'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: '', password: '' });

      const res = await signIn('credentials', {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push('/main');
      } else {
        setError('Invalid email or password');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const input_style =
    'form-control block w-[15rem] h-[3rem] px-4 py-5 text-sm font-normal text-primary-gray bg-white bg-clip-padding border border-solid border-gray-400 rounded transition ease-in-out m-0 focus:text-primary-gray focus:bg-white focus:border-blue-600 focus:outline-none';

  const button_style =
    'inline-block px-7 py-4 mb-4 text-white font-medium text-sm leading-snug uppercase rounded transition duration-150 ease-in-out w-full';

  return (
    <>
      <form onSubmit={onSubmit}>
        {error && <p className="text-center text-red-500 mb-3">{error}</p>}
        <div className="mb-5">
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email address"
            className={`${input_style}`}
          />
        </div>
        <div className="mb-5">
          <input
            required
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className={`${input_style}`}
          />
        </div>
        <button
          type="submit"
          className={`${
            loading ? 'bg-[#ccc]' : 'bg-primary-green hover:bg-[#C4D4D0]'
          } ${button_style}`}
          disabled={loading}>
          {loading ? 'loading...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-2 text-center">
        <p className="text-[1rem] font-bold text-primary-gray">
          You don't have an account?
        </p>
        <h1
          onClick={handleSignUp}
          style={{ cursor: 'pointer', color: 'primary-coral' }}
          className="text-[1.2rem] font-bold text-primary-coral cursor-pointer underline">
          SIGN UP
        </h1>
      </div>
    </>
  );
};
