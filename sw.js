// Service worker של מאוזן AI.
// כדי לפרסם עדכון: שנה את VERSION, העלה — בטלפון תופיע הודעה "גרסה חדשה זמינה".
importScripts('./notify-core.js');

const VERSION = 'v1.9.3';
const CACHE = `meuzan-${VERSION}`;
const RUNTIME = 'meuzan-runtime';
const SHELL = [
  './', './index.html', './app.js', './notify-core.js', './firebase-config.js', './tailwind.css',
  './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable-512.png'
];
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];

self.addEventListener('install', (event) => {
  // cache:'reload' עוקף את מטמון ה-HTTP, כדי שלא יישמרו יחד קבצים מגרסאות שונות
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('meuzan-') && k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'GET_VERSION' && event.source) event.source.postMessage({ type: 'VERSION', version: VERSION });
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try { return await fetch(req); }
      catch (e) { if (req.mode === 'navigate') return caches.match('./index.html'); throw e; }
    })());
    return;
  }

  if (RUNTIME_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => null);
      return cached || (await network) || Response.error();
    })());
  }
});

// ---- תזכורות מעודדות ברקע (Periodic Background Sync — אנדרואיד/Chrome, אפליקציה מותקנת) ----
function swIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('meuzan-db', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function swGet(key) {
  const db = await swIdb();
  return new Promise((resolve, reject) => {
    const r = db.transaction('kv', 'readonly').objectStore('kv').get(key);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function swSet(key, val) {
  const db = await swIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(val, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function swCheckReminders() {
  const cfg = await swGet('notify');
  if (!cfg || !cfg.enabled) return;
  const state = (await swGet('state')) || {};
  const before = JSON.stringify(cfg.lastFired || {});
  const due = self.MeuzanNotify.computeDue(cfg, state, new Date());
  for (const n of due) {
    try {
      await self.registration.showNotification(n.title, {
        body: n.body, tag: n.tag, icon: './icons/icon-192.png', badge: './icons/icon-192.png', dir: 'rtl', lang: 'he'
      });
    } catch (e) {}
  }
  if (JSON.stringify(cfg.lastFired || {}) !== before) await swSet('notify', cfg);
}
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'meuzan-reminders') event.waitUntil(swCheckReminders());
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./index.html');
  }));
});
