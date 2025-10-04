import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      h1: [
        "48px",
        {
          lineHeight: "48px",
          letterSpacing: "-2px",
          fontWeight: "700",
        },
      ],
      h2: [
        "30px",
        {
          lineHeight: "36px",
          letterSpacing: "-1.5px",
          fontWeight: "600",
        },
      ],
      h3: [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "-1px",
          fontWeight: "600",
        },
      ],
      h4: [
        "20px",
        {
          lineHeight: "28px",
          letterSpacing: "-1px",
          fontWeight: "600",
        },
      ],
      large: [
        "18px",
        {
          lineHeight: "28px",
          fontWeight: "600",
        },
      ],
      lead: [
        "20px",
        {
          lineHeight: "28px",
          letterSpacing: "-1px",
          fontWeight: "600",
        },
      ],
      p: [
        "16px",
        {
          lineHeight: "28px",
          fontWeight: "400",
        },
      ],
      p_ui: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      p_ui_medium: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "500",
        },
      ],
      list: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      body: [
        "14px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      body_medium: [
        "14px",
        {
          lineHeight: "24px",
          fontWeight: "500",
        },
      ],
      subtle: [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: "400",
        },
      ],
      subtle_medium: [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: "500",
        },
      ],
      subtle_semibold: [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: "600",
        },
      ],
      small: [
        "14px",
        {
          lineHeight: "14px",
          fontWeight: "500",
        },
      ],
      detail: [
        "12px",
        {
          lineHeight: "20px",
          fontWeight: "500",
        },
      ],
      badge: [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: "600",
        },
      ],
      blockquote: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      table_head: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "700",
        },
      ],
      table_item: [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      kb_shortcut: [
        "12px",
        {
          lineHeight: "20px",
          letterSpacing: "1px",
          fontWeight: "400",
        },
      ],
      card_title: [
        "24px",
        {
          lineHeight: "24px",
          letterSpacing: "-1px",
          fontWeight: "600",
        },
      ],
    },
    container: {
      center: true,
      screens: {
        lg: "1120px",
      },
    },
    screens: {
      sm: "360px",
      md: "744px",
      lg: "1280px",
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        shade: "hsl(var(--shade))",
        shade_blue: "hsl(var(--shade-blue))",
        whatsapp: "var(--whatsapp-green)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        marquee_ar: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(50%)" },
        },
        marquee_en: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee_ar: "marquee_ar 30s linear infinite",
        marquee_en: "marquee_en 30s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
