/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          'blue-hover': '#1557b0',
          'blue-light': '#e8f0fe',
          'blue-dark': '#174ea6',
          red: '#ea4335',
          'red-hover': '#d93025',
          'red-light': '#fce8e6',
          green: '#34a853',
          'green-hover': '#1e8e3e',
          'green-light': '#e6f4ea',
          yellow: '#fbbc04',
          'yellow-hover': '#f29900',
          'yellow-light': '#fef7e0',
        },
        gmail: {
          bg: '#f6f8fc',
          card: '#ffffff',
          sidebar: '#f6f8fc',
          'sidebar-active': '#d3e3fd',
          'sidebar-hover': '#eaebef',
          'item-hover': '#f2f6fc',
          'item-selected': '#c2e7ff',
          'border': '#e7eaed',
          'text-primary': '#1f1f1f',
          'text-secondary': '#444746',
          'text-muted': '#727775',
        },
        gemini: {
          purple: '#9333ea',
          blue: '#2563eb',
          pink: '#ec4899',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Roboto', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'google-1': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google-2': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'google-3': '0 2px 6px 2px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)',
        'search': '0 1px 3px 1px rgba(60,64,67,0.15), 0 2px 8px 4px rgba(60,64,67,0.08)',
        'floating': '0 4px 8px 3px rgba(60,64,67,0.15), 0 1px 3px 0 rgba(60,64,67,0.3)',
      },
      borderRadius: {
        'pill': '9999px',
        'google': '16px',
      }
    },
  },
  plugins: [],
}
