# מאוזן AI — אפליקציה אישית לטלפון

אפליקציית PWA: מתקינים למסך הבית, עובדת גם בלי רשת, הנתונים נשמרים בטלפון,
ואפשר לסנכרן ולגבות לענן אישי (Firebase) ולעדכן גרסאות בקלות.

## מה בתיקייה
- `index.html`, `app.js`, `tailwind.css` — האפליקציה
- `sw.js`, `manifest.webmanifest`, `icons/` — התקנה, עבודה offline ועדכונים
- `firebase-config.js`, `firestore.rules` — סנכרון ענן (אופציונלי)

## שלב 1 — העלאה לאתר (GitHub Pages, חינם, HTTPS)
1. צור repo חדש ב-GitHub (מומלץ **Private** אם התוכנית שלך תומכת ב-Pages פרטי, אחרת Public — אין בקוד שום מידע אישי או מפתח).
2. העלה את כל הקבצים לשורש ה-repo.
3. Settings ← Pages ← Source: `main` / root. אחרי דקה תקבל כתובת `https://<user>.github.io/<repo>/`.

## שלב 2 — התקנה בטלפון
פתח את הכתובת ב-Chrome (אנדרואיד): ⋮ ← **התקן אפליקציה**. באייפון (Safari): שיתוף ← **הוסף למסך הבית**.

## תזכורות והתראות מעודדות
באפליקציה: 🔕 בכותרת ← **הפעל תזכורות** (או בהתחלה, במסך הפתיחה). 5 תזכורות בשעות שאתה קובע
(בוקר, צהריים, מים, ערב, מוצ"ש), עם הודעות מעודדות וחכמות — לא שולחות על מה שכבר עשית.
שקט אוטומטי משישי 14:00 עד מוצ"ש 19:30.
- אנדרואיד/Chrome (אפליקציה מותקנת): נשלחות כשהאפליקציה פתוחה, וגם ברקע (Periodic Background Sync — ביצוע בקירוב, לא בשעה מדויקת).
- אייפון: iOS 16.4+ ורק אחרי התקנה למסך הבית.
- התראה בשעה מדויקת כשהאפליקציה סגורה לגמרי דורשת שרת Push (שלב נוסף, אפשר להוסיף). עד אז אפשר להשלים עם תזכורות קבועות בלוח השנה של הטלפון.

## שלב 3 — מפתח AI (אופציונלי)
צור מפתח ב-https://aistudio.google.com/apikey ← באפליקציה: ⚙️ הגדרות ← מפתח Gemini.
המפתח נשמר רק בטלפון (לא בענן, לא בגיבוי, לא ב-GitHub). בלי מפתח יש ניתוח מקומי פשוט.

## שלב 4 — סנכרון וגיבוי בענן (אופציונלי)
1. https://console.firebase.google.com ← Add project (אפשר בלי Analytics).
2. Build ← **Authentication** ← Sign-in method ← הפעל **Google**.
3. Build ← **Firestore Database** ← Create (מצב production).
4. Firestore ← Rules ← הדבק את `firestore.rules` (עם האימייל שלך) ← Publish.
5. Authentication ← Settings ← Authorized domains ← הוסף `<user>.github.io`.
6. Project settings ← Your apps ← Web (`</>`) ← העתק את ה-config אל `firebase-config.js`, והעלה מחדש.
7. באפליקציה: ☁️ ← התחבר עם Google.

הערות: תמונות הארוחות נשארות במכשיר שבו צולמו (מגבלת גודל במסמך הענן). לגיבוי מלא יש גם ייצוא JSON.

## עדכון גרסה
1. ערוך את הקבצים. 2. שנה `VERSION` ב-`sw.js` (למשל `v1.0.1`). 3. העלה ל-GitHub.
בפתיחה הבאה בטלפון תופיע הודעה **״גרסה חדשה זמינה — עדכן עכשיו״**. הנתונים לא נמחקים.
אם הוספת/שינית מחלקות Tailwind: `npx tailwindcss@3.4 -c tailwind.config.js -i input.css -o tailwind.css --minify`
(`input.css` = שלוש שורות: `@tailwind base; @tailwind components; @tailwind utilities;`).

## מגבלות ידועות
- מפתחות Firebase ב-`firebase-config.js` אינם סוד; ההגנה היא כללי Firestore + הרשאת Google שלך.
- מוצ"ש/שבת: הרצף הוא תצוגה בלבד, לא נעילה.
