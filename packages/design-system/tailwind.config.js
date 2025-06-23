/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  presets: [],
  plugins: [require("flowbite/plugin")],
  // Enable CSS modules
  cssModules: {
    // Use a more specific class naming pattern for better debugging
    pattern: "[local]_[hash:base64:5]",
  },
};
