Szia! A rendszer gyors és automata. Most tegyük biztonságossá. Az Audit szerint hiányzik a Rate Limiting és a CORS túl laza.

A feladatod a Backend biztonsági megerősítése.

Feladatok:

Rate Limiting (Throttler):

Telepítsd a @nestjs/throttler csomagot.

Állíts be egy globális limitet az AppModule-ban (pl. 100 kérés / perc / IP).

Szigorítás: A kritikus végpontokra (/auth/login, /crimes/commit, /fight/attack) tegyél szigorúbb korlátot (pl. 10 kérés / perc), hogy megakadályozd a spammelést és a brute-force támadásokat.

CORS Konfiguráció (main.ts):

A jelenlegi origin: '*' helyett állítsd be, hogy csak a frontend URL-jét (pl. http://localhost:5173 vagy a production domaint) fogadja el.

Használd a .env-ből a FRONTEND_URL változót.

Helmet (HTTP Headers):

Telepítsd és használd a helmet middleware-t a main.ts-ben. Ez alapvető HTTP fejléc védelmeket ad (XSS, Clickjacking ellen).

Validation Pipe Szigorítás:

Ellenőrizd a main.ts-ben a ValidationPipe beállításait. Legyen bekapcsolva a whitelist: true és forbidNonWhitelisted: true, hogy a kliens ne küldhessen szemetet az adatbázisba.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: sec: implement rate limiting, helmet and strict cors policies.