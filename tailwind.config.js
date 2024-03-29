/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    maxWidth: {
      container: '1440px',
      contentContainer: '1140px',
      containerSmall: '1024px',
      containerxs: '768px',
    },
    extend: {
      colors: {
        'primary-gray': '#52525b',
        'primary-yellow': '#F6BD60',
        'primary-coral': '#F28482',
        'primary-green': '#84A59D',
        'primary-rose': '#F5CAC3',
        'deep-rose': '#F3C0B9',
        'light-green': '#95B1AA',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        rubik: ['var(--font-rubik)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  plugins: [require('flowbite/plugin')],
};
