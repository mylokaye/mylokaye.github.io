/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './about/*.html',
    './form-debugger/*.html',
    './d365-form-skill/*.html',
    './pattens/*.html',
    './agentic-form/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', '"Liberation Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        ink: '#f8fafc',
        muted: '#cbd5e1',
        line: 'rgba(255,255,255,0.12)',
        panel: 'rgba(8,13,25,0.72)',
        panelStrong: 'rgba(8,13,25,0.88)',
        accent: '#67e8f9',
        accentSoft: 'rgba(103,232,249,0.10)',
        gold: '#facc15',
        ember: '#f97316'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(0, 0, 0, 0.34)',
        control: '0 14px 38px rgba(103, 232, 249, 0.22)'
      }
    }
  }
};
