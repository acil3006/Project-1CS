/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aethera: {
          ink: "#16323f",
          muted: "#5f7280",
          blue: "#177ddc",
          cyan: "#0aa6b5",
          mint: "#19a974",
          pale: "#eef8fb",
          line: "#dce9ef"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(20, 67, 87, 0.12)"
      }
    }
  },
  plugins: []
};
