Szia! A beléptetés működik, de a belső oldal még üres. Most következik a leglátványosabb rész: a Dashboard és a Játékmenet UI felépítése a korábbi prototípus alapján.

A feladatod a Dashboard moduláris felépítése és összekötése a Backenddel.

Feladatok:

Típusdefiníciók (src/types/index.ts):

Definiáld a Backendről érkező adatokat TypeScript interface-ekkel.

User: (id, username, money, energy, maxEnergy, hp, stats, stb.)

Crime: (id, name, energyCost, difficulty, rewards...)

CrimeResult: (success, moneyGained, message...)

API Hívások Bővítése (src/api/user.ts, src/api/crimes.ts):

getUserProfile(): GET /users/profile

getCrimes(): GET /crimes

commitCrime(id): POST /crimes/commit/:id

refillEnergy(): POST /users/refill-energy (Dev tool)

UI Komponensek (Modulárisan!):

Ne egyetlen óriási fájlba írd! Bontsd szét a src/components/dashboard mappában:

Layout.tsx: Tartalmazza a Sidebar-t (Navigáció) és a Topbar-t (Erőforrás csíkok).

ResourceBar.tsx: A HP/Energia csíkok komponense.

StatCard.tsx: A User statisztikák (Erő, Intelligencia) megjelenítése.

CrimeCard.tsx: Egyetlen bűntény kártya (Név, Költség, Gomb).

Dashboard Oldal (src/pages/Dashboard.tsx):

Használd a Layout komponenst.

Töltsd be a felhasználó adatait (useEffect).

Jelenítsd meg a statisztikákat és az aktuális erőforrásokat.

Dev Gomb: Tégy egy kicsi, eldugott gombot "Energia Töltés" felirattal, ami meghívja a refillEnergy API-t, majd frissíti a user adatait (hogy tudjunk tesztelni).

Bűntények Oldal (src/pages/Crimes.tsx):

Listázd ki a bűntényeket (CrimeCard komponensekkel).

Logika: Ha a felhasználó rákattint a "Végrehajtás" gombra:

Hívd meg a commitCrime API-t.

Ha sikeres: Jeleníts meg egy Toast üzenetet (pl. "Siker! Szereztél $50-t"), és frissítsd a User Context-ben a pénzt és energiát az új értékekre.

Ha sikertelen (pl. nincs energia): Jeleníts meg hibaüzenetet.

Stílus:

Használd a Tailwind CSS-t a sötét (Dark Mode) gengszter hangulathoz, ahogy a prototípusban láttuk (szürke hátterek, neon kiegészítők).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement dashboard layout and crime interaction ui.