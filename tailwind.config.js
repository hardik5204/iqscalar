/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors for dark mode
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      animation: {
        'premium-float': 'premium-float 6s ease-in-out infinite',
        'premium-glow': 'premium-glow 3s ease-in-out infinite',
        'morph-shape': 'morph-shape 8s ease-in-out infinite',
        'brain-premium': 'brain-premium 4s ease-in-out infinite',
        'text-reveal': 'text-reveal 1s ease-out forwards',
        'fade-in-delay': 'fade-in-delay 1.5s ease-out forwards',
        'gradient': 'gradient 3s ease infinite',
        'fadeInUp': 'fadeInUp 1.2s ease-out forwards',
      }
    },
  },
  plugins: [],
} 