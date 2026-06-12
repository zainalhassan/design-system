/** @type {import('tailwindcss').Config} */
/** Transit theme preset — import in tailwind.config */
module.exports = {
  theme: {
    extend: {
      colors: {
      brand: {
            primary: "var(--color-brand-primary)",
            primary-hover: "var(--color-brand-primary-hover)",
            primary-foreground: "var(--color-brand-primary-foreground)",
            secondary: "var(--color-brand-secondary)",
            secondary-foreground: "var(--color-brand-secondary-foreground)"
      },
      semantic: {
            success: "var(--color-semantic-success)",
            warning: "var(--color-semantic-warning)",
            destructive: "var(--color-semantic-destructive)",
            info: "var(--color-semantic-info)"
      },
      route: {
            red: "var(--color-route-red)",
            orange: "var(--color-route-orange)",
            yellow: "var(--color-route-yellow)",
            green: "var(--color-route-green)",
            teal: "var(--color-route-teal)",
            blue: "var(--color-route-blue)",
            indigo: "var(--color-route-indigo)",
            purple: "var(--color-route-purple)",
            pink: "var(--color-route-pink)",
            gray: "var(--color-route-gray)"
      },
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      card: "var(--color-card)",
      border: "var(--color-border)",
      ring: "var(--color-ring)",
      primary: "var(--color-brand-primary)",
      destructive: "var(--color-semantic-destructive)"
},
      spacing: {
      0: "var(--spacing-0)",
      1: "var(--spacing-1)",
      2: "var(--spacing-2)",
      3: "var(--spacing-3)",
      4: "var(--spacing-4)",
      5: "var(--spacing-5)",
      6: "var(--spacing-6)",
      8: "var(--spacing-8)",
      10: "var(--spacing-10)",
      12: "var(--spacing-12)",
      16: "var(--spacing-16)"
},
      borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      2xl: "var(--radius-2xl)",
      pill: "var(--radius-pill)",
      card: "var(--radius-card)",
      button: "var(--radius-button)",
      chip: "var(--radius-chip)"
},
      fontSize: {
      size-xs: [
            "var(--font-size-xs)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-sm: [
            "var(--font-size-sm)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-base: [
            "var(--font-size-base)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-lg: [
            "var(--font-size-lg)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-xl: [
            "var(--font-size-xl)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-2xl: [
            "var(--font-size-2xl)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-3xl: [
            "var(--font-size-3xl)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-4xl: [
            "var(--font-size-4xl)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-5xl: [
            "var(--font-size-5xl)",
            {
                  lineHeight: "1.25"
            }
      ],
      size-6xl: [
            "var(--font-size-6xl)",
            {
                  lineHeight: "1.25"
            }
      ]
},
      fontFamily: {
      family-sans: [
            "var(--font-family-sans)",
            {
                  lineHeight: "1.5"
            }
      ],
      family-display: [
            "var(--font-family-display)",
            {
                  lineHeight: "1.5"
            }
      ],
      family-mono: [
            "var(--font-family-mono)",
            {
                  lineHeight: "1.5"
            }
      ]
},
      boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)"
},
    },
  },
};
