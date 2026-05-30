/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2.5rem', // matches Figma 40px gutter
      },
      screens: {
        '2xl': '1440px', // Figma desktop frame width
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--nibl-primary))',
          foreground: 'hsl(var(--nibl-primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--nibl-accent))',
          foreground: 'hsl(var(--nibl-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        rating: 'hsl(var(--rating))',
        // Per-category content palette — use as bg-category-orange etc.
        category: {
          orange: 'hsl(var(--category-orange))',
          magenta: 'hsl(var(--category-magenta))',
          pink: 'hsl(var(--category-pink))',
          blue: 'hsl(var(--category-blue))',
          violet: 'hsl(var(--category-violet))',
          lavender: 'hsl(var(--category-lavender))',
          green: 'hsl(var(--category-green))',
          blush: 'hsl(var(--category-blush))',
          amber: 'hsl(var(--category-amber))',
          rust: 'hsl(var(--category-rust))',
          cream: 'hsl(var(--category-cream))',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        // Tracked to Figma text styles (Primary-Heading-3xl, Secondary-* etc.)
        'display-3xl': ['2.625rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }], // 42px — Primary-Heading-3xl
        'display-2xl': ['2rem',     { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }], // 32px
        'display-xl':  ['1.5rem',   { lineHeight: '1.25', letterSpacing: '-0.005em', fontWeight: '700' }], // 24px
        'display-lg':  ['1.25rem',  { lineHeight: '1.3',  letterSpacing: '-0.005em', fontWeight: '700' }], // 20px — used by section headers and dialog titles
        'body-lg':     ['1rem',     { lineHeight: '1.28' }], // 16/128% — Secondary-Body
        'body':        ['0.875rem', { lineHeight: '1.3'  }], // 14/130% — Secondary-Label-2
        'label':       ['0.75rem',  { lineHeight: '1.3'  }], // 12/130% — Secondary-Label3/4
      },
      boxShadow: {
        // Hard-offset solid shadows — NiBL signature.
        'flat-sm':     'var(--shadow-flat-sm)',
        flat:          'var(--shadow-flat)',
        'flat-muted':  'var(--shadow-flat-muted)',
        'flat-bottom': 'var(--shadow-flat-bottom)',
        'flat-lg':     'var(--shadow-flat-lg)',
        // Soft shadows for overlays/menus where flat would clash.
        soft: 'var(--shadow-sm)',
        card: 'var(--shadow-md)',
        pop:  'var(--shadow-lg)',
      },
      spacing: {
        gutter: 'var(--container-padding)', // 40px
        rail:   'var(--rail-gap)',          // 30px
        header: 'var(--header-height)',     // 100px
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

module.exports = preset;
