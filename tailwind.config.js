/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0F1117',
        surface: '#171A21',
        'border-hairline': 'rgba(255, 255, 255, 0.08)',
        'accent-gold': '#C9A24B',
        'accent-gold-hover': '#D4B05A',
        positive: '#4ADE80',
        negative: '#F87171',
        'text-primary': '#F5F3EE',
        'text-muted': '#9A9CA5',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
