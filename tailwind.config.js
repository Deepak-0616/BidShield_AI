/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F5F7FA",
        foreground: "#17202A",
        primary: {
          DEFAULT: "#0B3A5B",
          foreground: "#FFFFFF",
          hover: "#082C46",
        },
        secondary: {
          DEFAULT: "#1261A0",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F4B400",
          foreground: "#17202A",
        },
        success: {
          DEFAULT: "#138A4B",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#D98200",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#C62828",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#64748B",
          foreground: "#F1F5F9",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#17202A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'enterprise': '0 4px 20px -2px rgba(11, 58, 91, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(11, 58, 91, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
