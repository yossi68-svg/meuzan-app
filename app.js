    import { firebaseConfig } from './firebase-config.js';

    // =========================================================================
    // 1. DATE HELPERS & CURATED KOSHER QUICK MEALS
    // =========================================================================
    const CURATED_KOSHER_MEALS = [
      {
        id: 'kq_1',
        name: 'שקשוקה 2 ביצים וטחינה',
        kosherType: 'פרווה',
        netCarbs: 10,
        protein: 18,
        calories: 310,
        status: 'excellent',
        wittyTip: 'קלאסיקה ישראלית פרווה — מתאימה בכל שעה ביום, משביעה ובלי קפיצות סוכר!'
      },
      {
        id: 'kq_2',
        name: 'חזה עוף על הפלנצ׳ה וסלט ירוק',
        kosherType: 'בשרי',
        netCarbs: 6,
        protein: 38,
        calories: 340,
        status: 'excellent',
        wittyTip: '38 גרם חלבון נקי! שומר על שובע ומסת שריר. מתחיל שעון המתנה לחלבי.'
      },
      {
        id: 'kq_3',
        name: 'חביתת ירק + קוטג׳ 5% וירקות',
        kosherType: 'חלבי',
        netCarbs: 8,
        protein: 24,
        calories: 290,
        status: 'excellent',
        wittyTip: 'ארוחה חלבית קלילה ומדויקת — בול לארוחת בוקר או ערב רגועה.'
      },
      {
        id: 'kq_4',
        name: 'סלט טונה, אבוקדו וביצה קשה',
        kosherType: 'פרווה',
        netCarbs: 7,
        protein: 29,
        calories: 360,
        status: 'excellent',
        wittyTip: 'פרווה מנצח: חלבון, שומן איכותי ואומגה 3 ב-5 דקות הכנה.'
      },
      {
        id: 'kq_5',
        name: 'סלמון אפוי וברוקולי בשמן זית',
        kosherType: 'פרווה',
        netCarbs: 6,
        protein: 34,
        calories: 410,
        status: 'excellent',
        wittyTip: 'גם פרווה, גם עשיר בחלבון וגם נותן בוסט מטורף לחיוניות!'
      },
      {
        id: 'kq_6',
        name: 'שווארמה הודו ביתית עם טחינה וסלט',
        kosherType: 'בשרי',
        netCarbs: 9,
        protein: 35,
        calories: 390,
        status: 'excellent',
        wittyTip: 'התענוג של שווארמה בלי הלאפה — 35 גרם חלבון וטחינה אמיתית!'
      }
    ];

    function formatDateKey(dateObj) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    function getTodayKey() {
      return formatDateKey(new Date());
    }

    function getOffsetDateKey(daysAgo) {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return formatDateKey(d);
    }

    function isSaturdayDateKey(dateKey) {
      const parts = dateKey.split('-');
      if (parts.length !== 3) return false;
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.getDay() === 6;
    }

    function formatHebrewShortDate(dateKey) {
      const parts = dateKey.split('-');
      if (parts.length !== 3) return dateKey;
      return `${Number(parts[2])}/${Number(parts[1])}`;
    }

    function createEmptyDayRecord() {
      return {
        waterLiters: 0.0,
        sleepHours: null,
        movementMinutes: 0,
        meals: []
      };
    }

    function createDefaultState() {
      const todayKey = getTodayKey();
      return {
        activeTab: 'today',
        coachSubTab: 'chat',
        selectedDateKey: todayKey,
        historySubTab: 'weights',
        updatedAt: 0,
        onboarded: false,
        celebrated: [],
        profile: {
          heightCm: 175,
          startWeight: 90.0,
          currentWeight: 90.0,
          targetWeight: 80.0
        },
        targets: {
          dailyCarbLimit: 75,
          dailyProteinTarget: 130,
          water: 2.0
        },
        kosher: {
          waitHours: 6,
          lastMeatTimestamp: null,
          lastMeatMealName: ''
        },
        shabbatCheckIns: [],
        aiMemory: {
          likedPatterns: ['שמירה על כשרות והפרדת בשר וחלב', 'ארוחות עשירות בחלבון ושובע'],
          dislikedPatterns: [],
          customNotes: ['שומר כשרות ושבת'],
          customQuickMeals: [],
          discoveredInsights: [
            {
              id: 'ins_init_1',
              title: 'הכוח של ארוחות פרווה בצהריים',
              detail: 'בחירה בארוחות פרווה (כמו סלמון, טונה או שקשוקה) משאירה לך גמישות מלאה לארוחת ערב חלבית קלילה.',
              feedback: null
            },
            {
              id: 'ins_init_2',
              title: 'שינה קצרה וחשק לפחמימות',
              detail: 'בימים של פחות מ-6.5 שעות שינה, פתיחת הבוקר עם חלבון גבוה ו-2 כוסות מים מורידה ב-60% את החשק למתוק.',
              feedback: null
            },
            {
              id: 'ins_init_3',
              title: 'שבת רגועה ללא לחץ מדידה',
              detail: 'שמירה על פרוסת חלה מדודה בקידוש והתמקדות בדגים, עוף וסלטים שומרת על הירידה במשקל בלי לפגוע בעונג שבת.',
              feedback: null
            }
          ],
          pendingUpgrades: [
            {
              id: 'upg_init_1',
              title: 'הוסף ארוחה מהירה אישית: חביתה ואבוקדו',
              description: 'מוסיף כפתור פרווה בנגיעה אחת (7ג׳ פחמימה, 20ג׳ חלבון) לתפריט הוספת הארוחות שלך.',
              actionType: 'add_quick_meal',
              payload: {
                id: 'cq_avocado_omelet',
                name: 'חביתת 2 ביצים, חצי אבוקדו וירקות',
                kosherType: 'פרווה',
                netCarbs: 7,
                protein: 20,
                calories: 340,
                status: 'excellent',
                wittyTip: 'הותאם אישית עבורך ע״י מנוע הלמידה: פרווה, משביע ומאזן!'
              }
            },
            {
              id: 'upg_init_2',
              title: 'כוונן יעד פחמימות ל-70 גרם נטו ביום',
              description: 'התאמה עדינה של 5 גרם פחמימה ביום שמאיצה ירידה במשקל תוך שמירה על חיוניות גבוהה.',
              actionType: 'adjust_carbs',
              payload: { dailyCarbLimit: 70 }
            }
          ],
          adoptedUpgrades: []
        },
        days: {
          [todayKey]: createEmptyDayRecord()
        },
        weighIns: [
          {
            id: 'wi_init',
            date: todayKey,
            time: '08:00',
            weight: 90.0,
            note: 'נקודת פתיחה'
          }
        ],
        chatHistory: [
          {
            id: 'msg_welcome',
            role: 'coach',
            text: 'שלום וברוך הבא למאוזן AI! אני המאמן האישי שלך לתזונה דלת-פחמימות מאוזנת, כשרה למהדרין ועם שמירת שבת מלאה. התחבר לענן למעלה כדי שכל הנתונים יישמרו לך אוטומטית בין כל גרסה ומכשיר!',
            feedback: null
          }
        ]
      };
    }

    let state = createDefaultState();

    function mergeWithDefaultState(incoming) {
      const base = createDefaultState();
      if (!incoming || typeof incoming !== 'object') return base;
      const merged = {
        ...base,
        ...incoming,
        profile: { ...base.profile, ...(incoming.profile || {}) },
        targets: {
          ...base.targets,
          ...(incoming.targets || {}),
          dailyCarbLimit: Number(incoming.targets?.dailyCarbLimit ?? incoming.targets?.netCarbs ?? base.targets.dailyCarbLimit),
          dailyProteinTarget: Number(incoming.targets?.dailyProteinTarget ?? incoming.targets?.protein ?? base.targets.dailyProteinTarget)
        },
        kosher: { ...base.kosher, ...(incoming.kosher || {}) },
        aiMemory: {
          ...base.aiMemory,
          ...(incoming.aiMemory || {}),
          likedPatterns: Array.isArray(incoming.aiMemory?.likedPatterns) ? incoming.aiMemory.likedPatterns : base.aiMemory.likedPatterns,
          dislikedPatterns: Array.isArray(incoming.aiMemory?.dislikedPatterns) ? incoming.aiMemory.dislikedPatterns : [],
          customNotes: Array.isArray(incoming.aiMemory?.customNotes) ? incoming.aiMemory.customNotes : base.aiMemory.customNotes,
          customQuickMeals: Array.isArray(incoming.aiMemory?.customQuickMeals) ? incoming.aiMemory.customQuickMeals : [],
          discoveredInsights: Array.isArray(incoming.aiMemory?.discoveredInsights) ? incoming.aiMemory.discoveredInsights : base.aiMemory.discoveredInsights,
          pendingUpgrades: Array.isArray(incoming.aiMemory?.pendingUpgrades) ? incoming.aiMemory.pendingUpgrades : base.aiMemory.pendingUpgrades,
          adoptedUpgrades: Array.isArray(incoming.aiMemory?.adoptedUpgrades) ? incoming.aiMemory.adoptedUpgrades : []
        },
        days: incoming.days || base.days,
        weighIns: Array.isArray(incoming.weighIns) ? incoming.weighIns : base.weighIns,
        chatHistory: Array.isArray(incoming.chatHistory) && incoming.chatHistory.length ? incoming.chatHistory : base.chatHistory
      };
      if (!merged.selectedDateKey) merged.selectedDateKey = getTodayKey();
      if (!merged.days[merged.selectedDateKey]) {
        merged.days[merged.selectedDateKey] = createEmptyDayRecord();
      }
      return merged;
    }

    function ensureDayRecord(dateKey) {
      if (!state.days[dateKey]) {
        state.days[dateKey] = createEmptyDayRecord();
      }
      return state.days[dateKey];
    }

    // =========================================================================
    // 2. LOCAL PERSISTENCE (IndexedDB) + OPTIONAL PERSONAL FIREBASE SYNC
    // =========================================================================
    const DB_NAME = 'meuzan-db';
    const STORE = 'kv';
    const STATE_KEY = 'state';
    const GEMINI_KEY_STORAGE = 'meuzan_gemini_key';

    function idbOpen() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    async function idbGet(key) {
      const db0 = await idbOpen();
      return new Promise((resolve, reject) => {
        const r = db0.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    }
    async function idbSet(key, val) {
      const db0 = await idbOpen();
      return new Promise((resolve, reject) => {
        const tx = db0.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(val, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    let localSaveTimer = null;
    function scheduleLocalSave() {
      if (localSaveTimer) clearTimeout(localSaveTimer);
      localSaveTimer = setTimeout(flushLocalSave, 150);
    }
    async function flushLocalSave() {
      if (localSaveTimer) { clearTimeout(localSaveTimer); localSaveTimer = null; }
      try {
        await idbSet(STATE_KEY, JSON.parse(JSON.stringify(state)));
      } catch (e) {
        console.debug('Local save failed:', e?.message || e);
      }
    }
    async function loadLocalState() {
      try {
        const saved = await idbGet(STATE_KEY);
        if (saved) state = mergeWithDefaultState(saved);
      } catch (e) {
        console.debug('Local load failed:', e?.message || e);
      }
      state.selectedDateKey = getTodayKey();
      ensureDayRecord(state.selectedDateKey);
    }

    function getGeminiKey() {
      try { return localStorage.getItem(GEMINI_KEY_STORAGE) || ''; } catch (e) { return ''; }
    }

    // ---- Firebase (loaded lazily, only if firebase-config.js is filled in) ----
    const appId = 'meuzan';
    const FIREBASE_VERSION = '11.6.1';
    let fb = null;
    let auth = null;
    let db = null;
    let currentUser = null;
    let unsubscribeProfileSnapshot = null;
    let cloudSaveTimer = null;
    let lastCloudSyncSuccess = false;

    function isCloudConfigured() {
      return !!(firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('PASTE'));
    }

    function getUserProfileDocRef(uid) {
      return fb.doc(db, 'artifacts', appId, 'users', uid, 'state', 'profile');
    }

    function sanitizeStateForFirestore(rawObj) {
      // Photos stay on the device only (Firestore documents are limited to 1MB)
      const clone = JSON.parse(JSON.stringify(rawObj));
      if (clone.days && typeof clone.days === 'object') {
        Object.values(clone.days).forEach(day => {
          if (Array.isArray(day.meals)) {
            day.meals.forEach(m => {
              if (m.photo && m.photo.length > 15000) m.photo = null;
            });
          }
        });
      }
      return clone;
    }

    function saveState() {
      state.updatedAt = Date.now();
      scheduleLocalSave();
      scheduleCloudSave();
    }

    // UI-only changes (tabs, selected day) are kept locally and never overwrite cloud data
    function saveLocalOnly() {
      scheduleLocalSave();
    }

    function scheduleCloudSave() {
      if (!db || !currentUser || !state.updatedAt) return;
      if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
      cloudSaveTimer = setTimeout(async () => {
        if (!db || !currentUser) return;
        try {
          await fb.setDoc(getUserProfileDocRef(currentUser.uid), sanitizeStateForFirestore(state), { merge: true });
          lastCloudSyncSuccess = true;
          updateCloudSyncHeaderUI();
        } catch (err) {
          lastCloudSyncSuccess = false;
          console.debug('Firestore save pending:', err?.message || err);
          updateCloudSyncHeaderUI();
        }
      }, 600);
    }

    function applyRemoteState(remote) {
      const old = state;
      const next = mergeWithDefaultState(remote);
      const photos = {};
      Object.values(old.days || {}).forEach(d => (d.meals || []).forEach(m => { if (m.photo) photos[m.id] = m.photo; }));
      Object.values(next.days).forEach(d => (d.meals || []).forEach(m => { if (!m.photo && photos[m.id]) m.photo = photos[m.id]; }));
      next.selectedDateKey = old.selectedDateKey;
      next.activeTab = old.activeTab;
      next.coachSubTab = old.coachSubTab;
      next.historySubTab = old.historySubTab;
      state = next;
      if (state.onboarded) document.getElementById('onboardModal').classList.add('hidden');
      ensureDayRecord(state.selectedDateKey);
      scheduleLocalSave();
      renderAll();
    }

    function subscribeToUserCloudDoc(uid) {
      if (!db || !uid) return;
      if (unsubscribeProfileSnapshot) {
        unsubscribeProfileSnapshot();
        unsubscribeProfileSnapshot = null;
      }
      unsubscribeProfileSnapshot = fb.onSnapshot(
        getUserProfileDocRef(uid),
        (docSnap) => {
          lastCloudSyncSuccess = true;
          if (!docSnap.metadata.hasPendingWrites) {
            const localTs = state.updatedAt || 0;
            if (docSnap.exists()) {
              const remote = docSnap.data();
              const remoteTs = remote.updatedAt || 0;
              if (remoteTs > localTs) {
                applyRemoteState(remote);
                showToast('☁️ הנתונים עודכנו מהענן');
              } else if (localTs > remoteTs) {
                scheduleCloudSave();
              }
            } else if (localTs) {
              scheduleCloudSave();
            }
          }
          updateCloudSyncHeaderUI();
        },
        (error) => {
          lastCloudSyncSuccess = false;
          console.debug('Firestore listener notice:', error?.message || error);
          updateCloudSyncHeaderUI();
        }
      );
    }

    async function initFirebaseCloud() {
      if (!isCloudConfigured()) {
        updateCloudSyncHeaderUI();
        return;
      }
      try {
        const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
        const [appM, authM, fsM] = await Promise.all([
          import(`${base}/firebase-app.js`),
          import(`${base}/firebase-auth.js`),
          import(`${base}/firebase-firestore.js`)
        ]);
        fb = { ...appM, ...authM, ...fsM };
        const firebaseApp = fb.initializeApp(firebaseConfig);
        auth = fb.getAuth(firebaseApp);
        db = fb.getFirestore(firebaseApp);

        fb.getRedirectResult(auth).catch(() => {});
        fb.onAuthStateChanged(auth, (user) => {
          currentUser = user;
          if (user) {
            subscribeToUserCloudDoc(user.uid);
          } else {
            if (unsubscribeProfileSnapshot) { unsubscribeProfileSnapshot(); unsubscribeProfileSnapshot = null; }
            lastCloudSyncSuccess = false;
          }
          updateCloudSyncHeaderUI();
        });
      } catch (e) {
        console.debug('Cloud unavailable (offline or blocked), running locally:', e?.message || e);
        updateCloudSyncHeaderUI();
      }
    }

    async function signInWithGoogleAccount() {
      if (!isCloudConfigured()) {
        showToast('☁️ סנכרון ענן עדיין לא הוגדר — ראה README (שלב 4). אפשר לגבות ב-JSON');
        return;
      }
      if (!fb || !auth) {
        showToast('שירות הענן נטען או לא זמין ללא רשת — נסה שוב בעוד רגע');
        return;
      }
      const btn = document.getElementById('googleSignInActionBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-pulse">מתחבר לחשבון Google...</span>`;
      }
      const provider = new fb.GoogleAuthProvider();
      try {
        await fb.signInWithPopup(auth, provider);
        closeCloudAccountModal();
        showToast('☁️ מחובר! הסנכרון פעיל');
      } catch (err) {
        const code = err?.code || '';
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          try { await fb.signInWithRedirect(auth, provider); return; } catch (e2) {}
        }
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          showToast('ההתחברות נכשלה — נסה שוב');
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span>🔐</span><span>התחבר עם Google לסנכרון</span>`;
        }
      }
    }

    async function signOutFromGoogleAccount() {
      if (!auth) return;
      try {
        await fb.signOut(auth);
        closeCloudAccountModal();
        showToast('התנתקת. הנתונים נשארים במכשיר');
      } catch (e) {}
    }

    function updateCloudSyncHeaderUI() {
      const btn = document.getElementById('headerCloudSyncBtn');
      const label = document.getElementById('headerCloudLabel');
      const modalTitle = document.getElementById('cloudModalUserTitle');
      const modalDesc = document.getElementById('cloudModalUserDesc');
      const modalUid = document.getElementById('cloudModalUidLabel');
      const signInBtn = document.getElementById('googleSignInActionBtn');
      const signOutBtn = document.getElementById('googleSignOutActionBtn');
      const installCloudText = document.getElementById('installModalCloudBtnText');

      const configured = isCloudConfigured();
      const signed = !!(currentUser && !currentUser.isAnonymous);
      const green = 'h-9 px-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[11px] flex items-center gap-1 transition active:scale-95';
      const indigo = 'h-9 px-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold text-[11px] flex items-center gap-1 transition active:scale-95';

      if (signed && lastCloudSyncSuccess) {
        btn.className = green;
        label.textContent = 'מסונכרן';
        if (installCloudText) installCloudText.textContent = '☁️ מסונכרן — צפה בחשבון';
      } else if (signed) {
        btn.className = indigo;
        label.textContent = 'מסנכרן...';
        if (installCloudText) installCloudText.textContent = '☁️ סנכרון ענן';
      } else {
        btn.className = indigo;
        label.textContent = configured ? 'סנכרון ענן' : 'מקומי';
        if (installCloudText) installCloudText.textContent = configured ? '☁️ התחבר לסנכרון ענן' : '☁️ סנכרון ענן (לא הוגדר)';
      }

      if (modalTitle) {
        if (signed) {
          modalTitle.textContent = `מחובר: ${currentUser.displayName || currentUser.email}`;
          modalDesc.textContent = 'כל הארוחות, המשקל וזיכרון ה-AI מסונכרנים בין המכשירים שלך. תמונות הארוחות נשארות במכשיר שבו צולמו.';
          if (signInBtn) signInBtn.classList.add('hidden');
          if (signOutBtn) signOutBtn.classList.remove('hidden');
          if (modalUid) modalUid.textContent = `מזהה סנכרון: ${currentUser.uid}`;
        } else {
          modalTitle.textContent = configured ? 'לא מחובר לענן' : 'מצב מקומי';
          modalDesc.textContent = configured
            ? 'הנתונים נשמרים במכשיר. התחבר עם Google כדי לסנכרן בין טלפון למחשב ולגבות בענן.'
            : 'הנתונים נשמרים רק במכשיר הזה. כדי להפעיל סנכרון וגיבוי ענן יש למלא את firebase-config.js (ראה README). בינתיים אפשר לייצא גיבוי JSON.';
          if (signInBtn) signInBtn.classList.toggle('hidden', !configured);
          if (signOutBtn) signOutBtn.classList.add('hidden');
          if (modalUid) modalUid.textContent = '';
        }
      }
    }

    // =========================================================================
    // 3. PWA: INSTALL, SERVICE WORKER, UPDATES, JSON BACKUP
    // =========================================================================
    let deferredInstallPrompt = null;
    let swReg = null;
    let swVersion = '';

    function isStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function updateVersionLabel() {
      const el = document.getElementById('appVersionLabel');
      if (el) el.textContent = swVersion || 'v?';
    }

    function showUpdateBanner(worker) {
      if (document.getElementById('updateBanner')) return;
      const bar = document.createElement('div');
      bar.id = 'updateBanner';
      bar.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-sm px-4 py-3 rounded-2xl bg-indigo-700 text-white shadow-lg flex items-center justify-between gap-3 text-xs font-bold animate-fade-up';
      bar.innerHTML = `<span>🔄 גרסה חדשה זמינה</span><button type="button" class="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-extrabold">עדכן עכשיו</button>`;
      bar.querySelector('button').onclick = () => {
        flushLocalSave().finally(() => worker.postMessage({ type: 'SKIP_WAITING' }));
      };
      document.body.appendChild(bar);
    }

    function initPwa() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        const btn = document.getElementById('androidNativeInstallBtn');
        if (btn) btn.classList.remove('hidden');
      });
      window.addEventListener('appinstalled', () => {
        showToast('🎉 מאוזן AI הותקנה למסך הבית!');
        closeInstallModal();
      });

      if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        let hadController = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          swReg = reg;
          if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg.waiting);
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing;
            if (!nw) return;
            nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(nw);
            });
          });
        }).catch(() => {});

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!hadController) { hadController = true; return; }
          location.reload();
        });
        navigator.serviceWorker.addEventListener('message', (e) => {
          if (e.data && e.data.type === 'VERSION') {
            swVersion = e.data.version;
            updateVersionLabel();
          }
        });
        navigator.serviceWorker.ready.then((r) => {
          if (r.active) r.active.postMessage({ type: 'GET_VERSION' });
        });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && swReg) swReg.update().catch(() => {});
        });
      }

      // Ask the browser not to evict our local data under storage pressure
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
    }

    async function triggerNativePwaInstall() {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      const btn = document.getElementById('androidNativeInstallBtn');
      if (btn) btn.classList.add('hidden');
    }

    async function checkForAppUpdate() {
      if (!swReg) {
        showToast('בדיקת עדכונים זמינה רק באפליקציה שנפתחה מהכתובת המאובטחת');
        return;
      }
      try {
        await swReg.update();
        setTimeout(() => {
          if (!document.getElementById('updateBanner')) showToast('✅ האפליקציה מעודכנת לגרסה האחרונה');
        }, 1200);
      } catch (e) {
        showToast('אין חיבור לרשת — נסה שוב מאוחר יותר');
      }
    }

    function exportJsonBackup() {
      try {
        const jsonStr = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meuzan-kosher-backup-${getTodayKey()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        showToast('💾 קובץ הגיבוי נשמר!');
      } catch (e) {
        showToast('שגיאה בייצוא הגיבוי');
      }
    }

    function importJsonBackup(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed || typeof parsed !== 'object' || !parsed.days) {
            showToast('קובץ גיבוי לא תקין');
            return;
          }
          state = mergeWithDefaultState(parsed);
          saveState();
          renderAll();
          closeInstallModal();
          showToast('📂 הנתונים שוחזרו וסונכרנו לענן!');
        } catch (err) {
          showToast('שגיאה בקריאת קובץ הגיבוי');
        }
      };
      reader.readAsText(file);
    }

    // =========================================================================
    // 4. TOAST NOTIFICATIONS
    // =========================================================================
    function showToast(message) {
      const host = document.getElementById('toastHost');
      const pill = document.createElement('div');
      pill.className = 'px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-lg animate-fade-up text-center';
      pill.textContent = message;
      host.appendChild(pill);
      setTimeout(() => {
        pill.style.opacity = '0';
        pill.style.transition = 'opacity 0.25s ease';
        setTimeout(() => pill.remove(), 260);
      }, 2900);
    }

    function esc(v) {
      return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // =========================================================================
    // 5. KOSHER TIMER, AI CALIBRATION %, BMI & VITALITY CALCULATIONS
    // =========================================================================
    function getKosherWaitStatus() {
      const waitHours = Number(state.kosher.waitHours) || 0;
      const lastTs = state.kosher.lastMeatTimestamp;
      if (waitHours <= 0 || !lastTs) {
        return { isWaiting: false, remainingMs: 0, formatted: '' };
      }
      const endTs = lastTs + waitHours * 3600 * 1000;
      const remainingMs = endTs - Date.now();
      if (remainingMs <= 0) {
        return { isWaiting: false, remainingMs: 0, formatted: '' };
      }
      const totalSec = Math.floor(remainingMs / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      return { isWaiting: true, remainingMs, formatted };
    }

    function resetMeatWaitTimer() {
      state.kosher.lastMeatTimestamp = null;
      state.kosher.lastMeatMealName = '';
      saveState();
      updateKosherTimerUI();
      renderQuickFavoritesGrid();
      showToast('🌿 טיימר ההמתנה אופס — פתוח לחלבי, בשרי ופרווה');
    }

    function getKosherBadgeClasses(kosherType) {
      if (kosherType === 'בשרי') return 'bg-rose-50 text-rose-700 border-rose-200';
      if (kosherType === 'חלבי') return 'bg-sky-50 text-sky-700 border-sky-200';
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }

    function getKosherEmoji(kosherType) {
      if (kosherType === 'בשרי') return '🥩';
      if (kosherType === 'חלבי') return '🧀';
      return '🌿';
    }

    function computeAiCalibrationPct() {
      let score = 25;
      let totalMeals = 0;
      let ratedMeals = 0;
      let vitalityDays = 0;

      Object.values(state.days).forEach(day => {
        if (day.meals && day.meals.length > 0) {
          totalMeals += day.meals.length;
          ratedMeals += day.meals.filter(m => m.rating === 'up' || m.rating === 'down').length;
        }
        if ((day.waterLiters && day.waterLiters > 0) || day.sleepHours !== null || (day.movementMinutes && day.movementMinutes > 0)) {
          vitalityDays += 1;
        }
      });

      const weighInBonus = Math.max(0, (state.weighIns.length - 1) * 4);
      const feedbackBonus =
        ratedMeals * 3 +
        state.aiMemory.likedPatterns.length * 2 +
        state.aiMemory.dislikedPatterns.length * 2 +
        state.aiMemory.customNotes.length * 3 +
        state.aiMemory.adoptedUpgrades.length * 5 +
        state.shabbatCheckIns.length * 4;

      score += Math.min(25, totalMeals * 3);
      score += Math.min(12, vitalityDays * 3);
      score += Math.min(15, weighInBonus);
      score += Math.min(22, feedbackBonus);

      return Math.min(99, Math.max(25, score));
    }

    function calculateBmi(weightKg, heightCm) {
      const hMeters = (Number(heightCm) || 175) / 100;
      if (hMeters <= 0 || !weightKg) return 0;
      return +(weightKg / (hMeters * hMeters)).toFixed(1);
    }

    function getBmiCategoryInfo(bmi) {
      if (!bmi || bmi <= 0) return { label: 'לא הוגדר', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' };
      if (bmi < 18.5) return { label: 'תת-משקל', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' };
      if (bmi < 25.0) return { label: 'תקין', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      if (bmi < 30.0) return { label: 'עודף משקל', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };
      return { label: 'השמנה', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
    }

    function bmiToPercentOnGauge(bmi) {
      const clamped = Math.max(16, Math.min(38, bmi));
      return Math.round(((clamped - 16) / 22) * 100);
    }

    function computeDaySummary(dateKey) {
      const day = ensureDayRecord(dateKey);
      const netCarbs = day.meals.reduce((s, m) => s + (Number(m.carbs ?? m.netCarbs) || 0), 0);
      const protein = day.meals.reduce((s, m) => s + (Number(m.protein) || 0), 0);
      const calories = day.meals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
      const carbTarget = state.targets.dailyCarbLimit || 75;
      const proteinTarget = state.targets.dailyProteinTarget || 130;
      const waterTarget = state.targets.water || 2.0;
      const moveMins = Number(day.movementMinutes) || 0;

      let vitality = 40;
      vitality += Math.min(22, Math.round((day.waterLiters / waterTarget) * 22));
      if (day.sleepHours !== null) {
        if (day.sleepHours >= 7.0) vitality += 18;
        else if (day.sleepHours >= 6.5) vitality += 15;
        else vitality += 9;
      }
      if (moveMins > 0) vitality += Math.min(10, Math.round((moveMins / 30) * 10));
      if (day.meals.length > 0) {
        if (netCarbs <= carbTarget) vitality += 10;
        else vitality += Math.max(2, 10 - Math.floor((netCarbs - carbTarget) / 8));
      }

      return {
        netCarbs,
        protein,
        calories,
        carbTarget,
        proteinTarget,
        waterTarget,
        vitality: Math.min(100, Math.max(15, vitality)),
        waterLiters: day.waterLiters,
        sleepHours: day.sleepHours,
        movementMinutes: moveMins,
        meals: day.meals
      };
    }

    // =========================================================================
    // 6. GEMINI API INTEGRATION (STRICT KASHRUT + CONTINUOUS AI MEMORY)
    // =========================================================================
    let noKeyToastShown = false;

    function buildAiMemoryContextPrompt() {
      const liked = state.aiMemory.likedPatterns.slice(-8).join(', ') || 'טרם נאספו';
      const disliked = state.aiMemory.dislikedPatterns.slice(-8).join(', ') || 'אין';
      const notes = state.aiMemory.customNotes.slice(-8).join(' | ') || 'אין';
      const waitSt = getKosherWaitStatus();
      const waitNote = waitSt.isWaiting
        ? `המשתמש אכל לאחרונה ארוחה בשרית (${state.kosher.lastMeatMealName}) ונמצא כעת בהמתנה לחלבי (נותרו ${waitSt.formatted}). לכן המלץ כרגע רק על פרווה או בשרי!`
        : 'המשתמש פתוח כעת לארוחות פרווה, בשרי או חלבי (כמובן בלי לערבב בשר וחלב באותה ארוחה).';

      return `כללי כשרות מחייבים (יהדות הלכתית):
1. כשרות מלאה: לעולם אל תמליץ על מאכלים לא כשרים (ללא חזיר, בייקון, פירות ים/שרימפס/סרטנים, או ערבוב בשר וחלב באותה ארוחה).
2. סווג תמיד כל מנה כאחת מ-3 הקטגוריות המדויקות: "בשרי", "חלבי", או "פרווה".
3. ${waitNote}
4. המשתמש שומר שבת (בשבת לא מתעדים בטלפון).

זיכרון למידה אישי של המשתמש:
- העדפות שאהב (👍): ${liked}
- דברים שפחות מתאימים לו (👎): ${disliked}
- הערות אישיות: ${notes}`;
    }

    async function callGemini(payload) {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        if (!noKeyToastShown) {
          noKeyToastShown = true;
          showToast('ℹ️ אין מפתח Gemini — מוצג ניתוח מקומי פשוט. אפשר להוסיף בהגדרות');
        }
        return null;
      }
      const models = ['gemini-2.5-flash', 'gemini-flash-latest'];
      const delays = [600, 1300];

      for (const model of models) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        for (let attempt = 0; attempt <= delays.length; attempt++) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 25000);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
            clearTimeout(timeout);

            if (!res.ok) {
              if (attempt < delays.length && (res.status === 429 || res.status >= 500)) {
                await new Promise(r => setTimeout(r, delays[attempt]));
                continue;
              }
              break;
            }

            const json = await res.json();
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
          } catch (err) {
            if (attempt < delays.length) {
              await new Promise(r => setTimeout(r, delays[attempt]));
              continue;
            }
          }
        }
      }
      return null;
    }

    async function analyzeMealWithGemini(description, base64Jpeg) {
      const memoryPrompt = buildAiMemoryContextPrompt();
      const parts = [{
        text: `אתה תזונאי ישראלי שנון, חם ותומך המתמחה בתזונה דלת-פחמימות מאוזנת (יעד יומי של כ-${state.targets.dailyCarbLimit} גרם פחמימות נטו, דגש על חלבון, שובע וחיוניות בלי רגשות אשם).
${memoryPrompt}

נתח את הארוחה הבאה (${description ? `תיאור: "${description}"` : 'לפי התמונה המצורפת'}).
החזר תשובה מדויקת בעברית במבנה JSON בלבד עם השדות:
- name (שם הארוחה בעברית)
- netCarbs (מספר גרם פחמימות נטו)
- protein (מספר גרם חלבון)
- calories (קלוריות)
- kosherType (חובה לבחור בדיוק מתוך: "בשרי", "חלבי", "פרווה")
- status (חובה לבחור מתוך: "excellent", "good", "high")
- wittyTip (הערת מאמן קצרה עם הומור קל והתייחסות לכשרות/איזון)`
      }];

      if (base64Jpeg) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Jpeg
          }
        });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              netCarbs: { type: 'NUMBER' },
              protein: { type: 'NUMBER' },
              calories: { type: 'NUMBER' },
              kosherType: { type: 'STRING' },
              status: { type: 'STRING' },
              wittyTip: { type: 'STRING' }
            },
            required: ['name', 'netCarbs', 'protein', 'calories', 'kosherType', 'status', 'wittyTip']
          }
        }
      };

      const raw = await callGemini(payload);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const validKosher = ['בשרי', 'חלבי', 'פרווה'].includes(parsed.kosherType) ? parsed.kosherType : 'פרווה';
          const validStatus = ['excellent', 'good', 'high'].includes(parsed.status) ? parsed.status : 'good';
          return {
            name: parsed.name || description || 'ארוחה כשרה מצולמת',
            netCarbs: Math.max(0, Math.round(Number(parsed.netCarbs) || 0)),
            protein: Math.max(0, Math.round(Number(parsed.protein) || 0)),
            calories: Math.max(20, Math.round(Number(parsed.calories) || 260)),
            kosherType: validKosher,
            status: validStatus,
            wittyTip: parsed.wittyTip || 'ארוחה מאוזנת וטובה! ממשיכים בכיף.'
          };
        } catch (e) {}
      }

      return localHebrewKosherMealFallback(description, Boolean(base64Jpeg));
    }

    function localHebrewKosherMealFallback(text, hasImage) {
      const t = (text || '').toLowerCase();
      if (!t && hasImage) {
        return {
          name: 'צלחת מאוזנת מהמצלמה 📸',
          netCarbs: 14,
          protein: 30,
          calories: 400,
          kosherType: 'פרווה',
          status: 'excellent',
          wittyTip: 'בחירה יפה ומזינה! אפשר לשנות ידנית לבשרי או חלבי למעלה אם צריך.'
        };
      }
      if (t.includes('עוף') || t.includes('חזה') || t.includes('בשר') || t.includes('הודו') || t.includes('שווארמה') || t.includes('קציצ') || t.includes('סטייק') || t.includes('שניצל')) {
        return {
          name: text.slice(0, 42),
          netCarbs: 8,
          protein: 38,
          calories: 420,
          kosherType: 'בשרי',
          status: 'excellent',
          wittyTip: 'מנת חלבון בשרית איכותית ששומרת על שובע ומסת שריר. שעון ההמתנה לחלבי הופעל!'
        };
      }
      if (t.includes('יוגורט') || t.includes('קוטג') || t.includes('גבינ') || t.includes('חלב') || t.includes('מוצרלה') || t.includes('בולגרית') || t.includes('לאבנה') || t.includes('קפה הפוך')) {
        return {
          name: text.slice(0, 42),
          netCarbs: 10,
          protein: 22,
          calories: 280,
          kosherType: 'חלבי',
          status: 'excellent',
          wittyTip: 'חלבי קליל, משביע ומדויק — אחלה איזון בלי להעמיס!'
        };
      }
      if (t.includes('סלמון') || t.includes('דג') || t.includes('טונה') || t.includes('שקשוקה') || t.includes('חביתה') || t.includes('ביצ') || t.includes('אבוקדו') || t.includes('טחינה') || t.includes('סלט')) {
        const hasBread = t.includes('לחם') || t.includes('פיתה') || t.includes('חלה');
        return {
          name: text.slice(0, 42),
          netCarbs: hasBread ? 22 : 9,
          protein: 25,
          calories: hasBread ? 430 : 360,
          kosherType: 'פרווה',
          status: hasBread ? 'good' : 'excellent',
          wittyTip: 'מנת פרווה מנצחת — חלבון ושומן טוב בלי קפיצות סוכר, ומשאירה גמישות מלאה להמשך היום!'
        };
      }
      if (t.includes('פיצה') || t.includes('פסטה') || t.includes('עוג') || t.includes('בורקס') || t.includes('שוקולד')) {
        const isDairy = t.includes('פיצה') || t.includes('שוקולד') || t.includes('גבינ');
        return {
          name: text.slice(0, 42),
          netCarbs: 44,
          protein: 13,
          calories: 510,
          kosherType: isDairy ? 'חלבי' : 'פרווה',
          status: 'high',
          wittyTip: 'נהנית? מעולה, אפס רגשות אשם! בארוחה הבאה פשוט תן דגש על חלבון וירק והכל מתאזן.'
        };
      }
      return {
        name: text ? text.slice(0, 42) : 'ארוחה יומית',
        netCarbs: 15,
        protein: 24,
        calories: 360,
        kosherType: 'פרווה',
        status: 'good',
        wittyTip: 'נרשם ביומן! עקביות רגועה מנצחת כל דיאטת קיצון.'
      };
    }

    // =========================================================================
    // 7. CONTINUOUS SMART AI LEARNING & SELF-IMPROVEMENT ENGINE
    // =========================================================================
    function recordAiFeedback(type, id, rating, labelContext) {
      if (type === 'meal') {
        Object.values(state.days).forEach(day => {
          (day.meals || []).forEach(m => {
            if (m.id === id) {
              m.rating = rating;
              const tag = `${m.name} (${m.kosherType})`;
              if (rating === 'up') {
                if (!state.aiMemory.likedPatterns.includes(tag)) {
                  state.aiMemory.likedPatterns.push(tag);
                }
                state.aiMemory.dislikedPatterns = state.aiMemory.dislikedPatterns.filter(x => x !== tag);
              } else {
                if (!state.aiMemory.dislikedPatterns.includes(tag)) {
                  state.aiMemory.dislikedPatterns.push(tag);
                }
                state.aiMemory.likedPatterns = state.aiMemory.likedPatterns.filter(x => x !== tag);
              }
            }
          });
        });
      } else if (type === 'insight') {
        const ins = state.aiMemory.discoveredInsights.find(i => i.id === id);
        if (ins) {
          ins.feedback = rating;
          if (rating === 'up' && !state.aiMemory.likedPatterns.includes(ins.title)) {
            state.aiMemory.likedPatterns.push(ins.title);
          } else if (rating === 'down' && !state.aiMemory.dislikedPatterns.includes(ins.title)) {
            state.aiMemory.dislikedPatterns.push(ins.title);
          }
        }
      } else if (type === 'chat') {
        const msg = state.chatHistory.find(m => m.id === id);
        if (msg) {
          msg.feedback = rating;
          const shortSnippet = (labelContext || msg.text || '').slice(0, 34);
          if (rating === 'up' && shortSnippet && !state.aiMemory.likedPatterns.includes(shortSnippet)) {
            state.aiMemory.likedPatterns.push(shortSnippet);
          } else if (rating === 'down' && shortSnippet && !state.aiMemory.dislikedPatterns.includes(shortSnippet)) {
            state.aiMemory.dislikedPatterns.push(shortSnippet);
          }
        }
      }

      saveState();
      renderAll();
      showToast('🧠 ה-AI למד את ההעדפה שלך ושמר בענן');
    }

    function handleAddCustomMemoryNote(event) {
      event.preventDefault();
      const input = document.getElementById('customMemoryNoteInput');
      const val = input.value.trim();
      if (!val) return;
      if (!state.aiMemory.customNotes.includes(val)) {
        state.aiMemory.customNotes.push(val);
      }
      input.value = '';
      saveState();
      renderAll();
      showToast('🧬 הכלל האישי נשמר בזיכרון של מאוזן AI!');
    }

    function removeMemoryItem(category, index) {
      if (category === 'liked') state.aiMemory.likedPatterns.splice(index, 1);
      else if (category === 'disliked') state.aiMemory.dislikedPatterns.splice(index, 1);
      else if (category === 'note') state.aiMemory.customNotes.splice(index, 1);
      saveState();
      renderAll();
      showToast('הוסר מהזיכרון');
    }

    function adoptAppUpgrade(upgradeId) {
      const idx = state.aiMemory.pendingUpgrades.findIndex(u => u.id === upgradeId);
      if (idx === -1) return;
      const upg = state.aiMemory.pendingUpgrades[idx];

      if (upg.actionType === 'add_quick_meal' && upg.payload) {
        const exists = state.aiMemory.customQuickMeals.some(m => m.name === upg.payload.name);
        if (!exists) {
          state.aiMemory.customQuickMeals.unshift({
            id: upg.payload.id || 'cq_' + Date.now(),
            name: upg.payload.name,
            kosherType: ['בשרי', 'חלבי', 'פרווה'].includes(upg.payload.kosherType) ? upg.payload.kosherType : 'פרווה',
            netCarbs: Number(upg.payload.netCarbs) || 8,
            protein: Number(upg.payload.protein) || 22,
            calories: Number(upg.payload.calories) || 330,
            status: 'excellent',
            wittyTip: upg.payload.wittyTip || 'נוצר אוטומטית ע״י מנוע הלמידה של מאוזן AI!',
            isCustomAi: true
          });
        }
      } else if (upg.actionType === 'adjust_carbs' && (upg.payload?.dailyCarbLimit || upg.payload?.netCarbs)) {
        const val = Number(upg.payload.dailyCarbLimit ?? upg.payload.netCarbs);
        state.targets.dailyCarbLimit = Math.max(30, Math.min(130, val));
      } else if (upg.actionType === 'adjust_protein' && (upg.payload?.dailyProteinTarget || upg.payload?.protein)) {
        const val = Number(upg.payload.dailyProteinTarget ?? upg.payload.protein);
        state.targets.dailyProteinTarget = Math.max(70, Math.min(220, val));
      } else if (upg.actionType === 'adjust_water' && upg.payload?.water) {
        state.targets.water = Math.max(1.5, Math.min(4.0, Number(upg.payload.water)));
      }

      state.aiMemory.pendingUpgrades.splice(idx, 1);
      state.aiMemory.adoptedUpgrades.unshift({
        id: upg.id,
        title: upg.title,
        dateLabel: formatHebrewShortDate(getTodayKey())
      });

      saveState();
      renderAll();
      showToast(`🚀 השדרוג אומץ באפליקציה: ${upg.title}`);
    }

    async function runDeepAiLearningScan() {
      const btn = document.getElementById('deepLearningScanBtn');
      btn.disabled = true;
      btn.innerHTML = `<span class="animate-pulse">🧠 סורק דפוסי תזונה, שינה, כשרות ומשקל...</span>`;

      const dayKeys = Object.keys(state.days).sort().slice(-7);
      const daysSummary = dayKeys.map(dk => {
        const s = computeDaySummary(dk);
        return `${dk}: פחמימות=${s.netCarbs}ג׳, חלבון=${s.protein}ג׳, מים=${s.waterLiters}ל׳, שינה=${s.sleepHours ?? 'לא דווח'}, ארוחות=[${s.meals.map(m => `${m.name}(${m.kosherType})`).join(', ')}]`;
      }).join('\n');

      const bmi = calculateBmi(state.profile.currentWeight, state.profile.heightCm);
      const memoryPrompt = buildAiMemoryContextPrompt();

      const prompt = `אתה מנוע הלמידה העצמית של אפליקציית הבריאות הכשרה "מאוזן AI".
נתח את הנתונים האמיתיים של המשתמש והפק שיפורים חכמים לאפליקציה עצמה!
פרופיל: משקל התחלה ${state.profile.startWeight} ק״ג, נוכחי ${state.profile.currentWeight} ק״ג, יעד ${state.profile.targetWeight} ק״ג, BMI ${bmi}.
יעדים יומיים נוכחיים: ${state.targets.dailyCarbLimit}ג׳ פחמימות נטו, ${state.targets.dailyProteinTarget}ג׳ חלבון, ${state.targets.water} ל׳ מים.
${memoryPrompt}

היסטוריית ימים אחרונים:
${daysSummary || 'המשתמש בתחילת הדרך.'}

החזר JSON מדויק בעברית הכולל:
1. "insights": מערך של 3 תובנות אישיות חדשות שהתגלו מהנתונים (כל פריט: { "title": string, "detail": string }).
2. "upgrades": מערך של 2 הצעות שדרוג מעשיות לאפליקציה שניתן לאמץ בלחיצה (כל פריט: { "title": string, "description": string, "actionType": "add_quick_meal" | "adjust_carbs" | "adjust_protein" | "adjust_water", "mealName": string, "kosherType": "בשרי"|"חלבי"|"פרווה", "netCarbs": number, "protein": number, "calories": number, "newTargetValue": number }).
הקפד על כשרות מלאה (לעולם ללא ערבוב בשר וחלב וללא מרכיבים לא כשרים).`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              insights: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    title: { type: 'STRING' },
                    detail: { type: 'STRING' }
                  },
                  required: ['title', 'detail']
                }
              },
              upgrades: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    title: { type: 'STRING' },
                    description: { type: 'STRING' },
                    actionType: { type: 'STRING' },
                    mealName: { type: 'STRING' },
                    kosherType: { type: 'STRING' },
                    netCarbs: { type: 'NUMBER' },
                    protein: { type: 'NUMBER' },
                    calories: { type: 'NUMBER' },
                    newTargetValue: { type: 'NUMBER' }
                  },
                  required: ['title', 'description', 'actionType']
                }
              }
            },
            required: ['insights', 'upgrades']
          }
        }
      };

      const raw = await callGemini(payload);
      let appliedSmartData = false;

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.insights) && parsed.insights.length > 0) {
            state.aiMemory.discoveredInsights = parsed.insights.slice(0, 3).map((item, idx) => ({
              id: `ins_${Date.now()}_${idx}`,
              title: item.title,
              detail: item.detail,
              feedback: null
            }));
          }
          if (Array.isArray(parsed.upgrades) && parsed.upgrades.length > 0) {
            state.aiMemory.pendingUpgrades = parsed.upgrades.slice(0, 2).map((u, idx) => {
              let upgPayload = {};
              if (u.actionType === 'add_quick_meal') {
                upgPayload = {
                  id: `cq_${Date.now()}_${idx}`,
                  name: u.mealName || 'ארוחה כשרה מותאמת אישית',
                  kosherType: ['בשרי', 'חלבי', 'פרווה'].includes(u.kosherType) ? u.kosherType : 'פרווה',
                  netCarbs: Math.max(2, Math.round(Number(u.netCarbs) || 8)),
                  protein: Math.max(10, Math.round(Number(u.protein) || 26)),
                  calories: Math.max(120, Math.round(Number(u.calories) || 340)),
                  status: 'excellent',
                  wittyTip: 'נבנה במיוחד עבורך בסריקת הלמידה העמוקה!'
                };
              } else if (u.actionType === 'adjust_carbs') {
                upgPayload = { dailyCarbLimit: Math.max(40, Math.min(110, Math.round(Number(u.newTargetValue) || (state.targets.dailyCarbLimit - 5)))) };
              } else if (u.actionType === 'adjust_protein') {
                upgPayload = { dailyProteinTarget: Math.max(90, Math.min(200, Math.round(Number(u.newTargetValue) || (state.targets.dailyProteinTarget + 10)))) };
              } else if (u.actionType === 'adjust_water') {
                upgPayload = { water: Math.max(2.0, Math.min(3.5, Number(u.newTargetValue) || 2.25)) };
              }
              return {
                id: `upg_${Date.now()}_${idx}`,
                title: u.title,
                description: u.description,
                actionType: u.actionType,
                payload: upgPayload
              };
            });
          }
          appliedSmartData = true;
        } catch (e) {}
      }

      if (!appliedSmartData) {
        const nextCarbs = state.targets.dailyCarbLimit > 65 ? state.targets.dailyCarbLimit - 5 : 70;
        const nextProt = state.targets.dailyProteinTarget < 140 ? state.targets.dailyProteinTarget + 10 : 140;

        state.aiMemory.discoveredInsights = [
          {
            id: `ins_loc_${Date.now()}_1`,
            title: 'סינרגיה בין חלבון גבוה לאיזון בערב',
            detail: `הגעה ל-${state.targets.dailyProteinTarget}ג׳ חלבון ביום מורידה משמעותית נשנושי פחמימות בשעות הערב המאוחרות.`,
            feedback: null
          },
          {
            id: `ins_loc_${Date.now()}_2`,
            title: 'אופטימיזציית כשרות פרווה-בשרי',
            detail: 'שילוב ארוחות פרווה בצהריים מאפשר גמישות מקסימלית ושומר על חיוניות גבוהה בלי כבדות.',
            feedback: null
          },
          {
            id: `ins_loc_${Date.now()}_3`,
            title: `מפת הדרכים ליעד (${state.profile.targetWeight} ק״ג)`,
            detail: `הקצב העקבי שלך מראה שדיוק של ±5 גרם פחמימה ביום מקרב אותך בבטחה לאבן הדרך הבאה.`,
            feedback: null
          }
        ];

        state.aiMemory.pendingUpgrades = [
          {
            id: `upg_loc_${Date.now()}_1`,
            title: 'הוסף ארוחה מהירה: חביתת עשבי תיבול, טחינה וסלט',
            description: 'כפתור פרווה בנגיעה אחת (8ג׳ פחמימה, 21ג׳ חלבון) שמותאם להעדפות הכשרות שלך.',
            actionType: 'add_quick_meal',
            payload: {
              id: `cq_herbs_${Date.now()}`,
              name: 'חביתת עשבי תיבול, טחינה וסלט',
              kosherType: 'פרווה',
              netCarbs: 8,
              protein: 21,
              calories: 330,
              status: 'excellent',
              wittyTip: 'הותאם אישית בסריקת הלמידה: פרווה, קליל ומזין!'
            }
          },
          {
            id: `upg_loc_${Date.now()}_2`,
            title: `שדרג יעד חלבון יומי ל-${nextProt} גרם`,
            description: `העלאת יעד החלבון תגביר שובע ותשמור על מסת השריר בזמן הירידה במשקל (פחמימות: ${nextCarbs}ג׳).`,
            actionType: 'adjust_protein',
            payload: { dailyProteinTarget: nextProt }
          }
        ];
      }

      btn.disabled = false;
      btn.innerHTML = `<span>✨ הפעל סריקת למידה עמוקה</span>`;

      saveState();
      renderAll();
      showToast('🧠 סריקת הלמידה הושלמה! נוצרו תובנות ושדרוגים חדשים לאפליקציה');
    }

    // =========================================================================
    // 8. SHABBAT HUB & MOTZEI SHABBAT CHECK-IN LOGIC
    // =========================================================================
    function openShabbatHub() {
      state.activeTab = 'coach';
      state.coachSubTab = 'shabbat';
      saveLocalOnly();
      renderAll();
    }

    function logMotzeiShabbatCheckin(type) {
      let msg = '';
      let learnedNote = '';

      if (type === 'balanced') {
        msg = '🌿 איזה אלוף! שבת מאוזנת עם עונג שבת ואפס רגשות אשם — ה-AI שמר את הדפוס המוצלח הזה.';
        learnedNote = 'מצליח לשמור על שבת מאוזנת ונעימה';
      } else if (type === 'slight_extra') {
        msg = '🍷 הכל טוב ובאהבה! חלה או קינוח בשבת הם חלק מהחיים. היום ומחר נותנים דגש על חלבון, 2 ליטר מים וירקות — והכל מתאזן תוך 24 שעות.';
        learnedNote = 'בשבת נהנה מקצת חלה/קינוח — מאזן מיד ביום ראשון';
      } else {
        msg = '💪 שבת של סעודות זה לגמרי בסדר! בלי קיזוזים קיצוניים — פשוט חוזרים היום לתפריט דל-פחמימות מאוזן, שותים מים ויוצאים להליכה קצרה.';
        learnedNote = 'אחרי סעודות שבת כבדות חוזר לשגרה מאוזנת ביום ראשון';
      }

      state.shabbatCheckIns.unshift({
        id: 'sh_' + Date.now(),
        dateKey: getTodayKey(),
        type
      });

      if (!state.aiMemory.likedPatterns.includes(learnedNote)) {
        state.aiMemory.likedPatterns.push(learnedNote);
      }

      const fbBox = document.getElementById('motzeiShabbatFeedbackBox');
      fbBox.textContent = msg;
      fbBox.classList.remove('hidden');

      saveState();
      renderAll();
      showToast('🕯️ סיכום מוצ״ש נשמר בענן וה-AI למד ממנו!');
    }

    async function generateAiShabbatPlan() {
      const btn = document.getElementById('genShabbatPlanBtn');
      const box = document.getElementById('shabbatPlannerContent');
      btn.disabled = true;
      btn.textContent = 'מכין תכנון...';

      const memoryPrompt = buildAiMemoryContextPrompt();
      const prompt = `בנה תכנון קצר, פרקטי וכשר למהדרין לשבת מאוזנת ודלת-פחמימות (4 סעיפים קצרים בעברית: קידוש והמוציא, מנה ראשונה פרווה, עיקרית בשרית וסלטים, קינוח פרווה).
${memoryPrompt}
החזר טקסט נקי ומעודד בעברית (4 שורות קצרות עם אימוג׳ים, ללא כוכביות מיותרות).`;

      const reply = await callGemini({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      if (reply) {
        const lines = reply.split('\n').map(l => l.trim()).filter(Boolean);
        box.innerHTML = lines.map(line => `
          <div class="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-slate-800">${esc(line)}</div>
        `).join('');
      } else {
        showToast('מוצג מתכנן השבת הכשר המומלץ');
      }

      btn.disabled = false;
      btn.textContent = '✨ התאם אישית עם AI';
    }

    // =========================================================================
    // 9. TODAY DASHBOARD INTERACTIONS & MEAL LOGGER
    // =========================================================================
    const HEBREW_DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    const SLEEP_CYCLE = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 4.5];
    const MOVEMENT_STEPS = [0, 15, 30, 45, 60];

    function selectDay(dateKey) {
      state.selectedDateKey = dateKey;
      ensureDayRecord(dateKey);
      saveLocalOnly();
      renderTodayTab();
    }

    function adjustWater(delta) {
      const day = ensureDayRecord(state.selectedDateKey);
      const prev = day.waterLiters;
      const target = state.targets.water || 2.0;
      day.waterLiters = Math.max(0, Math.min(4.5, +(prev + delta).toFixed(2)));
      saveState();
      renderTodayTab();
      if (prev < target && day.waterLiters >= target) {
        celebrate(`💧 הגעת ל-${target} ליטר מים! חיוניות בשיא`);
      }
      checkAchievements();
    }

    function cycleSleepHours() {
      const day = ensureDayRecord(state.selectedDateKey);
      if (day.sleepHours === null) {
        day.sleepHours = 6.5;
      } else {
        const idx = SLEEP_CYCLE.indexOf(day.sleepHours);
        day.sleepHours = SLEEP_CYCLE[(idx + 1) % SLEEP_CYCLE.length];
      }
      saveState();
      renderAll();
    }

    function cycleMovementMinutes() {
      const day = ensureDayRecord(state.selectedDateKey);
      const curr = Number(day.movementMinutes) || 0;
      const idx = MOVEMENT_STEPS.indexOf(curr);
      const next = idx === -1 ? 30 : MOVEMENT_STEPS[(idx + 1) % MOVEMENT_STEPS.length];
      day.movementMinutes = next;
      saveState();
      renderAll();
      if (next > 0) {
        showToast(`🏃 נרשמו ${next} דקות תנועה!`);
      }
    }

    // Bottom Sheet Meal Logger
    let pendingCompressedDataUrl = null;
    let pendingCompressedBase64 = null;
    let pendingAnalysisResult = null;

    function openMealSheet(tab = 'ai') {
      const label = state.selectedDateKey === getTodayKey()
        ? 'היום'
        : (state.selectedDateKey === getOffsetDateKey(1) ? 'אתמול' : formatHebrewShortDate(state.selectedDateKey));
      document.getElementById('mealSheetDateSubtitle').textContent = `מתעד עבור: ${label}`;

      const waitSt = getKosherWaitStatus();
      const alertBox = document.getElementById('mealSheetKosherAlert');
      if (waitSt.isWaiting) {
        alertBox.classList.remove('hidden');
        document.getElementById('mealSheetKosherAlertText').textContent =
          `המתנה מבשרי לחלבי פעילה (נותרו ${waitSt.formatted}) — מנות פרווה ובשרי מסומנות כמומלצות כעת.`;
      } else {
        alertBox.classList.add('hidden');
      }

      renderQuickFavoritesGrid();
      switchMealSheetTab(tab);
      document.getElementById('mealSheetBackdrop').classList.remove('hidden');
    }

    function closeMealSheet() {
      document.getElementById('mealSheetBackdrop').classList.add('hidden');
    }

    function switchMealSheetTab(tab) {
      const aiBtn = document.getElementById('mealTabBtn-ai');
      const quickBtn = document.getElementById('mealTabBtn-quick');
      const aiSec = document.getElementById('mealSheetTab-ai');
      const quickSec = document.getElementById('mealSheetTab-quick');

      if (tab === 'ai') {
        aiBtn.className = 'py-2 rounded-xl text-xs font-extrabold bg-white text-slate-900 shadow-xs transition';
        quickBtn.className = 'py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition';
        aiSec.classList.remove('hidden');
        quickSec.classList.add('hidden');
      } else {
        quickBtn.className = 'py-2 rounded-xl text-xs font-extrabold bg-white text-slate-900 shadow-xs transition';
        aiBtn.className = 'py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition';
        quickSec.classList.remove('hidden');
        aiSec.classList.add('hidden');
      }
    }

    function onMealPhotoPicked(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 700;
          let w = img.width;
          let h = img.height;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);

          pendingCompressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          pendingCompressedBase64 = pendingCompressedDataUrl.split(',')[1];

          document.getElementById('mealPhotoPreviewImg').src = pendingCompressedDataUrl;
          document.getElementById('mealPhotoPreviewBox').classList.remove('hidden');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function clearMealPhoto() {
      pendingCompressedDataUrl = null;
      pendingCompressedBase64 = null;
      document.getElementById('mealCameraInput').value = '';
      document.getElementById('mealGalleryInput').value = '';
      document.getElementById('mealPhotoPreviewBox').classList.add('hidden');
      document.getElementById('mealPhotoPreviewImg').src = '';
    }

    async function runAiMealAnalysis() {
      const desc = document.getElementById('mealDescInput').value.trim();
      if (!desc && !pendingCompressedBase64) {
        showToast('צלם ארוחה או כתוב תיאור קצר כדי לנתח');
        return;
      }

      const btn = document.getElementById('runAiAnalysisBtn');
      btn.disabled = true;
      btn.innerHTML = `<span class="animate-pulse">✨ מנתח כשרות וערכים עם AI...</span>`;

      const result = await analyzeMealWithGemini(desc, pendingCompressedBase64);
      pendingAnalysisResult = result;

      renderPreviewAnalysisCard();

      btn.disabled = false;
      btn.innerHTML = `<span>✨ נתח שוב</span>`;
    }

    function overridePreviewKosher(kosherType) {
      if (!pendingAnalysisResult) return;
      pendingAnalysisResult.kosherType = kosherType;
      renderPreviewAnalysisCard();
    }

    function renderPreviewAnalysisCard() {
      if (!pendingAnalysisResult) return;
      const r = pendingAnalysisResult;
      document.getElementById('previewMealName').textContent = r.name;

      const badge = document.getElementById('previewKosherBadge');
      badge.textContent = `${getKosherEmoji(r.kosherType)} ${r.kosherType}`;
      badge.className = `px-2.5 py-1 rounded-full text-xs font-extrabold border ${getKosherBadgeClasses(r.kosherType)}`;

      ['בשרי', 'חלבי', 'פרווה'].forEach(kt => {
        const b = document.getElementById(`ovKosher-${kt}`);
        if (kt === r.kosherType) {
          b.className = `px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${getKosherBadgeClasses(kt)}`;
        } else {
          b.className = 'px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-500 border-slate-200';
        }
      });

      document.getElementById('previewNetCarbs').textContent = `${r.netCarbs}ג׳`;
      document.getElementById('previewProtein').textContent = `${r.protein}ג׳`;
      document.getElementById('previewCalories').textContent = `${r.calories}`;
      document.getElementById('previewFeedbackText').textContent = `💬 ${r.wittyTip}`;
      document.getElementById('aiAnalysisPreviewCard').classList.remove('hidden');
    }

    function finalizeMealLogging(mealObj, photoDataUrl) {
      const day = ensureDayRecord(state.selectedDateKey);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const entry = {
        id: 'ml_' + Date.now(),
        time: timeStr,
        timestamp: Date.now(),
        photo: photoDataUrl || null,
        name: mealObj.name,
        carbs: mealObj.netCarbs ?? mealObj.carbs ?? 0,
        protein: mealObj.protein,
        calories: mealObj.calories,
        kosherType: mealObj.kosherType || 'פרווה',
        status: mealObj.status || 'good',
        feedback: mealObj.wittyTip || mealObj.feedback || '',
        rating: null
      };

      day.meals.unshift(entry);

      if (state.selectedDateKey === getTodayKey() && entry.kosherType === 'בשרי') {
        state.kosher.lastMeatTimestamp = Date.now();
        state.kosher.lastMeatMealName = entry.name;
      }

      saveState();
      renderAll();

      if (state.selectedDateKey === getTodayKey() && entry.kosherType === 'בשרי' && state.kosher.waitHours > 0) {
        showToast(`🥩 נשמר! הופעל טיימר המתנה של ${state.kosher.waitHours} שעות לחלבי`);
      } else {
        showToast(`✅ ${entry.name} (${entry.kosherType}) נשמרה ביומן!`);
      }
      checkAchievements();
    }

    function confirmSaveAnalyzedMeal() {
      if (!pendingAnalysisResult) return;
      const toSave = { ...pendingAnalysisResult };
      const photoToSave = pendingCompressedDataUrl || null;

      pendingAnalysisResult = null;
      document.getElementById('mealDescInput').value = '';
      document.getElementById('aiAnalysisPreviewCard').classList.add('hidden');
      clearMealPhoto();
      closeMealSheet();

      finalizeMealLogging(toSave, photoToSave);
    }

    function logQuickKosherMeal(mealId) {
      const allQuick = [...state.aiMemory.customQuickMeals, ...CURATED_KOSHER_MEALS];
      const meal = allQuick.find(m => m.id === mealId);
      if (!meal) return;
      closeMealSheet();
      finalizeMealLogging(meal, null);
    }

    function deleteMealFromDay(dateKey, mealId) {
      const day = ensureDayRecord(dateKey);
      day.meals = day.meals.filter(m => m.id !== mealId);
      saveState();
      renderAll();
      showToast('הארוחה הוסרה');
    }

    // =========================================================================
    // 10. WEIGHT, BMI & HISTORY INTERACTIONS
    // =========================================================================
    function handleProfileFieldChange(field) {
      const h = parseFloat(document.getElementById('profHeightInput').value);
      const start = parseFloat(document.getElementById('profStartWeightInput').value);
      const curr = parseFloat(document.getElementById('profCurrentWeightInput').value);
      const target = parseFloat(document.getElementById('profTargetWeightInput').value);

      if (!isNaN(h) && h >= 120 && h <= 230) state.profile.heightCm = Math.round(h);
      if (!isNaN(start) && start >= 40 && start <= 250) {
        state.profile.startWeight = +start.toFixed(1);
        if (field === 'start') {
          state.profile.targetWeight = +(start - 10).toFixed(1);
        }
      }
      if (!isNaN(curr) && curr >= 40 && curr <= 250) state.profile.currentWeight = +curr.toFixed(1);
      if (!isNaN(target) && target >= 40 && target <= 250) state.profile.targetWeight = +target.toFixed(1);

      saveState();
      renderAll();
      showToast('✅ הפרופיל וה-BMI עודכנו וסונכרנו לענן');
    }

    function stepWeighIn(delta) {
      const inp = document.getElementById('quickWeighInInput');
      const base = parseFloat(inp.value) || state.profile.currentWeight || 88.0;
      inp.value = (base + delta).toFixed(1);
    }

    function logNewWeighIn() {
      const inp = document.getElementById('quickWeighInInput');
      const val = parseFloat(inp.value);
      if (isNaN(val) || val < 40 || val > 250) {
        showToast('נא להזין משקל תקין בק״ג');
        return;
      }

      const rounded = +val.toFixed(1);
      const prevWeight = state.profile.currentWeight;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      state.profile.currentWeight = rounded;
      state.weighIns.push({
        id: 'wi_' + Date.now(),
        date: getTodayKey(),
        time: timeStr,
        weight: rounded,
        note: ''
      });

      saveState();
      renderAll();
      if (rounded < prevWeight) celebrate(`⚖️ ${rounded} ק״ג — ירדת ${(prevWeight - rounded).toFixed(1)} ק״ג! 🎉`);
      else showToast(`⚖️ שקילה נשמרה: ${rounded} ק״ג. הכל חלק מהדרך 🌿`);
      checkAchievements();
    }

    function deleteWeighIn(id) {
      if (state.weighIns.length <= 1) {
        showToast('חייבת להישאר לפחות שקילה אחת בהיסטוריה');
        return;
      }
      state.weighIns = state.weighIns.filter(w => w.id !== id);
      const latest = state.weighIns[state.weighIns.length - 1];
      if (latest) state.profile.currentWeight = latest.weight;
      saveState();
      renderAll();
      showToast('השקילה נמחקה');
    }

    function switchHistorySubTab(subTab) {
      state.historySubTab = subTab;
      saveLocalOnly();
      renderHistoryExplorer();
    }

    function promptInlineReset() {
      document.getElementById('settingsInlineResetConfirm').classList.remove('hidden');
    }

    function cancelInlineReset() {
      document.getElementById('settingsInlineResetConfirm').classList.add('hidden');
    }

    function executeFullReset() {
      state = createDefaultState();
      saveState();
      cancelInlineReset();
      closeSettingsModal();
      renderAll();
      showToast('🔄 כל הנתונים אופסו בהצלחה');
    }

    function loadDemoData() {
      const base = createDefaultState();
      base.profile = {
        heightCm: 176,
        startWeight: 92.4,
        currentWeight: 88.6,
        targetWeight: 82.4
      };
      base.targets = { dailyCarbLimit: 75, dailyProteinTarget: 130, water: 2.0 };
      base.kosher = {
        waitHours: 6,
        lastMeatTimestamp: Date.now() - 95 * 60 * 1000,
        lastMeatMealName: 'חזה עוף על הפלנצ׳ה וסלט ירוק'
      };

      const d0 = getOffsetDateKey(0);
      const d1 = getOffsetDateKey(1);
      const d2 = getOffsetDateKey(2);
      const d3 = getOffsetDateKey(3);

      base.selectedDateKey = d0;
      base.days = {
        [d0]: {
          waterLiters: 2.0,
          sleepHours: 6.0,
          movementMinutes: 30,
          meals: [
            {
              id: 'dm_1',
              time: '13:30',
              photo: null,
              name: 'חזה עוף על הפלנצ׳ה וסלט ירוק',
              carbs: 6,
              protein: 38,
              calories: 340,
              kosherType: 'בשרי',
              status: 'excellent',
              feedback: '38 גרם חלבון נקי! שעון ההמתנה לחלבי פועל ברקע ברוגע.',
              rating: 'up'
            },
            {
              id: 'dm_2',
              time: '08:45',
              photo: null,
              name: 'שקשוקה 2 ביצים וטחינה',
              carbs: 10,
              protein: 18,
              calories: 310,
              kosherType: 'פרווה',
              status: 'excellent',
              feedback: 'פתיחת בוקר פרווה מאוזנת שמחזיקה שובע אחרי לילה קצר.',
              rating: 'up'
            }
          ]
        },
        [d1]: {
          waterLiters: 2.25,
          sleepHours: 7.5,
          movementMinutes: 45,
          meals: [
            {
              id: 'dm_3',
              time: '19:45',
              photo: null,
              name: 'חביתת ירק + קוטג׳ 5% וירקות',
              carbs: 8,
              protein: 24,
              calories: 290,
              kosherType: 'חלבי',
              status: 'excellent',
              feedback: 'ארוחת ערב חלבית קלילה ומדויקת.',
              rating: null
            },
            {
              id: 'dm_4',
              time: '13:15',
              photo: null,
              name: 'סלמון אפוי וברוקולי בשמן זית',
              carbs: 6,
              protein: 34,
              calories: 410,
              kosherType: 'פרווה',
              status: 'excellent',
              feedback: 'אומגה 3 וחלבון איכותי להתאוששות מעולה.',
              rating: 'up'
            }
          ]
        },
        [d2]: {
          waterLiters: 1.75,
          sleepHours: 7.0,
          movementMinutes: 0,
          meals: [
            {
              id: 'dm_5',
              time: '13:00',
              photo: null,
              name: 'שווארמה הודו ביתית עם טחינה וסלט',
              carbs: 9,
              protein: 35,
              calories: 390,
              kosherType: 'בשרי',
              status: 'excellent',
              feedback: 'שווארמה בלי הלאפה — טעים אש ומאוזן!',
              rating: 'up'
            }
          ]
        },
        [d3]: {
          waterLiters: 2.0,
          sleepHours: 7.5,
          movementMinutes: 20,
          meals: [
            {
              id: 'dm_6',
              time: '14:15',
              photo: null,
              name: 'סלט טונה, אבוקדו וביצה קשה',
              carbs: 7,
              protein: 29,
              calories: 360,
              kosherType: 'פרווה',
              status: 'excellent',
              feedback: 'פרווה מהיר ומנצח.',
              rating: null
            }
          ]
        }
      };

      base.weighIns = [
        { id: 'wi_1', date: getOffsetDateKey(24), time: '07:45', weight: 92.4, note: 'התחלה' },
        { id: 'wi_2', date: getOffsetDateKey(18), time: '07:50', weight: 91.5, note: '' },
        { id: 'wi_3', date: getOffsetDateKey(12), time: '08:00', weight: 90.4, note: '' },
        { id: 'wi_4', date: getOffsetDateKey(6), time: '07:40', weight: 89.3, note: '' },
        { id: 'wi_5', date: d0, time: '07:55', weight: 88.6, note: '' }
      ];

      base.shabbatCheckIns = [
        { id: 'sh_demo', dateKey: getOffsetDateKey(2), type: 'balanced' }
      ];

      state = base;
      saveState();
      renderAll();
      showToast('✨ נתוני הדגמה נטענו וסונכרנו לענן!');
    }

    // =========================================================================
    // 11. PERSONAL KOSHER AI COACH CHAT
    // =========================================================================
    function sendCoachQuickPrompt(text) {
      document.getElementById('coachInputField').value = text;
      handleCoachFormSubmit(new Event('submit'));
    }

    async function handleCoachFormSubmit(event) {
      event.preventDefault();
      const input = document.getElementById('coachInputField');
      const btn = document.getElementById('coachSendButton');
      const userMsg = input.value.trim();
      if (!userMsg) return;

      state.chatHistory.push({ id: 'u_' + Date.now(), role: 'user', text: userMsg });
      input.value = '';
      renderCoachFeed();

      btn.disabled = true;
      btn.textContent = '...';

      const feed = document.getElementById('coachMessagesFeed');
      const typingDiv = document.createElement('div');
      typingDiv.id = 'coachTypingIndicator';
      typingDiv.className = 'flex justify-start';
      typingDiv.innerHTML = `<div class="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-indigo-600 animate-pulse">מאוזן AI חושב...</div>`;
      feed.appendChild(typingDiv);
      feed.scrollTop = feed.scrollHeight;

      const todaySum = computeDaySummary(getTodayKey());
      const bmi = calculateBmi(state.profile.currentWeight, state.profile.heightCm);
      const remainingKg = Math.max(0, +(state.profile.currentWeight - state.profile.targetWeight).toFixed(1));
      const memoryPrompt = buildAiMemoryContextPrompt();

      const systemPrompt = `אתה "מאוזן AI" — מאמן בריאות ישראלי שנון, חם ומעודד לתזונה דלת-פחמימות מאוזנת, שמירת כשרות ושבת.
${memoryPrompt}

נתוני המשתמש החיים כרגע:
- משקל נוכחי: ${state.profile.currentWeight} ק״ג | משקל יעד: ${state.profile.targetWeight} ק״ג (נותרו ${remainingKg} ק״ג ליעד) | BMI: ${bmi}
- היום צרך: ${todaySum.netCarbs}ג׳ פחמימות מתוך ${todaySum.carbTarget}ג׳, ו-${todaySum.protein}ג׳ חלבון מתוך ${todaySum.proteinTarget}ג׳
- מים: ${todaySum.waterLiters} ל׳ | שינה: ${todaySum.sleepHours !== null ? todaySum.sleepHours + ' שעות' : 'לא דווח'}

הנחיות: ענה בעברית טבעית ותכל׳סית (2-4 משפטים), ציין תמיד אם המלצת האוכל היא [בשרי], [חלבי] או [פרווה], ואל תערבב לעולם בשר וחלב.`;

      const aiResponse = await callGemini({
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      });

      const ind = document.getElementById('coachTypingIndicator');
      if (ind) ind.remove();

      const finalReply = aiResponse
        ? aiResponse.trim()
        : getOfflineKosherCoachFallback(userMsg, todaySum, bmi, remainingKg);

      state.chatHistory.push({
        id: 'c_' + Date.now(),
        role: 'coach',
        text: finalReply,
        feedback: null
      });
      if (state.chatHistory.length > 36) state.chatHistory.shift();

      btn.disabled = false;
      btn.textContent = 'שלח';

      saveState();
      renderCoachFeed();
    }

    function getOfflineKosherCoachFallback(msg, sum, bmi, remKg) {
      const waitSt = getKosherWaitStatus();
      if (msg.includes('ערב')) {
        if (waitSt.isWaiting) {
          return `מכיוון שאתה כרגע בהמתנה מבשרי לחלבי (נותרו ${waitSt.formatted}), ארוחת ערב פגז היא שקשוקה 2 ביצים עם טחינה וסלט ירוק [פרווה] או סלט טונה ואבוקדו [פרווה] — משביע בטירוף!`;
        }
        return `פתוח לך עכשיו לחלבי, בשרי או פרווה! אופציה מעולה לערב: חביתת ירק עם קוטג׳ 5% וירקות [חלבי] (רק 8ג׳ פחמימה) או סלמון אפוי וברוקולי [פרווה].`;
      }
      if (msg.includes('מתוק') || msg.includes('הצילו')) {
        return 'חשק למתוק הוא כמעט תמיד עייפות בתחפושת. שתה כוס מים קרים, וקח קוביות ג׳לי פירות יער ללא סוכר [פרווה] או חופן אגוזי מלך עם קינמון [פרווה] — אפס דרמות!';
      }
      if (msg.includes('שבת')) {
        return 'בשבת שומרים על חיוך: פרוסת חלה מדודה בקידוש, דג מרוקאי/סלמון ללא סוכר [פרווה], עוף צלוי עם סלטים חיים וטחינה [בשרי], וקינוח פרווה קליל. הרצף שלך נשמר אוטומטית!';
      }
      return `אתה על BMI ${bmi} ונותרו לך ${remKg} ק״ג ליעד! היום צרכת ${sum.netCarbs}ג׳ פחמימות ו-${sum.waterLiters} ל׳ מים. שמור על חלבון כשר ואיכותי וצעד אחד רגוע כל יום.`;
    }

    // =========================================================================
    // 12. NAVIGATION & MODALS
    // =========================================================================
    function switchTab(tab) {
      state.activeTab = tab;
      saveLocalOnly();
      renderAll();
    }

    function switchCoachSubTab(subTab) {
      state.coachSubTab = subTab;
      saveLocalOnly();
      renderCoachTab();
    }

    function openInstallModal() {
      const notice = document.getElementById('installedNotice');
      if (notice) notice.classList.toggle('hidden', !isStandalone());
      if (deferredInstallPrompt) document.getElementById('androidNativeInstallBtn').classList.remove('hidden');
      updateVersionLabel();
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
      }
      updateCloudSyncHeaderUI();
      document.getElementById('installModal').classList.remove('hidden');
    }
    function closeInstallModal() {
      document.getElementById('installModal').classList.add('hidden');
    }

    function handleHeaderCloudClick() {
      updateCloudSyncHeaderUI();
      document.getElementById('cloudAccountModal').classList.remove('hidden');
    }
    function closeCloudAccountModal() {
      document.getElementById('cloudAccountModal').classList.add('hidden');
    }

    function openSettingsModal() {
      document.getElementById('settingKosherWaitSelect').value = String(state.kosher.waitHours);
      document.getElementById('settingCarbsInput').value = state.targets.dailyCarbLimit;
      document.getElementById('settingProteinInput').value = state.targets.dailyProteinTarget;
      document.getElementById('settingGeminiKeyInput').value = getGeminiKey();
      cancelInlineReset();
      document.getElementById('settingsModal').classList.remove('hidden');
    }
    function closeSettingsModal() {
      document.getElementById('settingsModal').classList.add('hidden');
    }

    function saveDailyTargetSettings() {
      const waitH = parseInt(document.getElementById('settingKosherWaitSelect').value, 10);
      const c = parseInt(document.getElementById('settingCarbsInput').value, 10);
      const p = parseInt(document.getElementById('settingProteinInput').value, 10);

      if (!isNaN(waitH) && [0, 3, 6].includes(waitH)) state.kosher.waitHours = waitH;
      if (!isNaN(c) && c >= 25 && c <= 150) state.targets.dailyCarbLimit = c;
      if (!isNaN(p) && p >= 60 && p <= 250) state.targets.dailyProteinTarget = p;

      const keyVal = document.getElementById('settingGeminiKeyInput').value.trim();
      try {
        if (keyVal) localStorage.setItem(GEMINI_KEY_STORAGE, keyVal);
        else localStorage.removeItem(GEMINI_KEY_STORAGE);
        noKeyToastShown = false;
      } catch (e) {}

      saveState();
      closeSettingsModal();
      renderAll();
      showToast('✅ ההגדרות נשמרו');
    }

    // =========================================================================
    // 13. RENDERING FUNCTIONS
    // =========================================================================
    function renderHeaderAndNav() {
      const bmi = calculateBmi(state.profile.currentWeight, state.profile.heightCm);
      const diff = +(state.profile.targetWeight - state.profile.startWeight).toFixed(1);
      const diffLabel = diff <= 0 ? `${diff} ק״ג` : `+${diff} ק״ג`;
      document.getElementById('headerGoalBmiPill').textContent = `יעד: ${diffLabel} | BMI ${bmi || '—'}`;

      const calPct = computeAiCalibrationPct();
      const navPct = document.getElementById('navCalibrationPct');
      if (navPct) navPct.textContent = `${calPct}%`;

      ['today', 'weight', 'coach', 'learning'].forEach(t => {
        const btn = document.getElementById(`navBtn-${t}`);
        const sec = document.getElementById(`view-${t}`);
        if (state.activeTab === t) {
          btn.className = 'flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-teal-600 bg-teal-50/90 transition';
          sec.classList.remove('hidden');
        } else {
          btn.className = 'flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-slate-400 hover:text-slate-600 transition';
          sec.classList.add('hidden');
        }
      });
    }

    function updateKosherTimerUI() {
      const st = getKosherWaitStatus();
      const bar = document.getElementById('kosherStatusBar');
      const icon = document.getElementById('kosherStatusIcon');
      const text = document.getElementById('kosherStatusText');
      const resetBtn = document.getElementById('kosherResetWaitBtn');

      if (st.isWaiting) {
        bar.className = 'rounded-2xl px-3.5 py-2.5 bg-rose-50/90 border border-rose-200 flex items-center justify-between gap-2 text-xs';
        icon.textContent = '🥩';
        text.className = 'font-extrabold text-rose-900 truncate tabular-nums';
        text.textContent = `בשרי — נותרו ${st.formatted} להמתנה לחלבי (מותר פרווה/בשרי)`;
        resetBtn.classList.remove('hidden');
      } else {
        bar.className = 'rounded-2xl px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2 text-xs';
        icon.textContent = '🌿';
        text.className = 'font-bold text-emerald-950 truncate';
        text.textContent = 'סטטוס כשרות: פתוח לחלבי, בשרי ופרווה';
        resetBtn.classList.add('hidden');
      }
    }

    function renderSevenDayStrip() {
      const strip = document.getElementById('sevenDayStrip');
      const items = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = formatDateKey(d);
        const isSelected = key === state.selectedDateKey;
        const isShabbat = d.getDay() === 6;

        let topLabel = HEBREW_DAY_LETTERS[d.getDay()];
        if (i === 0) topLabel = isShabbat ? '🕯️ שבת' : 'היום';
        else if (i === 1) topLabel = isShabbat ? '🕯️ שבת' : 'אתמול';
        else if (isShabbat) topLabel = '🕯️ ש׳';

        const dateNum = `${d.getDate()}/${d.getMonth() + 1}`;
        const dayRec = state.days[key];
        let dotColor = 'bg-slate-300';
        if (isShabbat) {
          dotColor = 'bg-amber-400';
        } else if (dayRec && (dayRec.meals.length > 0 || dayRec.waterLiters > 0 || dayRec.sleepHours !== null || (dayRec.movementMinutes && dayRec.movementMinutes > 0))) {
          const carbs = dayRec.meals.reduce((s, m) => s + (Number(m.carbs ?? m.netCarbs) || 0), 0);
          dotColor = carbs > state.targets.dailyCarbLimit ? 'bg-amber-400' : 'bg-emerald-500';
        }

        items.push(`
          <button onclick="selectDay('${key}')" class="py-2 px-0.5 rounded-2xl flex flex-col items-center justify-center transition active:scale-95 tabular-nums ${
            isSelected
              ? (isShabbat ? 'bg-amber-500 text-white shadow-xs' : 'bg-teal-600 text-white shadow-xs')
              : (isShabbat ? 'bg-amber-50/70 text-amber-900 hover:bg-amber-100/70' : 'hover:bg-slate-50 text-slate-600')
          }">
            <span class="text-[10px] font-extrabold leading-none truncate max-w-full">${topLabel}</span>
            <span class="text-[10px] font-bold mt-1 ${isSelected ? 'text-white/90' : 'text-slate-400'}">${dateNum}</span>
            <span class="w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-white' : dotColor}"></span>
          </button>
        `);
      }

      strip.innerHTML = items.join('');
    }

    function renderTodayTab() {
      renderGreeting();
      renderSevenDayStrip();
      updateKosherTimerUI();

      const shabbatBanner = document.getElementById('shabbatDayBanner');
      if (isSaturdayDateKey(state.selectedDateKey) || new Date().getDay() === 6) {
        shabbatBanner.classList.remove('hidden');
      } else {
        shabbatBanner.classList.add('hidden');
      }

      const sum = computeDaySummary(state.selectedDateKey);

      const circumference = 289.03;
      const ratio = Math.min(1, sum.netCarbs / sum.carbTarget);
      const offset = circumference - ratio * circumference;
      const ring = document.getElementById('carbsRingCircle');
      ring.style.strokeDashoffset = offset.toFixed(2);
      ring.style.stroke = sum.netCarbs > sum.carbTarget ? '#F59E0B' : '#0D9488';

      const remaining = sum.carbTarget - sum.netCarbs;
      if (remaining >= 0) {
        document.getElementById('carbsRemainingNum').textContent = `${remaining}ג׳`;
        document.getElementById('carbsRemainingLabel').textContent = 'נותרו לפחמימה';
      } else {
        document.getElementById('carbsRemainingNum').textContent = `+${Math.abs(remaining)}ג׳`;
        document.getElementById('carbsRemainingLabel').textContent = 'מעל היעד היומי';
      }

      document.getElementById('dayCarbsConsumed').textContent = sum.netCarbs;
      document.getElementById('dayCarbsTargetDisplay').textContent = sum.carbTarget;
      document.getElementById('vitalityScoreBadge').textContent = `${sum.vitality}%`;

      document.getElementById('dayProteinConsumed').textContent = sum.protein;
      document.getElementById('dayProteinTargetDisplay').textContent = sum.proteinTarget;
      document.getElementById('dayCaloriesConsumed').textContent = sum.calories;

      const protPct = Math.min(100, Math.round((sum.protein / sum.proteinTarget) * 100));
      document.getElementById('dayProteinBar').style.width = `${protPct}%`;

      const bannerEl = document.getElementById('wittyStatusBanner');
      const bannerIcon = document.getElementById('wittyBannerIcon');
      const bannerText = document.getElementById('wittyBannerText');

      if (sum.sleepHours !== null && sum.sleepHours < 6.5) {
        bannerEl.className = 'px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5';
        bannerIcon.textContent = '💛';
        bannerText.className = 'text-xs text-amber-950 leading-relaxed font-medium';
        bannerText.textContent = `מצב חמלה ללילה קצר (${sum.sleepHours} ש׳ שינה): היום מתמקדים בחלבון כשר, ${sum.waterTarget} ל׳ מים ו-0 רגשות אשם — אל תיפול למלכודת הסוכר!`;
      } else if (sum.waterLiters >= sum.waterTarget) {
        bannerEl.className = 'px-3.5 py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5';
        bannerIcon.textContent = '💧';
        bannerText.className = 'text-xs text-emerald-950 leading-relaxed font-medium';
        bannerText.textContent = `אלוף! הגעת ל-${sum.waterLiters.toFixed(2)} ליטר מים — החיוניות למעלה והרעב המדומה מנוטרל.`;
      } else if (sum.netCarbs > sum.carbTarget) {
        bannerEl.className = 'px-3.5 py-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2.5';
        bannerIcon.textContent = '🌿';
        bannerText.className = 'text-xs text-slate-700 leading-relaxed font-medium';
        bannerText.textContent = 'חריגה קטנה בפחמימות — הכל טוב! בארוחה הבאה פשוט תן דגש על חלבון וירקות והאיזון חוזר.';
      } else {
        bannerEl.className = 'px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5';
        bannerIcon.textContent = '✨';
        bannerText.className = 'text-xs text-slate-700 leading-relaxed font-medium';
        bannerText.textContent = sum.meals.length > 0
          ? `איזון נהדר! צרכת ${sum.netCarbs}ג׳ פחמימות ו-${sum.protein}ג׳ חלבון — שליטה רגועה ובלי דרמות.`
          : 'יום חדש, דף חלק! תעד ארוחה כשרה בצילום או בנגיעה ונשמור על אנרגיה גבוהה.';
      }

      document.getElementById('habitWaterVal').textContent = sum.waterLiters.toFixed(2);
      document.getElementById('habitWaterTarget').textContent = sum.waterTarget.toFixed(1);
      const waterPct = Math.min(100, Math.round((sum.waterLiters / sum.waterTarget) * 100));
      document.getElementById('waterCardFill').style.height = `${waterPct}%`;

      const sleepValEl = document.getElementById('habitSleepVal');
      const sleepTagEl = document.getElementById('sleepShortTag');
      if (sum.sleepHours === null) {
        sleepValEl.textContent = 'לא דווח';
        sleepValEl.className = 'text-xs font-extrabold text-slate-400 mt-1';
        sleepTagEl.classList.add('hidden');
      } else {
        sleepValEl.textContent = `${sum.sleepHours} ש׳`;
        sleepValEl.className = 'text-sm font-extrabold text-slate-900 mt-0.5';
        if (sum.sleepHours < 6.5) sleepTagEl.classList.remove('hidden');
        else sleepTagEl.classList.add('hidden');
      }

      const moveMins = sum.movementMinutes;
      document.getElementById('habitMoveEmoji').textContent = moveMins >= 30 ? '🏃' : (moveMins > 0 ? '🚶' : '🛋️');
      document.getElementById('habitMoveLabel').textContent = moveMins > 0 ? `${moveMins} דק׳` : 'מנוחה';
      const moveDot = document.getElementById('habitMoveActiveDot');
      if (moveMins > 0) moveDot.classList.remove('hidden');
      else moveDot.classList.add('hidden');

      const titleLabel = state.selectedDateKey === getTodayKey()
        ? 'הארוחות הכשרות שלי היום'
        : `הארוחות שלי (${formatHebrewShortDate(state.selectedDateKey)})`;
      document.getElementById('mealsSectionTitle').textContent = titleLabel;

      const listContainer = document.getElementById('dayMealsListContainer');
      if (sum.meals.length === 0) {
        listContainer.innerHTML = `
          <div class="bg-white rounded-3xl p-6 border border-dashed border-slate-300 text-center space-y-2">
            <div class="text-2xl">🍽️</div>
            <p class="text-xs font-semibold text-slate-500">עוד לא נרשמו ארוחות ליום זה</p>
            <button onclick="openMealSheet('ai')" class="px-4 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-extrabold transition">
              + צלם או בחר ארוחה כשרה
            </button>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = sum.meals.map(m => {
        const kType = m.kosherType || 'פרווה';
        const kBadgeClass = getKosherBadgeClasses(kType);
        const kEmoji = getKosherEmoji(kType);
        const carbsNum = Number(m.carbs ?? m.netCarbs) || 0;
        const tipText = m.feedback || m.wittyTip || '';
        const carbBadgeStyle = carbsNum > 25
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-teal-50 text-teal-700 border-teal-200';

        const photoThumb = m.photo
          ? `<img src="${m.photo}" alt="${esc(m.name)}" class="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200" />`
          : `<div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-xl shrink-0">${kEmoji}</div>`;

        const upActive = m.rating === 'up' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-emerald-50';
        const downActive = m.rating === 'down' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-rose-50';

        return `
          <article class="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-card space-y-2.5 animate-fade-up">
            <div class="flex items-start gap-3">
              ${photoThumb}
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-1.5">
                  <div class="min-w-0">
                    <h3 class="text-sm font-extrabold text-slate-900 truncate">${esc(m.name)}</h3>
                    <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${kBadgeClass}">
                      <span>${kEmoji}</span>
                      <span>${esc(kType)}</span>
                    </span>
                  </div>
                  <button onclick="deleteMealFromDay('${state.selectedDateKey}', '${m.id}')" aria-label="מחק ארוחה" class="text-slate-300 hover:text-rose-500 text-xs p-1 transition">✕</button>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 mt-2 tabular-nums">
                  <span class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold border ${carbBadgeStyle}">${carbsNum}ג׳ פחמימה</span>
                  <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">${m.protein}ג׳ חלבון</span>
                  <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">${m.calories} קק״ל</span>
                  <span class="text-[11px] text-slate-400 font-semibold">${esc(m.time)}</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl px-3 py-2 flex items-center justify-between gap-2">
              <p class="text-xs text-slate-600 leading-relaxed flex-1">💬 ${esc(tipText)}</p>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="recordAiFeedback('meal', '${m.id}', 'up')" title="מדויק לי / אהבתי" class="px-2 py-1 rounded-xl border text-[11px] font-extrabold transition active:scale-90 ${upActive}">👍</button>
                <button onclick="recordAiFeedback('meal', '${m.id}', 'down')" title="פחות מתאים" class="px-2 py-1 rounded-xl border text-[11px] font-extrabold transition active:scale-90 ${downActive}">👎</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderQuickFavoritesGrid() {
      const container = document.getElementById('quickFavoritesGrid');
      const waitSt = getKosherWaitStatus();
      const allQuick = [...state.aiMemory.customQuickMeals, ...CURATED_KOSHER_MEALS];

      container.innerHTML = allQuick.map(meal => {
        const kBadgeClass = getKosherBadgeClasses(meal.kosherType);
        const kEmoji = getKosherEmoji(meal.kosherType);
        const isRecommendedDuringWait = waitSt.isWaiting && (meal.kosherType === 'פרווה' || meal.kosherType === 'בשרי');
        const isDairyBlockedWarning = waitSt.isWaiting && meal.kosherType === 'חלבי';

        return `
          <button type="button" onclick="logQuickKosherMeal('${meal.id}')" class="w-full text-right p-3 rounded-2xl border flex items-center justify-between gap-2 transition active:scale-[0.98] ${
            isRecommendedDuringWait
              ? 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-300'
              : (isDairyBlockedWarning
                  ? 'bg-slate-50/60 opacity-75 border-slate-200'
                  : 'bg-slate-50 hover:bg-teal-50 border-slate-200 hover:border-teal-300')
          }">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs font-extrabold text-slate-900 truncate">${esc(meal.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${kBadgeClass}">${kEmoji} ${esc(meal.kosherType)}</span>
                ${meal.isCustomAi ? `<span class="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-extrabold">🧠 AI</span>` : ''}
                ${isRecommendedDuringWait ? `<span class="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-extrabold">מותר כעת ✓</span>` : ''}
                ${isDairyBlockedWarning ? `<span class="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[9px] font-extrabold">בהמתנה מבשרי</span>` : ''}
              </div>
              <div class="text-[11px] text-slate-500 font-semibold mt-1 tabular-nums">
                ${meal.netCarbs}ג׳ פחמימה • ${meal.protein}ג׳ חלבון • ${meal.calories} קק״ל
              </div>
            </div>
            <span class="px-2.5 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-extrabold shrink-0">+ הוסף</span>
          </button>
        `;
      }).join('');
    }

    function renderWeightAndBmiTab() {
      const p = state.profile;
      document.getElementById('profHeightInput').value = p.heightCm;
      document.getElementById('profStartWeightInput').value = p.startWeight;
      document.getElementById('profCurrentWeightInput').value = p.currentWeight;
      document.getElementById('profTargetWeightInput').value = p.targetWeight;
      document.getElementById('quickWeighInInput').value = p.currentWeight.toFixed(1);

      const currentBmi = calculateBmi(p.currentWeight, p.heightCm);
      const targetBmi = calculateBmi(p.targetWeight, p.heightCm);
      const catInfo = getBmiCategoryInfo(currentBmi);

      const catBadge = document.getElementById('bmiCategoryBadge');
      catBadge.textContent = catInfo.label;
      catBadge.className = `px-2.5 py-1 rounded-full text-xs font-extrabold border ${catInfo.badgeClass}`;

      document.getElementById('currentBmiDisplay').textContent = currentBmi || '—';
      document.getElementById('targetBmiDisplay').textContent = targetBmi || '—';

      const remainingKg = Math.max(0, +(p.currentWeight - p.targetWeight).toFixed(1));
      document.getElementById('kgRemainingDisplay').textContent = `${remainingKg.toFixed(1)} ק״ג`;

      const currPin = document.getElementById('currentBmiPin');
      const targPin = document.getElementById('targetBmiPin');
      if (currentBmi > 0 && targetBmi > 0) {
        currPin.classList.remove('hidden');
        targPin.classList.remove('hidden');
        currPin.style.left = `${bmiToPercentOnGauge(currentBmi)}%`;
        targPin.style.left = `${bmiToPercentOnGauge(targetBmi)}%`;
      }

      const lostSoFar = Math.max(0, +(p.startWeight - p.currentWeight).toFixed(1));
      document.getElementById('totalLostSummaryText').textContent = `ירדת ${lostSoFar.toFixed(1)} ק״ג`;

      const milestones = [2.5, 5.0, 7.5, 10.0];
      document.getElementById('milestonesGrid').innerHTML = milestones.map(ms => {
        const achieved = lostSoFar >= ms;
        const pct = Math.min(100, Math.round((lostSoFar / ms) * 100));
        return `
          <div class="p-2.5 rounded-2xl border text-center transition ${
            achieved
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }">
            <div class="text-sm">${achieved ? '🏆' : '🎯'}</div>
            <div class="text-xs font-extrabold mt-0.5">-${ms} ק״ג</div>
            <div class="text-[10px] font-bold mt-0.5 ${achieved ? 'text-emerald-700' : 'text-slate-400'}">
              ${achieved ? 'הושג!' : `${pct}%`}
            </div>
          </div>
        `;
      }).join('');

      renderWeightSvgChart();
      renderHistoryExplorer();
    }

    function renderWeightSvgChart() {
      const svg = document.getElementById('weightTrendSvg');
      const entries = state.weighIns || [];
      if (!svg || entries.length === 0) return;

      const W = 340;
      const H = 175;
      const padL = 38;
      const padR = 16;
      const padT = 18;
      const padB = 28;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const targetW = state.profile.targetWeight;
      const allVals = [...entries.map(e => e.weight), targetW];
      const minW = Math.min(...allVals) - 1.0;
      const maxW = Math.max(...allVals) + 1.0;
      const span = Math.max(1.0, maxW - minW);

      const yForWeight = (w) => padT + plotH * (1 - (w - minW) / span);

      const pts = entries.map((e, idx) => {
        const x = entries.length === 1
          ? padL + plotW / 2
          : padL + (plotW * idx) / (entries.length - 1);
        const dk = e.date || e.dateKey || getTodayKey();
        return {
          x,
          y: yForWeight(e.weight),
          label: formatHebrewShortDate(dk),
          weight: e.weight
        };
      });

      let gridHtml = '';
      for (let i = 0; i <= 2; i++) {
        const y = padT + (plotH * i) / 2;
        const val = (maxW - (span * i) / 2).toFixed(1);
        gridHtml += `
          <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#E2E8F0" stroke-width="1" />
          <text x="${padL - 6}" y="${y + 4}" text-anchor="end" fill="#94A3B8" font-size="10" font-weight="600">${val}</text>
        `;
      }

      const targetY = yForWeight(targetW);
      const targetLineHtml = `
        <line x1="${padL}" y1="${targetY.toFixed(1)}" x2="${W - padR}" y2="${targetY.toFixed(1)}" stroke="#059669" stroke-width="1.8" stroke-dasharray="5 4" />
        <text x="${W - padR}" y="${(targetY - 5).toFixed(1)}" text-anchor="end" fill="#059669" font-size="10" font-weight="800">יעד ${targetW} ק״ג</text>
      `;

      const polyStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      const areaStr = `${pts[0].x.toFixed(1)},${padT + plotH} ${polyStr} ${pts[pts.length - 1].x.toFixed(1)},${padT + plotH}`;

      const dotsHtml = pts.map((p, i) => `
        <g onclick="selectChartWeightPoint('${p.label}', ${p.weight})" class="cursor-pointer">
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="12" fill="transparent" />
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#0D9488" stroke="#FFFFFF" stroke-width="2" />
          ${(entries.length <= 6 || i % 2 === 0 || i === entries.length - 1)
            ? `<text x="${p.x.toFixed(1)}" y="${H - 8}" text-anchor="middle" fill="#64748B" font-size="10" font-weight="600">${p.label}</text>`
            : ''}
        </g>
      `).join('');

      const lastPt = pts[pts.length - 1];
      document.getElementById('chartPointHoverLabel').textContent = `${lastPt.label}: ${lastPt.weight} ק״ג`;

      svg.innerHTML = `
        <defs>
          <linearGradient id="weightAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0D9488" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#0D9488" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${targetLineHtml}
        ${pts.length > 1 ? `<polygon points="${areaStr}" fill="url(#weightAreaFill)" />` : ''}
        ${pts.length > 1 ? `<polyline points="${polyStr}" fill="none" stroke="#0D9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${dotsHtml}
      `;
    }

    function selectChartWeightPoint(label, weight) {
      document.getElementById('chartPointHoverLabel').textContent = `${label}: ${weight} ק״ג`;
    }

    function renderHistoryExplorer() {
      const wBtn = document.getElementById('histSubTab-weights');
      const dBtn = document.getElementById('histSubTab-days');
      const wCont = document.getElementById('historyWeighInsContainer');
      const dCont = document.getElementById('historyDaysContainer');

      if (state.historySubTab === 'weights') {
        wBtn.className = 'py-2 rounded-xl text-xs font-extrabold bg-white text-slate-900 shadow-xs transition';
        dBtn.className = 'py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition';
        wCont.classList.remove('hidden');
        dCont.classList.add('hidden');
      } else {
        dBtn.className = 'py-2 rounded-xl text-xs font-extrabold bg-white text-slate-900 shadow-xs transition';
        wBtn.className = 'py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition';
        dCont.classList.remove('hidden');
        wCont.classList.add('hidden');
      }

      const list = state.weighIns || [];
      const reversedWithPrev = list.map((item, idx) => {
        const prev = idx > 0 ? list[idx - 1].weight : null;
        const diff = prev !== null ? +(item.weight - prev).toFixed(1) : null;
        return { ...item, diff };
      }).reverse();

      wCont.innerHTML = reversedWithPrev.map(w => {
        const bmiAtDate = calculateBmi(w.weight, state.profile.heightCm);
        const dk = w.date || w.dateKey || getTodayKey();
        let diffBadge = `<span class="text-[11px] font-bold text-slate-400">נקודת פתיחה</span>`;
        if (w.diff !== null) {
          if (w.diff < 0) diffBadge = `<span class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-extrabold">${w.diff} ק״ג</span>`;
          else if (w.diff > 0) diffBadge = `<span class="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-extrabold">+${w.diff} ק״ג</span>`;
          else diffBadge = `<span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">ללא שינוי</span>`;
        }

        return `
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 tabular-nums">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold text-slate-900">${w.weight.toFixed(1)} ק״ג</span>
                ${diffBadge}
              </div>
              <div class="text-[11px] text-slate-400 font-semibold mt-0.5">
                ${formatHebrewShortDate(dk)} • ${w.time || '08:00'} • BMI ${bmiAtDate}
              </div>
            </div>
            <button onclick="deleteWeighIn('${w.id}')" aria-label="מחק שקילה" class="text-slate-300 hover:text-rose-500 text-xs p-1.5 transition">✕</button>
          </div>
        `;
      }).join('');

      const dayKeys = Object.keys(state.days).sort().reverse();
      dCont.innerHTML = dayKeys.map(dk => {
        const sum = computeDaySummary(dk);
        const isShab = isSaturdayDateKey(dk);
        const dayTitle = dk === getTodayKey()
          ? `היום (${formatHebrewShortDate(dk)})`
          : (dk === getOffsetDateKey(1) ? `אתמול (${formatHebrewShortDate(dk)})` : `${isShab ? '🕯️ שבת ' : ''}${formatHebrewShortDate(dk)}`);

        const mealsHtml = sum.meals.length === 0
          ? `<p class="text-[11px] text-slate-400 pt-1">${isShab ? '🕯️ שבת מנוחה — הרצף שמור אוטומטית' : 'לא נרשמו ארוחות ביום זה'}</p>`
          : sum.meals.map(m => {
              const kt = m.kosherType || 'פרווה';
              const cVal = Number(m.carbs ?? m.netCarbs) || 0;
              return `
                <div class="flex items-center justify-between gap-2 py-1.5 border-t border-slate-200/60 text-xs">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${getKosherBadgeClasses(kt)}">${esc(kt)}</span>
                    <span class="font-bold text-slate-800 truncate">${esc(m.name)}</span>
                  </div>
                  <span class="text-[11px] font-extrabold text-teal-700 shrink-0 tabular-nums">${cVal}ג׳ פח׳ | ${m.protein}ג׳ חל׳</span>
                </div>
              `;
            }).join('');

        return `
          <details class="group p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2" ${dk === getTodayKey() ? 'open' : ''}>
            <summary class="cursor-pointer list-none flex items-center justify-between gap-2">
              <div>
                <div class="text-xs font-extrabold text-slate-900">${dayTitle}</div>
                <div class="text-[11px] text-slate-500 font-semibold mt-0.5 tabular-nums">
                  ${sum.netCarbs}ג׳ פחמימה • ${sum.protein}ג׳ חלבון • 💧 ${sum.waterLiters}ל׳ • חיוניות ${sum.vitality}%
                </div>
              </div>
              <span class="text-xs font-bold text-teal-600 group-open:rotate-180 transition">▾</span>
            </summary>
            <div class="pt-1 space-y-1">
              ${mealsHtml}
            </div>
          </details>
        `;
      }).join('');
    }

    function renderCoachTab() {
      const chatBtn = document.getElementById('coachSubBtn-chat');
      const shabBtn = document.getElementById('coachSubBtn-shabbat');
      const chatView = document.getElementById('coachSubView-chat');
      const shabView = document.getElementById('coachSubView-shabbat');

      if (state.coachSubTab === 'shabbat') {
        shabBtn.className = 'py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 text-white shadow-xs transition';
        chatBtn.className = 'py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition';
        shabView.classList.remove('hidden');
        chatView.classList.add('hidden');
      } else {
        chatBtn.className = 'py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 text-white shadow-xs transition';
        shabBtn.className = 'py-2.5 rounded-xl text-xs font-bold text-amber-900 hover:bg-amber-50 transition';
        chatView.classList.remove('hidden');
        shabView.classList.add('hidden');
      }

      renderCoachFeed();
    }

    function renderCoachFeed() {
      const feed = document.getElementById('coachMessagesFeed');
      feed.innerHTML = state.chatHistory.map(m => {
        const isCoach = m.role === 'coach';
        if (!isCoach) {
          return `
            <div class="flex justify-end">
              <div class="max-w-[85%] px-4 py-3 rounded-3xl text-xs sm:text-sm leading-relaxed bg-indigo-600 text-white font-medium rounded-tl-md shadow-xs">
                ${esc(m.text)}
              </div>
            </div>
          `;
        }

        const upCls = m.feedback === 'up' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-200';
        const downCls = m.feedback === 'down' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-500 border-slate-200';

        return `
          <div class="flex justify-start">
            <div class="max-w-[88%] p-3.5 rounded-3xl bg-white border border-slate-200 text-slate-800 shadow-card rounded-tr-md space-y-2">
              <div class="text-xs sm:text-sm leading-relaxed">${esc(m.text)}</div>
              <div class="flex items-center justify-end gap-1 pt-1 border-t border-slate-100">
                <span class="text-[10px] text-slate-400 ml-1">עזר לך?</span>
                <button onclick="recordAiFeedback('chat', '${m.id}', 'up')" class="px-2 py-0.5 rounded-lg border text-[10px] font-extrabold transition ${upCls}">👍 מדויק</button>
                <button onclick="recordAiFeedback('chat', '${m.id}', 'down')" class="px-2 py-0.5 rounded-lg border text-[10px] font-extrabold transition ${downCls}">👎</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      feed.scrollTop = feed.scrollHeight;
    }

    function renderLearningTab() {
      const calPct = computeAiCalibrationPct();
      document.getElementById('brainCardCalibrationPct').textContent = `${calPct}%`;
      document.getElementById('brainCalibrationBar').style.width = `${calPct}%`;

      const upgContainer = document.getElementById('pendingUpgradesContainer');
      if (state.aiMemory.pendingUpgrades.length === 0) {
        upgContainer.innerHTML = `
          <div class="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
            כל השדרוגים הנוכחיים אומצו! לחץ על <b>״✨ הפעל סריקת למידה עמוקה״</b> למעלה ליצירת שדרוגים חדשים.
          </div>
        `;
      } else {
        upgContainer.innerHTML = state.aiMemory.pendingUpgrades.map(u => `
          <div class="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <div class="text-xs font-extrabold text-indigo-950">${esc(u.title)}</div>
            <p class="text-[11px] text-slate-600 leading-relaxed">${esc(u.description)}</p>
            <button onclick="adoptAppUpgrade('${u.id}')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-2xs transition active:scale-95">
              ⚡ אמץ שיפור באפליקציה
            </button>
          </div>
        `).join('');
      }

      const insContainer = document.getElementById('discoveredInsightsContainer');
      insContainer.innerHTML = state.aiMemory.discoveredInsights.map(ins => {
        const upCls = ins.feedback === 'up' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200';
        const downCls = ins.feedback === 'down' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-200';
        return `
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <div class="text-xs font-extrabold text-slate-900">${esc(ins.title)}</div>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="recordAiFeedback('insight', '${ins.id}', 'up')" class="px-2 py-0.5 rounded-lg border text-[10px] font-extrabold transition ${upCls}">👍 מדויק</button>
                <button onclick="recordAiFeedback('insight', '${ins.id}', 'down')" class="px-2 py-0.5 rounded-lg border text-[10px] font-extrabold transition ${downCls}">👎</button>
              </div>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">${esc(ins.detail)}</p>
          </div>
        `;
      }).join('');

      const chipsContainer = document.getElementById('aiMemoryChipsContainer');
      const chips = [];

      state.aiMemory.customNotes.forEach((n, idx) => {
        chips.push(`
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-bold">
            <span>🧬 ${esc(n)}</span>
            <button onclick="removeMemoryItem('note', ${idx})" class="text-indigo-400 hover:text-rose-600 font-extrabold">✕</button>
          </span>
        `);
      });

      state.aiMemory.likedPatterns.forEach((lk, idx) => {
        chips.push(`
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <span>👍 ${esc(lk)}</span>
            <button onclick="removeMemoryItem('liked', ${idx})" class="text-emerald-400 hover:text-rose-600 font-extrabold">✕</button>
          </span>
        `);
      });

      state.aiMemory.dislikedPatterns.forEach((dl, idx) => {
        chips.push(`
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
            <span>👎 ${esc(dl)}</span>
            <button onclick="removeMemoryItem('disliked', ${idx})" class="text-rose-400 hover:text-rose-700 font-extrabold">✕</button>
          </span>
        `);
      });

      chipsContainer.innerHTML = chips.length
        ? chips.join('')
        : `<span class="text-[11px] text-slate-400">דרג ארוחות או הוסף כלל אישי למעלה כדי לבנות את הזיכרון.</span>`;

      const adoptedList = document.getElementById('adoptedUpgradesList');
      if (state.aiMemory.adoptedUpgrades.length === 0) {
        adoptedList.innerHTML = `<p class="text-[11px] text-slate-400">עוד לא אומצו שדרוגים — לחץ על ״אמץ שיפור באפליקציה״ למעלה.</p>`;
      } else {
        adoptedList.innerHTML = state.aiMemory.adoptedUpgrades.map(a => `
          <div class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px]">
            <span class="font-bold text-emerald-950 truncate">✓ ${esc(a.title)}</span>
            <span class="text-emerald-700 font-semibold shrink-0 tabular-nums">${esc(a.dateLabel)}</span>
          </div>
        `).join('');
      }
    }

    function renderAll() {
      renderHeaderAndNav();
      renderTodayTab();
      renderWeightAndBmiTab();
      renderCoachTab();
      renderLearningTab();
      updateCloudSyncHeaderUI();
    }

    // =========================================================================
    // 13b. MOTIVATION, STREAK, CELEBRATIONS, ONBOARDING
    // =========================================================================
    const MOTIVATION = [
      'כל ארוחה טובה היא הצבעה לגרסה שאתה רוצה להיות 🌱',
      'עקביות רגועה מנצחת כל דיאטת קיצון.',
      'אין "הכל או כלום". גם יום חלקי נחשב ✨',
      'חלבון בכל ארוחה = שובע ושמירה על שריר. פשוט ויעיל 💪',
      'מים לפני החלטות. לפעמים זה רק צמא בתחפושת 💧',
      'חצי קילו בשבוע זה קצב מצוין, יציב ובר-קיימא.',
      'שבת היא ההפסקה שמאפשרת להמשיך. אין צורך לחשב אותה 🕯️',
      'התקדמות לא תמיד נראית על המשקל — שינה ותנועה נחשבות גם הן 😴',
      'נפלת? מנערים וממשיכים. הארוחה הבאה היא התחלה חדשה 🌿',
      'החלק הכי קשה הוא להתמיד, ואתה כבר בתוכו.'
    ];
    let motivationOffset = 0;

    function getMotivation() {
      const pool = [...MOTIVATION];
      const lost = +(state.profile.startWeight - state.profile.currentWeight).toFixed(1);
      const rem = +(state.profile.currentWeight - state.profile.targetWeight).toFixed(1);
      if (lost > 0) pool.unshift(`ירדת כבר ${lost} ק״ג — זה אמיתי ומצטבר 🏆`);
      if (rem > 0 && rem <= 3) pool.unshift(`נשארו רק ${rem} ק״ג ליעד — כמעט שם! 🎯`);
      const dayNum = Math.floor(Date.now() / 864e5);
      return pool[(dayNum + motivationOffset) % pool.length];
    }

    function newMotivation() {
      motivationOffset += 1;
      renderGreeting();
    }

    function computeStreak() {
      let streak = 0;
      for (let i = 0; i < 400; i++) {
        const key = getOffsetDateKey(i);
        const day = state.days[key];
        const weighed = (state.weighIns || []).some(w => (w.date || w.dateKey) === key && w.id !== 'wi_init');
        const active = weighed || (day && ((day.meals && day.meals.length > 0) || day.waterLiters > 0 || day.sleepHours !== null || day.movementMinutes > 0));
        if (active) streak++;
        else if (isSaturdayDateKey(key)) continue;   // שבת מוגנת: לא שוברת ולא נספרת
        else if (i === 0) continue;                  // היום עוד לא הסתיים
        else break;
      }
      return streak;
    }

    function renderGreeting() {
      const h = new Date().getHours();
      let hello = 'לילה טוב';
      if (h >= 5 && h < 12) hello = 'בוקר טוב';
      else if (h >= 12 && h < 17) hello = 'צהריים טובים';
      else if (h >= 17 && h < 22) hello = 'ערב טוב';
      const name = (state.profile.name || '').trim();
      document.getElementById('greetingTitle').textContent = name ? `${hello}, ${name}!` : `${hello}!`;
      document.getElementById('motivationText').textContent = getMotivation();
      document.getElementById('streakBadge').textContent = `🔥 ${computeStreak()}`;
    }

    function celebrate(message, big = false) {
      if (message) showToast(message);
      try { if (navigator.vibrate) navigator.vibrate(big ? [60, 40, 60, 40, 120] : [40]); } catch (e) {}
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cv = document.createElement('canvas');
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70';
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      document.body.appendChild(cv);
      const ctx = cv.getContext('2d');
      const colors = ['#0D9488', '#059669', '#4F46E5', '#F59E0B', '#F43F5E', '#38BDF8'];
      const parts = Array.from({ length: big ? 120 : 50 }, () => ({
        x: cv.width / 2 + (Math.random() - 0.5) * 80,
        y: cv.height * 0.65,
        vx: (Math.random() - 0.5) * 9,
        vy: -(Math.random() * 11 + 5),
        s: Math.random() * 6 + 4,
        c: colors[(Math.random() * colors.length) | 0],
        r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.3
      }));
      let t = 0;
      (function frame() {
        t++;
        ctx.clearRect(0, 0, cv.width, cv.height);
        parts.forEach(p => {
          p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
          ctx.restore();
        });
        if (t < 110) requestAnimationFrame(frame); else cv.remove();
      })();
    }

    // נקרא רק אחרי פעולות משתמש (לא בטעינה), ומונע חגיגה כפולה לאותה אבן דרך
    function checkAchievements() {
      if (!Array.isArray(state.celebrated)) state.celebrated = [];
      let fired = false;
      const lost = +(state.profile.startWeight - state.profile.currentWeight).toFixed(1);
      [2.5, 5, 7.5, 10].forEach(ms => {
        const k = 'kg_' + ms;
        if (lost >= ms && !state.celebrated.includes(k)) {
          state.celebrated.push(k);
          celebrate(`🏆 אבן דרך: ירידה של ${ms} ק״ג! כל הכבוד!`, true);
          fired = true;
        }
      });
      const st = computeStreak();
      [3, 7, 14, 30, 60, 100].forEach(n => {
        const k = 'streak_' + n;
        if (st >= n && !state.celebrated.includes(k)) {
          state.celebrated.push(k);
          celebrate(`🔥 ${n} ימים ברצף! מדהים`, n >= 14);
          fired = true;
        }
      });
      if (fired) saveState();
    }

    function maybeShowOnboarding() {
      if (state.onboarded) return;
      document.getElementById('obHeight').value = state.profile.heightCm;
      document.getElementById('obWeight').value = state.profile.currentWeight;
      document.getElementById('obTarget').value = state.profile.targetWeight;
      document.getElementById('onboardModal').classList.remove('hidden');
    }

    async function completeOnboarding() {
      const h = parseFloat(document.getElementById('obHeight').value);
      const w = parseFloat(document.getElementById('obWeight').value);
      const t = parseFloat(document.getElementById('obTarget').value);
      if (isNaN(h) || h < 120 || h > 230 || isNaN(w) || w < 40 || w > 250 || isNaN(t) || t < 40 || t > 250) {
        showToast('נא להזין גובה ומשקלים תקינים');
        return;
      }
      state.profile = {
        ...state.profile,
        name: document.getElementById('obName').value.trim(),
        heightCm: Math.round(h),
        startWeight: +w.toFixed(1),
        currentWeight: +w.toFixed(1),
        targetWeight: +t.toFixed(1)
      };
      state.weighIns = [{ id: 'wi_init', date: getTodayKey(), time: '08:00', weight: +w.toFixed(1), note: 'נקודת פתיחה' }];
      state.onboarded = true;
      saveState();
      document.getElementById('onboardModal').classList.add('hidden');
      renderAll();
      celebrate('🌿 מתחילים! אני איתך בדרך ליעד', true);
      if (document.getElementById('obNotify').checked) await enableNotifications();
    }

    function skipOnboarding() {
      state.onboarded = true;
      saveState();
      document.getElementById('onboardModal').classList.add('hidden');
    }

    // =========================================================================
    // 13c. ENCOURAGING REMINDERS (NOTIFICATIONS)
    // =========================================================================
    const NOTIFY_KEY = 'notify';
    let notifyCfg = null;

    function defaultNotifyCfg() {
      const slots = {};
      MeuzanNotify.SLOTS.forEach(s => { slots[s.id] = { on: true, time: s.def }; });
      return { enabled: false, slots, lastFired: {} };
    }
    async function loadNotifyCfg() {
      const base = defaultNotifyCfg();
      try {
        const saved = await idbGet(NOTIFY_KEY);
        notifyCfg = saved ? { ...base, ...saved, slots: { ...base.slots, ...(saved.slots || {}) }, lastFired: saved.lastFired || {} } : base;
      } catch (e) {
        notifyCfg = base;
      }
    }
    async function saveNotifyCfg() {
      try { await idbSet(NOTIFY_KEY, JSON.parse(JSON.stringify(notifyCfg))); } catch (e) {}
    }
    function notifySupported() {
      return 'Notification' in window && 'serviceWorker' in navigator;
    }
    function notifyPermission() {
      return notifySupported() ? Notification.permission : 'unsupported';
    }
    function notifyIsOn() {
      return !!(notifyCfg && notifyCfg.enabled && notifyPermission() === 'granted');
    }

    async function showLocalNotification(n) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(n.title, {
        body: n.body,
        tag: n.tag,
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        dir: 'rtl',
        lang: 'he'
      });
    }

    async function runNotifyCheck() {
      if (!notifySupported() || Notification.permission !== 'granted') return;
      await loadNotifyCfg();   // רענון: ייתכן ש-service worker כבר שלח משהו
      if (!notifyCfg.enabled) return;
      const before = JSON.stringify(notifyCfg.lastFired);
      const due = MeuzanNotify.computeDue(notifyCfg, state, new Date());
      if (JSON.stringify(notifyCfg.lastFired) !== before) await saveNotifyCfg();
      for (const n of due) {
        try { await showLocalNotification(n); } catch (e) {}
      }
    }

    async function registerPeriodicSync() {
      try {
        const reg = await navigator.serviceWorker.ready;
        if ('periodicSync' in reg) {
          await reg.periodicSync.register('meuzan-reminders', { minInterval: 60 * 60 * 1000 });
          return true;
        }
      } catch (e) {}
      return false;
    }

    async function enableNotifications() {
      if (!notifySupported()) {
        showToast('הדפדפן לא תומך בהתראות. באייפון: התקן למסך הבית ופתח משם');
        renderNotifyModal();
        return false;
      }
      let perm = Notification.permission;
      if (perm === 'default') perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        showToast('ההתראות חסומות — אפשר לאפשר בהגדרות האתר/האפליקציה');
        renderNotifyModal();
        return false;
      }
      await loadNotifyCfg();
      notifyCfg.enabled = true;
      await saveNotifyCfg();
      await registerPeriodicSync();
      renderNotifyModal();
      updateNotifyHeaderIcon();
      showToast('🔔 התזכורות המעודדות הופעלו');
      runNotifyCheck();
      return true;
    }

    async function disableNotifications() {
      await loadNotifyCfg();
      notifyCfg.enabled = false;
      await saveNotifyCfg();
      try {
        const reg = await navigator.serviceWorker.ready;
        if ('periodicSync' in reg) await reg.periodicSync.unregister('meuzan-reminders');
      } catch (e) {}
      renderNotifyModal();
      updateNotifyHeaderIcon();
      showToast('🔕 התזכורות כובו');
    }

    async function toggleNotifications() {
      if (notifyIsOn()) await disableNotifications();
      else await enableNotifications();
    }

    async function sendTestNotification() {
      if (notifyPermission() !== 'granted') {
        const ok = await enableNotifications();
        if (!ok) return;
      }
      try {
        await showLocalNotification({ title: 'מאוזן AI 🌿', body: getMotivation(), tag: 'meuzan-test' });
        showToast('📨 נשלחה התראת ניסיון');
      } catch (e) {
        showToast('לא הצלחתי לשלוח התראה בדפדפן הזה');
      }
    }

    async function setNotifySlot(id, field, value) {
      await loadNotifyCfg();
      if (!notifyCfg.slots[id]) return;
      if (field === 'on') notifyCfg.slots[id].on = !!value;
      if (field === 'time' && /^\d{2}:\d{2}$/.test(value)) {
        notifyCfg.slots[id].time = value;
        notifyCfg.lastFired[id] = '';   // שינוי שעה מאפשר שליחה מחדש היום
      }
      await saveNotifyCfg();
    }

    function updateNotifyHeaderIcon() {
      const el = document.getElementById('headerNotifyIcon');
      if (el) el.textContent = notifyIsOn() ? '🔔' : '🔕';
    }

    function renderNotifyModal() {
      const perm = notifyPermission();
      const on = notifyIsOn();
      const box = document.getElementById('notifyStatusBox');
      const btn = document.getElementById('notifyToggleBtn');
      if (perm === 'unsupported') {
        box.textContent = 'הדפדפן הזה לא תומך בהתראות. באייפון (iOS 16.4+): התקן למסך הבית ופתח משם.';
        btn.classList.add('hidden');
      } else if (perm === 'denied') {
        box.textContent = '🚫 ההתראות חסומות. אפשר לאפשר אותן בהגדרות האתר/האפליקציה בטלפון.';
        btn.classList.add('hidden');
      } else {
        btn.classList.remove('hidden');
        box.textContent = on ? '🔔 תזכורות פעילות' : '🔕 תזכורות כבויות';
        btn.textContent = on ? 'כבה תזכורות' : '🔔 הפעל תזכורות';
        btn.className = on
          ? 'w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition active:scale-95'
          : 'w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-sm transition active:scale-95';
      }
      const list = document.getElementById('notifySlotsList');
      list.innerHTML = MeuzanNotify.SLOTS.map(s => {
        const c = (notifyCfg && notifyCfg.slots[s.id]) || { on: true, time: s.def };
        return `
          <div class="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <label class="flex items-center gap-2 min-w-0 flex-1 cursor-pointer">
              <input type="checkbox" ${c.on ? 'checked' : ''} onchange="setNotifySlot('${s.id}', 'on', this.checked)" />
              <span class="text-xs font-bold text-slate-800 truncate">${esc(s.label)}</span>
            </label>
            <input type="time" value="${esc(c.time)}" onchange="setNotifySlot('${s.id}', 'time', this.value)" dir="ltr" class="px-2 py-1 rounded-xl bg-white border border-slate-200 text-xs font-extrabold tabular-nums" />
          </div>`;
      }).join('');
    }

    async function openNotifyModal() {
      await loadNotifyCfg();
      renderNotifyModal();
      document.getElementById('notifyModal').classList.remove('hidden');
    }
    function closeNotifyModal() {
      document.getElementById('notifyModal').classList.add('hidden');
    }

    // =========================================================================
    // 14. EXPOSE HANDLERS TO GLOBAL WINDOW FOR INLINE ONCLICK ATTRIBUTES
    // =========================================================================
    Object.assign(window, {
      switchTab,
      switchCoachSubTab,
      openShabbatHub,
      selectDay,
      adjustWater,
      cycleSleepHours,
      cycleMovementMinutes,
      resetMeatWaitTimer,
      openMealSheet,
      closeMealSheet,
      switchMealSheetTab,
      onMealPhotoPicked,
      clearMealPhoto,
      runAiMealAnalysis,
      overridePreviewKosher,
      confirmSaveAnalyzedMeal,
      logQuickKosherMeal,
      deleteMealFromDay,
      recordAiFeedback,
      handleProfileFieldChange,
      stepWeighIn,
      logNewWeighIn,
      deleteWeighIn,
      switchHistorySubTab,
      selectChartWeightPoint,
      loadDemoData,
      sendCoachQuickPrompt,
      handleCoachFormSubmit,
      logMotzeiShabbatCheckin,
      generateAiShabbatPlan,
      runDeepAiLearningScan,
      adoptAppUpgrade,
      handleAddCustomMemoryNote,
      removeMemoryItem,
      openInstallModal,
      closeInstallModal,
      triggerNativePwaInstall,
      checkForAppUpdate,
      exportJsonBackup,
      importJsonBackup,
      handleHeaderCloudClick,
      closeCloudAccountModal,
      signInWithGoogleAccount,
      signOutFromGoogleAccount,
      openSettingsModal,
      closeSettingsModal,
      saveDailyTargetSettings,
      promptInlineReset,
      cancelInlineReset,
      executeFullReset,
      newMotivation,
      completeOnboarding,
      skipOnboarding,
      openNotifyModal,
      closeNotifyModal,
      toggleNotifications,
      sendTestNotification,
      setNotifySlot
    });

    // =========================================================================
    // 15. INITIALIZATION & LIVE KOSHER COUNTDOWN TICKER
    // =========================================================================
    async function boot() {
      initPwa();
      await loadLocalState();
      renderAll();
      updateNotifyHeaderIcon();
      if (isStandalone()) { const ib = document.getElementById('headerInstallBtn'); if (ib) ib.classList.add('hidden'); }
      setTimeout(maybeShowOnboarding, 500);
      initFirebaseCloud();
      await loadNotifyCfg();
      updateNotifyHeaderIcon();
      runNotifyCheck();
      setInterval(runNotifyCheck, 30000);
      setInterval(() => {
        if (state.kosher.lastMeatTimestamp && state.kosher.waitHours > 0) {
          updateKosherTimerUI();
        }
      }, 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushLocalSave();
        else runNotifyCheck();
      });
      window.addEventListener('pagehide', flushLocalSave);
    }
    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', boot);
    else boot();
