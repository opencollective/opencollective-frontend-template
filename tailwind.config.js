/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/hosts.ts'],
  theme: {
    extend: {
      textDecorationThickness: {
        3: '3px',
      },
      textUnderlineOffset: {
        3: '3px',
      },
      ringWidth: {
        3: '3px',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(border|bg|decoration)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|500|600)/,
      variants: ['hover', 'focus'],
    },
  ],
};
