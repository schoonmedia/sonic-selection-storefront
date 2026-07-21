/** Sonic Selection Tailwind color extension */
module.exports = {
  theme: {
    extend: {
      colors: {
        ss: {
          black: '#0B0B0D',
          graphite: '#16161A',
          slate: '#2A2A31',
          light: '#F2F2F4',
          lime: '#C6FF00',
          gold: '#D4AF7A',
          muted: '#A8A8AE',
          border: '#2A2A31',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'Orbitron', 'Space Grotesk', 'Arial Black', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ss-glow': '0 0 32px rgba(198,255,0,.18)',
      },
    },
  },
};
