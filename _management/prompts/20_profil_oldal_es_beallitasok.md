Szia! Észrevettük, hogy bár a játékmechanikák működnek, hiányzik egy központi hely a játékosnak: a Profil Oldal.

A feladatod a Profil oldal (/profile) és a Beállítások implementálása.

Feladatok:

Backend - User Entity Bővítése (src/users/entities/user.entity.ts):

Adj hozzá egy bio (String, nullable) mezőt. Ez lesz a játékos "bemutatkozása", amit mások is láthatnak majd az Utcán.

Adj hozzá egy settings (JSONB, default: { "soundEnabled": true }) mezőt a perzisztens beállításokhoz.

Backend - Update Végpont (src/users/users.controller.ts):

PATCH /users/profile:

Body: { bio?: string, settings?: { soundEnabled: boolean } }.

Validáció: A bio ne legyen túl hosszú (max 500 karakter).

Logika: Frissítsd a bejelentkezett user adatait.

Frontend - Settings Hook Integráció:

Frissítsd a useGameSound hook-ot (vagy az AuthContext-et), hogy a user.settings.soundEnabled értékét figyelje.

Ha false, a hangok ne játszódjanak le.

UI - Profil Oldal (src/pages/Profile.tsx):

Layout: Két oszlopos elrendezés (Cyberpunk üveghatású kártyákkal).

Bal Oszlop (Identity):

Nagy Avatar (a generált URL-lel).

Felhasználónév és Klán Tag.

Rang/Szint.

Bio Szerkesztő: Egy textarea, ami alapból "read-only", de egy "Szerkesztés" gombra írhatóvá válik. Mentéskor hívd meg a PATCH végpontot.

Jobb Oszlop (Details & Settings):

Statisztikák: Részletes lista (Harci statok, Győzelmek/Vereségek száma, Regisztráció ideje).

Beállítások Panel:

"Hangeffektek (SFX)" kapcsoló (Toggle Switch).

"Kijelentkezés" gomb (piros, veszélyes zóna).

Navigáció:

A Sidebar aljára (vagy a Topbar jobb szélére a név mellé) tegyél egy "Profil" gombot (User ikon).

A "Kijelentkezés" gombot helyezd át ide a Profil oldalra, vagy hagyd meg a Sidebar alján is, de itt is legyen elérhető.

Dizájn:

Használd a image_0bd13a.jpg stílusát: sötét, glow effektes panelek, neon kapcsolók.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement user profile page with bio editing and sound settings.