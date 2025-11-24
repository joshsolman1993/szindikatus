Szia! A bolt nyitva, a tárgyak a zsebekben. De jelenleg a fegyverek csak díszek. A feladatod az, hogy élesítsd a rendszert: a felszerelt tárgyak bónuszai (STR, DEF) adjanak valódi előnyt.

Feladatok:

Backend - Statisztika Kalkulátor (src/users/users.service.ts):

Készíts egy segédfüggvényt: calculateCombatStats(userId: string).

Működés:

Lekéri a User alap statisztikáit (stats JSON).

Lekéri a User felszerelt tárgyait (inventory -> item join, ahol isEquipped: true).

Összeadja az értékeket.

Visszatér egy objektummal: { totalStr, totalDef, totalSpd, ... }.

Harcrendszer Frissítése (src/fight/fight.service.ts):

Módosítsd az executeFight metódust.

A harc elején ne a nyers user.stats-ot használd, hanem hívd meg a fenti calculateCombatStats-ot mind a Támadóra, mind a Védőre.

Logolás: A harci logba (logs tömb) írd bele a felszerelés hatását is (pl. "A Glock 17 segítségével extra sebzést vittél be!").

Profil API Bővítése (src/users/users.controller.ts):

A GET /users/profile végpont válaszát bővítsd ki a combatStats mezővel (vagy írd felül a sima statokat a kalkuláltakkal, de jobb külön kezelni, hogy lássa a játékos, mi az alap és mi a bónusz).

Pl.: { ..., stats: { str: 10 }, computed: { str: 25 } } (ahol a +15 a fegyverből jön).

Frontend - Dashboard UI Update (src/components/dashboard/StatCard.tsx):

Jelenítsd meg a bónuszokat vizuálisan.

Ha a kalkulált érték nagyobb, mint az alap, írd ki zölddel mellé: Erő: 10 (+15).

Utca Nézet ("The Streets") Frissítése:

A játékos listában megjelenő "Becsült Erő" most már a fegyvereket is vegye figyelembe! Így a játékosok látni fogják, ki az, aki bár alacsony szintű, de "állig fel van fegyverkezve".

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: integrate item bonuses into combat logic and profile stats.