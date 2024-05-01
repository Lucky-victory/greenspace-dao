/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/flowbite/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // ...colors,
        primaryGreen: "#014421",
        primaryBeige: "#F5F5DC",
        primaryYellow: "#EEC438",
        primaryYellowTrans: "rgba(238, 196, 56, 0.2)",
        primaryGray: "#3C4142",
        secondaryGray: "#A8ABAC",
      },
    },
  },
};
export default config;
