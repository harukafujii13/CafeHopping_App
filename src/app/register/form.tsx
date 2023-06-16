'use client';

import { signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';

export const RegisterForm = () => {
  let [loading, setLoading] = useState(false);
  let [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      if (!res.ok) {
        alert((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: '/' });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      alert(error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    'form-control block w-[15rem] h-[3rem] px-4 py-5 text-sm font-normal text-primary-gray bg-white bg-clip-padding border border-solid border-gray-400 rounded transition ease-in-out m-0 focus:text-primary-gray focus:bg-white focus:border-blue-600 focus:outline-none mb-6';

  const button_style =
    'inline-block px-7 py-4 mb-4 text-white font-medium text-sm leading-snug uppercase rounded transition duration-150 ease-in-out w-full';

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-lg row-gap-10">
        <input
          required
          type="text"
          name="name"
          placeholder="Name"
          value={formValues.name}
          onChange={handleChange}
          className={input_style}
        />

        <input
          required
          type="email"
          name="email"
          placeholder="Email address"
          value={formValues.email}
          onChange={handleChange}
          className={input_style}
        />

        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          value={formValues.password}
          onChange={handleChange}
          className={input_style}
        />
        <button
          className={`${
            loading ? 'bg-[#ccc]' : 'bg-primary-coral hover:bg-primary-rose'
          } ${button_style}`}
          disabled={loading}>
          {loading ? 'loading...' : 'Register'}
        </button>
        {/* <Link
        href="/"
        className={`${'bg-red-600 hover:bg-red-700 text-center'} ${button_style}`}>
        Home
      </Link> */}
      </form>
      <div className="mt-2 text-center">
        <p className="text-[1rem] font-bold text-primary-gray">
          You already have an account?
        </p>
      </div>
      <Link href="/login">
        <h1 className="cursor-pointer text-[1.2rem] font-bold text-primary-green cursor-pointer underline">
          LOG IN
        </h1>
      </Link>
    </>
  );
};
