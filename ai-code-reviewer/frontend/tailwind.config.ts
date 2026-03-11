import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "monospace"], rounded: ["var(--font-rounded)", "sans-serif"] },
      colors: {
        bg: "var(--bg)",
        "bg-secondary": "var(--bg-secondary)",
        card: "var(--card)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: { DEFAULT: "var(--accent)", dark: "var(--accent-dark)" },
        success: "var(--success)",
        warn: "var(--warn)",
        error: "var(--error)",
        surface: { DEFAULT: "var(--card)", light: "var(--border)" },
        /* Code review semantic */
        "review-bug": "var(--review-bug)",
        "review-security": "var(--review-security)",
        "review-success": "var(--review-success)",
        codemind: {
          bg: "var(--codemind-bg)",
          white: "var(--codemind-white)",
          lime: "var(--codemind-lime)",
          muted: "var(--codemind-muted)",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #22c55e, #06b6d4, #3b82f6)",
      },
    },
  },
  plugins: [],
};
export default config;
