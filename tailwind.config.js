/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        Mont: ["Montserrat"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
}

