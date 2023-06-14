'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

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
    'form-control block w-full px-4 py-5 mb-6 text-sm font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded focus:outline-none';

  const button_style =
    'inline-block px-7 py-4 mb-4 text-white font-medium text-sm leading-snug uppercase rounded transition duration-150 ease-in-out w-full';

  return (
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
          loading ? 'bg-[#ccc]' : 'bg-blue-600 hover:bg-blue-700'
        } ${button_style}`}
        disabled={loading}>
        {loading ? 'loading...' : 'Register'}
      </button>
      <Link
        href="/"
        className={`${'bg-red-600 hover:bg-red-700 text-center'} ${button_style}`}>
        Home
      </Link>
    </form>
  );
};
