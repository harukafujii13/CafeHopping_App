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
        router.push(callbackUrl);
      } else {
        setError('invalid email or password');
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

  return (
    <>
      <form onSubmit={onSubmit}>
        {error && <p className="text-center text-red-500 mb-3">{error}</p>}
        <div className="mb-6">
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
        <div className="mb-6">
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
          style={{ backgroundColor: `${loading ? '#F6D0CB' : '#84A59D'}` }}
          className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          disabled={loading}>
          {loading ? 'loading...' : 'Sign In'}
        </button>

        {/* <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
        <p className="text-center font-semibold mx-4 mb-0">OR</p>
      </div> */}

        {/* <a
        className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
        style={{ backgroundColor: '#3b5998' }}
        onClick={() => signIn('google', { callbackUrl })}
        role="button">
        <img
          className="pr-2"
          src="/images/google.svg"
          alt=""
          style={{ height: '2rem' }}
        />
        Continue with Google
      </a> */}
        {/* <a
        className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center"
        style={{ backgroundColor: '#55acee' }}
        onClick={() => signIn('github', { callbackUrl })}
        role="button">
        <img
          className="pr-2"
          src="/images/github.svg"
          alt=""
          style={{ height: '2.2rem' }}
        />
        Continue with GitHub
      </a> */}
      </form>
      <div className="mt-6 text-center">
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