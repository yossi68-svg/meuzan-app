// לוגיקת התזכורות המעודדות — משותפת לדף ול-service worker (סקריפט קלאסי, בלי import).
(function (root) {
  const SLOTS = [
    { id: 'morning', def: '08:00', label: '🌅 בוקר — פתיחת יום ושקילה' },
    { id: 'lunch',   def: '13:00', label: '🍽️ צהריים — תיעוד ארוחה' },
    { id: 'evening', def: '20:30', label: '🌙 ערב — סגירת יום' },
    { id: 'motzei',  def: '20:30', label: '🕯️ מוצ״ש — סיכום שבת' },
    { id: 'backup',  def: '10:00', label: '🗂️ גיבוי שבועי לדרייב (רק כשהגיע הזמן)' },
    { id: 'risk',    def: 'auto',  label: '🛡️ שעת הסיכון שלך — תזכורת 30 דק׳ לפני (אוטומטי לפי יומן החשקים)' }
  ];

  const POOLS = {
    morning: [
      'בוקר טוב! יום מאוזן מתחיל עכשיו 🌿',
      'יום חדש = הזדמנות חדשה. חלבון בבוקר — והולכים 🌿',
      'בלי שיפוטיות: כל בחירה טובה היום מקרבת אותך ליעד 💪',
      'קטן ועקבי מנצח גדול ולא יציב. מה הפעילות שלך היום? ✨'
    ],
    lunch: [
      'הגיע זמן ארוחת צהריים: חלבון + ירק, ובנגיעה אחת מתעדים 🍽️',
      'ארוחה טובה עכשיו = שובע לאורך אחר הצהריים. מה על הצלחת?',
      'לא לדלג על הצהריים! חלבון כשר איכותי ושומרים על אנרגיה ⚡'
    ],
    evening: [
      'סגירת יום ב-10 שניות: מה אכלת היום? ממשיכים ברצף 🔥',
      'עוד יום עבר. תעד, תנשום, ולחץ ״סיכום יומי״ לציון 📊'
    ],
    risk: [
      'שעת הסיכון שלך מתקרבת 🛡️ תכין תה או מים, ואם יתחשק — כפתור SOS באפליקציה ממתין לך',
      'בעוד חצי שעה בדרך כלל מגיע החשק. עכשיו הזמן להכין חלופה מוכנה ולא להישאר מול המטבח 🍵',
      'שים לב: זו השעה שבה בדרך כלל מתחשק מתוק. 10 דקות סבלנות והחשק חולף. אתה חזק מזה 💪'
    ],
    backup: [
      'הגיע זמן הגיבוי השבועי 🗂️ לחיצה אחת ושומרים את היומן בגוגל דרייב',
      'שבוע של תיעוד שווה גיבוי! פתח את האפליקציה ולחץ ״שמור בדרייב״ ⏱️ 10 שניות'
    ],
    motzei: [
      'שבוע טוב! 🕯️ סיכום מוצ״ש ב-10 שניות — איך עברה השבת?',
      'שבוע טוב ומבורך! לחיצה אחת על ״איך עברה השבת״ וחוזרים לשגרה בכיף 🌿'
    ]
  };

  const pad = (n) => String(n).padStart(2, '0');
  function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function toMinutes(t) { const p = String(t || '0:0').split(':').map(Number); return (p[0] || 0) * 60 + (p[1] || 0); }
  function pick(pool, d, i) {
    const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return pool[(doy + i) % pool.length];
  }

  function build(slot, state, now, idx) {
    const key = dateKey(now);
    const day = ((state && state.days) || {})[key] || {};
    const meals = day.meals || [];
    const water = Number(day.waterLiters) || 0;
    const carbs = meals.reduce((s, m) => s + (Number(m.carbs ?? m.netCarbs) || 0), 0);
    const targets = (state && state.targets) || {};
    const waterTarget = targets.water || 2;
    const carbTarget = targets.dailyCarbLimit || 75;
    let body = pick(POOLS[slot], now, idx);

    if (slot === 'morning') {
      const w = (state && state.weighIns) || [];
      const wa = (state && state.waist) || [];
      const dates = w.filter((x) => x.id !== 'wi_init').map((x) => x.date).concat(wa.map((x) => x.date)).sort();
      const last = dates.length ? dates[dates.length - 1] : null;
      const ref = last || (w.length ? w[0].date : null);
      if (ref) {
        const p = ref.split('-').map(Number);
        const days = Math.floor((now - new Date(p[0], p[1] - 1, p[2])) / 864e5);
        if (days >= 7) body += ' 📏 עבר שבוע מהמדידה האחרונה. משקל או היקף מותן (30 שניות)?';
      }
      return { title: 'בוקר טוב 🌿', body };
    }
    if (slot === 'backup') return backupDue(state, now) ? { title: 'גיבוי שבועי 🗂️', body } : null;
    if (slot === 'risk') return { title: 'שעת הסיכון מתקרבת 🛡️', body };
    if (slot === 'lunch') {
      if (meals.some((m) => (m.time || '00:00') >= '11:00')) return null;
      return { title: 'זמן לצהריים 🍽️', body };
    }
    if (slot === 'evening') {
      if (meals.length === 0) return { title: 'סגירת יום 🌙', body: 'היום עוד ריק ביומן — 10 שניות לתעד ארוחה ולשמור על הרצף 🔥' };
      if (!(day.activities || []).length && !(Number(day.movementMinutes) > 0)) return { title: 'סגירת יום 🌙', body: `${carbs}/${carbTarget}ג׳ פחמימות. לא נרשמה פעילות היום — גם 10 דקות הליכה שומרות על הרצף. ולסיום: ״סיכום יומי״ 📊` };
      if (carbs <= carbTarget) return { title: 'יום מצוין 🌙', body: `${carbs}ג׳ פחמימות מתוך ${carbTarget} — איזון יפה! לחץ ״סיכום יומי״ לציון 📊` };
      return { title: 'סגירת יום 🌙', body: `חריגה קטנה (${carbs}/${carbTarget}ג׳) — אין דרמות, מחר חוזרים לאיזון 🌿` };
    }
    return { title: 'שבוע טוב 🕯️', body };
  }

  // מחזיר רשימת התראות שהגיע זמנן ועוד לא נשלחו היום. מעדכן cfg.lastFired.
  // שעת הסיכון: השעה שבה נרשמו הכי הרבה חשקים (לפחות 3 רישומים ב-60 הימים האחרונים). מחזיר דקות מחצות, או null.
  function riskMinutes(state, now) {
    const list = ((state && state.cravings) || []);
    const since = (now ? now.getTime() : Date.now()) - 60 * 864e5;
    const buckets = {};
    let total = 0;
    list.forEach((c) => {
      if (!c || typeof c.hour !== 'number' || (c.ts || 0) < since) return;
      buckets[c.hour] = (buckets[c.hour] || 0) + 1;
      total++;
    });
    if (total < 3) return null;
    let best = null;
    Object.keys(buckets).forEach((h) => { if (best === null || buckets[h] > buckets[best]) best = h; });
    return Number(best) * 60;
  }

  // גיבוי שבועי: חלפו 7 ימים מהגיבוי האחרון, או מתחילת התיעוד אם עוד לא גובה.
  function backupDue(state, now) {
    const t = now ? now.getTime() : Date.now();
    const last = Number(state && state.lastBackupAt) || 0;
    if (last) return t - last >= 7 * 864e5;
    const keys = Object.keys((state && state.days) || {}).filter((k) => ((state.days[k] || {}).meals || []).length).sort();
    if (!keys.length) return false;
    const p = keys[0].split('-').map(Number);
    return t - new Date(p[0], p[1] - 1, p[2]).getTime() >= 7 * 864e5;
  }

  function computeDue(cfg, state, now) {
    const out = [];
    if (!cfg || !cfg.enabled) return out;
    cfg.lastFired = cfg.lastFired || {};
    const key = dateKey(now);
    const dow = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    // שקט בשבת: שישי מ-14:00 ועד מוצ״ש 19:30
    if (dow === 5 && mins >= 14 * 60) return out;
    if (dow === 6 && mins < 19 * 60 + 30) return out;

    SLOTS.forEach((s, i) => {
      const c = (cfg.slots || {})[s.id] || { on: true, time: s.def };
      if (!c.on) return;
      if (s.id === 'motzei' ? dow !== 6 : dow === 6) return;
      let t = toMinutes(c.time);
      if (s.id === 'risk') {
        const rm = riskMinutes(state, now);
        if (rm === null) return;
        t = Math.max(0, rm - 30);
        if (mins > rm) return; // אחרי תחילת שעת הסיכון התזכורת כבר לא רלוונטית
      }
      if (mins < t || mins - t > 180) return;
      if (cfg.lastFired[s.id] === key) return;
      const m = build(s.id, state, now, i);
      cfg.lastFired[s.id] = key;
      if (m) out.push({ slot: s.id, tag: 'meuzan-' + s.id, title: m.title, body: m.body });
    });
    return out;
  }

  root.MeuzanNotify = { SLOTS, computeDue, dateKey, pick, riskMinutes, backupDue };
})(typeof self !== 'undefined' ? self : window);
