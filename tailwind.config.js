/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0C0E12',
        ink: '#12151C',
        surface: '#161A22',
        elevated: '#1C212B',
        'border-hairline': 'rgba(245, 240, 230, 0.09)',
        'border-strong': 'rgba(245, 240, 230, 0.16)',
        'accent-gold': '#C9A24B',
        'accent-gold-hover': '#D8B45C',
        'accent-gold-muted': 'rgba(201, 162, 75, 0.14)',
        positive: '#5ECF8E',
        negative: '#E87B7B',
        'text-primary': '#F3EFE6',
        'text-muted': '#8E919C',
        'text-faint': '#6A6D78',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        control: '0.625rem',
        panel: '1rem',
        hero: '1.25rem',
      },
      maxWidth: {
        content: '42rem',
        wide: '52rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201, 162, 75, 0.22)',
      },
    },
  },
}
