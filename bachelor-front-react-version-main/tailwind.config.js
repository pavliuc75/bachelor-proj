/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "var(--dark-blue)",
        "havelock-blue": "var(--havelock-blue)",
        "mid-gray": "var(--mid-gray)",
        "spun-pearl": "var(--spun-pearl)",
        "white-lilac": "var(--white-lilac)",
        "background-error": "rgba(200, 0, 0, 0.33)",
        "background-warning": "rgba(255, 255, 0, 0.33)",
        "background-success": "rgba(0, 200, 0, 0.33)",
        // background: "rgba(92,122,216,0.33)",
        background: "rgba(93, 160, 215, 0.33)",
        cinder: "var(--cinder)",
        error: "var(--error)",
      },
      lineHeight: {
        171: "1.71",
        157: "1.57",
        150: "1.5",
        145: "1.45",
        133: "1.33",
      },
    },
  },
  plugins: [],
};
