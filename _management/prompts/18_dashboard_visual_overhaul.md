Szia! A felhasználói visszajelzés alapján a Dashboard "üres" és "lapos". Radikális vizuális átalakításra van szükség. Felejtsük el a minimalizmust, és építsünk egy igazi Cyberpunk HUD-ot.

Feladatok:

Háttérkép és Textúra (Kritikus a hangulathoz):

A Layout.tsx-ben a fő konténer (main) kapjon egy sötétített háttérképet.

Használd ezt (vagy hasonlót) háttérnek: background-image: linear-gradient(to bottom, rgba(15, 17, 21, 0.85), rgba(15, 17, 21, 0.95)), url('https://images.unsplash.com/photo-1605218427306-6354db69e563?q=80&w=2000&auto=format&fit=crop');

background-size: cover, background-attachment: fixed.

Dashboard Layout Átrendezése (src/pages/Dashboard.tsx):

A jelenlegi egyszerű rács helyett használj egy asszimetrikus, 3 oszlopos elrendezést (vagy mobilon 1 oszloposat).

Felső Szekció (Hero):

Bal oldalon: Nagy Avatar kép (AvatarUrl-ből), mellette a Név és a Rang, alatta egy "XP Progress Bar". Ez töltse ki a szélesség 2/3-át.

Jobb oldalon: "Következő Cél" (pl. "Lépj szintet!" vagy egy küldetés).

Középső Szekció (Grid):

Bal oldali széles sáv (2/3): Itt maradjanak a Statisztikák és Erőforrások, de kompaktabb kártyákon.

Jobb oldali sáv (1/3) - ÚJ TARTALOM: "Legutóbbi Események" (Activity Feed).

Miért? Hogy kitöltsük az üres teret! Listázd ki ide a logs utolsó 5 elemét (amit a fight/crime dobott). Ha nincs log, írj ki placeholder szövegeket.

UI Elemek "Cyber" Stílusban:

Keretek: A kártyáknak ne csak sima border-e legyen. Adj nekik border-l-4 (bal oldali vastagabb keret) stílust a színük szerint.

Stat Kártyák: Tegyél a statisztika értéke mögé egy hatalmas, halvány, áttetsző ikont (absolute position, opacity-10). Ez mélységet ad.

Glitch Effekt: A Főcímnél ("Vezérlőpult") használj egy kis text-shadow elcsúszást, mintha digitális hiba lenne.

Navigációs Sáv (Sidebar) Tuning:

A jelenlegi sima lista helyett a menüpontok legyenek "kapszula" alakúak hover állapotban, neon fénnyel a bal oldalon.

Összegzés:
A cél, hogy a képernyő 90%-a legyen kitöltve, ne legyen hatalmas fekete űr. Használj bátran textúrákat és paneleket.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: style: dashboard overhaul with cyberpunk hud layout and background textures.