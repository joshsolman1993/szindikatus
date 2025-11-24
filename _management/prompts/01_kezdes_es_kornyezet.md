Szia! Kezdjük el a "Szindikátus: Árnyékvilág" projekt fejlesztését.

Kérlek, végezd el az alábbi inicializálási lépéseket:

Kontextus felvétele:

Olvasd el figyelmesen a _management/docs/AI_INSTRUCTION.txt fájlt (ezek a te alaputasításaid).

Olvasd el a _management/docs/Szindikatus_Arnyekvilag_GDD.md dokumentumot, hogy értsd a játékot.

Nézd meg a _management/docs/PROJEKT_NAPLO.md fájlt, és lásd, hogy a Fázis 1.1-nél tartunk.

Környezet létrehozása (Docker):

Készíts egy docker-compose.yml fájlt a gyökérkönyvtárba.

Szükségünk lesz:

Egy PostgreSQL konténerre (adatbázis).

Egy Redis konténerre (cache).

(A Node.js appokat egyelőre nem kell Dockerbe tenni, azokat lokálisan futtatjuk fejlesztés közben, de az DB/Redis legyen konténerben).

Hozz létre egy .env.example fájlt is a szükséges környezeti változókkal (DB jelszó, portok).

Backend Scaffolding (NestJS):

Hozd létre a backend mappát.

Inicializálj benne egy új NestJS projektet.

Telepítsd a backend mappába a TypeORM-ot és a Postgres drivert.

Git Inicializálás:

Készíts egy .gitignore fájlt a gyökérbe, ami ignorálja a node_modules-t, a .env fájlokat és a dist mappákat, de a _management mappát NEM.

Fontos: Ne írj még üzleti logikát (auth, játékmenet), most csak a technikai alapokat (üres projekt, futó adatbázis) akarom látni.
Jelezz vissza, ha kész vagy, és frissítsd a PROJEKT_NAPLO.md-t (jelöld be az 1.1 első pontjait).