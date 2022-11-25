/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /(border|bg|text|decoration)-(indigo|pink|orange|green|cyan|teal|blue|purple|rose|amber)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover'],
    },
  ],
};
