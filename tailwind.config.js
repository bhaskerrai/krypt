/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './app/**/*.{html,js,jsx}',
//     './pages/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{html,js,jsx}',
//     './sections/**/*.{html,js,jsx}',
//     './styles/**/*.{js,jsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./public/index.html",
    './app/**/*.{html,js,jsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{html,js,jsx}',
    './sections/**/*.{html,js,jsx}',
    './styles/**/*.{js,jsx}',
  ],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      screens: {
        mf: "990px",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};