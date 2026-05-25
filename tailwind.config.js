/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f1e3",
        ink: "#1f2933",
        ember: "#b24a2d",
        forest: "#244b3c",
        clay: "#d9b48f",
        mist: "#f4eee6"
      },
      fontFamily: {
        sans: ["'Noto Sans Thai'", "sans-serif"],
        display: ["'Noto Sans Thai'", "sans-serif"],
        body: ["'Noto Sans Thai'", "sans-serif"]
      },
      boxShadow: {
        card: "0 16px 40px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};
