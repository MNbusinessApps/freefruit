/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Free Fruit Color Palette - Steve Jobs Minimalist
        primary: '#1CE5C8',        // Electric teal
        background: '#0B132B',     // Midnight navy
        surface: '#1a2332',        // Darker navy for cards
        'text-primary': '#F2F5FA', // White text
        'text-secondary': '#8B9DC3', // Muted teal
        'fruit-high': '#00FFB3',   // High confidence
        'fruit-medium': '#FFD93D', // Medium confidence
        'fruit-low': '#FF8C42',    // Low confidence
        'border': '#2A3A4A',
        'divider': '#2A3A4A',
        'error': '#FF4757',
        'success': '#2ED573',
        'warning': '#FFA502',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'fruit': '0 4px 14px 0 rgba(28, 229, 200, 0.15)',
        'card': '0 2px 8px 0 rgba(28, 229, 200, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}