/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces
        clinical: "#FAFBF9", // app background — clean lab white, not stark #fff
        surface: "#FFFFFF",
        "surface-sunken": "#F1F4F1",
        ink: "#0b1f1c", // primary text — deep teal-black, not pure black
        "ink-muted": "#5B6B66",
        "ink-faint": "#94A19C",
        border: "#E3E8E4",
        // Brand — Pulse Teal (clinical trust)
        pulse: {
          50: "#EAF5F2",
          100: "#CFE9E1",
          400: "#1E8A74",
          500: "#0F6E5E",
          600: "#0B5448",
          900: "#0A2622",
        },
        // AI accent — Neural Lime (carried over from the Framer design system,
        // reserved exclusively for AI/model-generated signals)
        neural: {
          DEFAULT: "#BAFF38",
          ink: "#3C5A0B",
          50: "#F4FFE0",
        },
        // Risk signal colors — drive the BioRiskGauge + badges
        cardio: {
          50: "#FDEDEC",
          400: "#EF6F65",
          500: "#E6483D",
          600: "#B7332A",
        },
        diabete: {
          50: "#FDF3E2",
          400: "#F5BB3E",
          500: "#F2A60D",
          600: "#C2820A",
        },
      },
      fontFamily: {
        display: ["Outfit", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,31,28,0.04), 0 8px 24px -8px rgba(11,31,28,0.08)",
        ring: "0 0 0 1px rgba(15,110,94,0.08)",
      },
    },
  },
  plugins: [],
};
