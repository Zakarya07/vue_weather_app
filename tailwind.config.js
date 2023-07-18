/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue, js, ts, jsx,tsx}"],
  theme: {
    // Colors
    extend: {
      colors: {
        "weather-primary": "#00668A",
        "weather-secondary": "#004E71",
      }
    },
    // Font 
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
    },
    // Container class
    container: {
      padding: "2rem", 
      center: true,
    },
    // Respsonsive (media queries)
    screens: {
      "sm": "640px",
      "md": "768px",
    },

  },
  plugins: [],
}

