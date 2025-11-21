/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: Set the content path to include your Next.js 'src' folder
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mint-neon': '#9acd32', 
      },
    },
  },
  plugins: [],
}