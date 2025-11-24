Szia! Remek munka az inicializálással. A Changelog alapján a Docker fut, és a NestJS váz kész.

Most lépjünk tovább a Fázis 1.1 befejezésére és a 1.2 előkészítésére. A feladatod a rendszer alapjainak stabilizálása és az adatbázis kapcsolat élesítése.

Feladatok:

Adatbázis Kapcsolat Konfigurálása (Backend):

Konfiguráld a TypeOrmModule-t az app.module.ts-ben (vagy egy külön database.module.ts-ben), hogy csatlakozzon a futó Docker PostgreSQL konténerhez.

Használd a .env fájlt a beállításokhoz (host, port, user, password, db).

Fontos: Állítsd be az autoLoadEntities: true és fejlesztéshez a synchronize: true opciókat (de kommentben jelezd, hogy élesben a synchronize false legyen!).

Globális Hibakezelő (Exception Filter) Implementálása:

Ez KRITIKUS lépés a GDD 9.1-es pontja alapján!

Hozz létre egy AllExceptionsFilter-t (src/common/filters/all-exceptions.filter.ts).

Ennek el kell kapnia minden HttpException-t és ismeretlen hibát, majd JSON formátumban visszaadni (timestamp, path, message).

Regisztráld ezt globálisan a main.ts-ben.

User Entity (Adatmodell) Létrehozása:

Hozd létre a User entitást (src/users/entities/user.entity.ts) a GDD 5.2 pontja alapján.

Mezők: id (UUID), username, email, password (hash), cash, energy, nerve, hp, stats (JSONB), createdAt.

Tipp: A numerikus értékeknek (cash, energy) adj alapértelmezett értéket (pl. energy: 100).

Game Balance Konfiguráció:

Hozz létre egy src/config/game-balance.config.ts (vagy json) fájlt.

Ide tedd a kezdőértékeket (pl. Max Energia = 100, Kezdő Pénz = 1000).

A User entitásban ezeket a konstansokat használd a default értékeknél, ne "magic number"-eket.

Ellenőrzés:

Indítsd el a szervert. Ha sikeresen csatlakozik az adatbázishoz, és nem dob hibát, akkor végeztél.

Ne felejtsd el frissíteni a PROJEKT_NAPLO.md fájlt a Fázis 1.1 státuszával és a Changeloggal!

Emlékeztető: Használd a "Safe-Refactor" elvet, és ha új fájlokat hozol létre, figyelj a szép kódra és a magyar kommentekre.