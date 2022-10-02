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
    container: {
      center: true,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      tiny: '0.9375rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      backgroundImage: {
        authen: "url('/assets/images/bg-login.jpg')",
        notfound: "url('/assets/images/pagenotfound.png')",
        exam: "url('/assets/images/bg-exam.jpg')",
        doexam: "url('/assets/images/bg_do_exam.jpeg')",
      },
      flex: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
      },
    },
    colors: {
      ...baseColors,
      primary: {
        800: '#28c6d7',
        900: '#24b2c2',
      },
      secondary: {
        200: '#C4D7E0',
        700: '#f1f2f6',
        800: '#256D85',
      },
    },
    screens: {
      xs: '0',
      // => @media (max-width: 640px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
