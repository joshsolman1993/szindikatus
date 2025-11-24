Szia! A bűntények működnek, de a játékosok hamar kifogynak a szuflából. A feladatod a Fázis 1.2 lezárása: az Energia és Bátorság visszatöltése, valamint egy fejlesztői teszt-eszköz létrehozása.

Feladatok:

NestJS Scheduling Telepítése:

Telepítsd a @nestjs/schedule csomagot.

Importáld a ScheduleModule.forRoot()-ot az AppModule-ba.

Regenerációs Service (src/common/services/regeneration.service.ts):

Hozz létre egy service-t, ami kezeli az időzített feladatokat.

Cron Job: Készíts egy metódust @Cron(CronExpression.EVERY_MINUTE) dekorátorral (fejlesztéshez percenként fusson).

Logika:

Minden felhasználónak növeld az energiáját (game-balance.config szerinti értékkel, pl. +5).

FONTOS - Optimalizálás: NE kérd le az összes usert ciklusban! Használj egyetlen hatékony SQL UPDATE parancsot a UserRepository-n vagy QueryBuilder-en keresztül.

SQL Logika: SET energy = LEAST(energy + :regenAmount, :maxEnergy) WHERE energy < :maxEnergy.

Ugyanezt végezd el a Bátorságra (Nerve) is.

Logging: Logolj egy INFO szintű üzenetet, ha lefutott a regen (pl. "Regeneration tick completed").

Fejlesztői "Csalás" Végpont (src/users/users.controller.ts):

Mivel fejlesztés közben nem akarunk perceket várni, hozz létre egy végpontot:

POST /users/refill-energy

Működés: Azonnal 100%-ra tölti a bejelentkezett felhasználó energiáját és életét.

Megjegyzés: Ezt a végpontot élesben (Production) majd ki kell kapcsolni, de most elengedhetetlen a teszteléshez.

Játékos Profil API Bővítése:

A GET /users/profile végpont (ha még nincs, hozd létre) adja vissza a kiszámolt maxEnergy és maxNerve értékeket is, hogy a Frontend tudja, meddig rajzolja a csíkot.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt (Fázis 1.2 státusz: Kész).

Git commit: feat: add scheduled energy regeneration and dev refill endpoint.