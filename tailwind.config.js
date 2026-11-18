module.exports = {
  content: ['./index.html', './app.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Heebo', 'Rubik', 'sans-serif'], display: ['Rubik', 'Heebo', 'sans-serif'] },
      colors: { appBg: '#F8FAFC', tealPrimary: '#0D9488', emeraldAccent: '#059669', indigoAi: '#4F46E5', shabbatAmber: '#D97706' },
      boxShadow: {
        card: '0 2px 14px -4px rgba(15, 23, 42, 0.05)',
        nav: '0 -4px 24px -6px rgba(15, 23, 42, 0.08)',
        fab: '0 8px 22px -4px rgba(13, 148, 136, 0.46)'
      }
    }
  }
};
