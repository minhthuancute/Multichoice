const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const baseColors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/assets/images/bg-login.jpg')",
      },
    },
    colors: {
      ...baseColors,
      primary: '#1e85ff',
      black: '#1c2437',
    },
  },
  plugins: [],
};
