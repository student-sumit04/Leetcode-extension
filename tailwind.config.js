/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        leetcode: '#1f1f1f',
        accent: '#ffa116',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
