export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nocturnum: {
          900: '#0b0b0e',
          800: '#0f0f13',
          700: '#16161b',
          accent: '#ff2d95',
          accent2: '#7b2cff',
        }
      },
      keyframes: {
        neon: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 6px rgba(255,45,149,0.45))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 14px rgba(255,45,149,0.85))' }
        },
        floaty: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        neon: 'neon 2.2s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3.5s ease-in-out infinite',
        sweep: 'sweep 2.8s linear infinite'
      }
    }
  },
  plugins: [],
};
