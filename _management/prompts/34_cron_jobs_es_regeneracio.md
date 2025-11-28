Szia! A CURRENT_STATE.md audit rámutatott a legnagyobb hiányosságra: a játék nem "él" magától. A játékosoknak manuálisan kell tölteniük az energiát, és a napi küldetések sosem indulnak újra.

A feladatod a Cron Jobok (Időzített Feladatok) véglegesítése és élesítése.

Feladatok:

Regenerációs Service (src/common/services/regeneration/regeneration.service.ts):

Jelenleg van egy @Cron metódus, de optimalizáljuk és finomhangoljuk.

Logika: Minden percben fusson le.

Energia: energy += 5 (max: maxEnergy vagy Talent bónusz).

Bátorság: nerve += 1 (max: maxNerve).

HP: hp += 5 (max: maxHp).

Kritikus: Használd a QueryBuilder-t (UPDATE users SET ...), hogy egyetlen SQL parancs legyen az egész, ne kérd le a user objektumokat! Ez teljesítmény szempontjából életbevágó.

Napi Reset Service (src/common/services/daily-reset.service.ts):

Hozz létre egy új service-t, ami minden éjfélkor fut le (0 0 * * *).

Feladatai:

Küldetések: Reseteld a DAILY típusú UserMission rekordokat (progress = 0, isCompleted = false, isClaimed = false).

Ingatlanok: Opcionális: Ha van olyan mechanika, ami napi limithez kötött, itt reseteld.

Backend Konfiguráció:

Győződj meg róla, hogy a ScheduleModule helyesen van importálva az AppModule-ban.

Dev Tools Elrejtése:

A UsersController-ben a /refill-energy végpontot védd le egy extra ellenőrzéssel (pl. csak akkor működjön, ha a NODE_ENV === 'development'), vagy távolítsd el teljesen, hiszen most már működni fog az automata töltés.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement automated energy regeneration and daily mission reset cron jobs.