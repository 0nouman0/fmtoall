/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Celestial Space & Emerald Accent Palette
        base: '#0B0914',            // Deep space indigo
        paper: '#F3EFE0',           // Warm starlight cream
        brass: '#10B981',           // Emerald Green (Replaced golden text)
        red: '#7B2CBF',             // Cosmic Violet
        divider: '#251F35',         // Deep violet border
        'paper-muted': '#A49BB5',   // Muted violet text
        'base-light': '#151124',    // Light indigo surface
        'base-mid': '#1D1830',      // Mid indigo surface
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'waveform': 'waveform 0.6s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'beat-in': 'beatIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        waveform: {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        beatIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      maxWidth: {
        'phone': '480px',
      },
    },
  },
  plugins: [],
}
