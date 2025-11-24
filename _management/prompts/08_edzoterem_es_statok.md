Szia! A bűnözés remekül megy, de a karaktereink még gyengék. Most építsük meg a Konditermet (Gym), ahol a játékosok növelhetik a statisztikáikat.

Feladatok:

Backend Logika (src/users/users.service.ts):

Bővítsd a UsersService-t egy train(userId: string, stat: string) metódussal.

Validáció:

A stat paraméter csak ezek lehetnek: 'strength', 'defense', 'speed', 'dexterity' (vagy amiket a User entitásban definiáltunk).

Ellenőrizd, van-e elég energiája (pl. 10 energia / edzés).

Logika:

Vonj le energiát.

Növeld a kiválasztott statisztikát a stats JSON objektumban (pl. +1 vagy egy képlet alapján: 1 + (currentStat * 0.01)). Tipp: Postgres JSONB update-nél figyelj, hogy csak az adott kulcsot frissítsd, ne írd felül az egészet.

Növeld a hp-t is kicsit, ha állóképességre gyúr (opcionális).

Mentsd el tranzakcióban.

Válasz: Térjen vissza az új statisztikákkal és a maradék energiával.

API Végpont (src/users/users.controller.ts):

POST /users/train: Body: { stat: 'strength' }.

Használd a JwtAuthGuard-ot.

Frontend API (src/api/user.ts):

Add hozzá a trainStat(statType) függvényt.

Gym UI Oldal (src/pages/Gym.tsx):

Készíts egy új oldalt, ami a Dashboard Layout-ot használja.

Jeleníts meg 4 kártyát (Erő, Védekezés, Gyorsaság, Ügyesség) ikonokkal (használd a lucide-react-ot).

Minden kártyán:

Stat neve és jelenlegi értéke.

"Edzés" gomb (írja ki a költséget, pl. "10 Energia").

Interakció:

Gombnyomásra hívd meg az API-t.

Siker esetén: Toast üzenet ("Erősödtél! +1 STR") és frissítsd a User Context-et az új adatokkal, hogy a felső sávban és a kártyán is azonnal látszódjon a változás.

Navigáció:

Add hozzá a "Konditerem" menüpontot a Sidebar komponenshez, hogy elérhető legyen az oldal.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement gym system for stat training.