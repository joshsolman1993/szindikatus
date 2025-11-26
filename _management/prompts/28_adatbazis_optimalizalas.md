Szia! A rendszer biztonságos, most tegyük gyorssá is. Ahogy nő a játékosbázis, a lekérdezések lassulni fognak indexek nélkül.

A feladatod az Adatbázis Optimalizálása (Indexing) és a teljesítmény javítása.

Feladatok:

Indexek Hozzáadása (src/users/entities/user.entity.ts):

Használd a TypeORM @Index() dekorátorát.

Ranglistákhoz:

@Index(['xp']) (A "Legerősebbek" listához).

@Index(['cash']) (A "Leggazdagabbak" listához - Megjegyzés: Mivel a cash string/bigint, lehet, hogy speciális index kell, vagy csak simán indexeld, a DB engine megoldja a rendezést).

Kereséshez:

@Index(['username']) (Ha van név szerinti keresés).

Klánokhoz:

@Index(['clanId']) (Hogy gyorsan lehessen listázni egy klán tagjait).

Klán Entitás Optimalizálása (src/clans/entities/clan.entity.ts):

@Index(['leaderId']) (A vezér gyors megtalálásához).

Query Optimalizálás (UsersService & ClansService):

Nézd át a getTopPlayers és getTopClans metódusokat.

Győződj meg róla, hogy csak a szükséges mezőket (select(['user.id', 'user.username', ...])) kéred le, nem az egész User objektumot (főleg a stats JSON és a settings JSON nélkül, ha azok nem kellenek a listához). Ez csökkenti az adatforgalmat.

Redis Cache Előkészület (Opcionális, de ajánlott):

Ha már fut a Redis konténer, a LeaderboardService-ben beállíthatnál egy egyszerű caching-et (pl. CACHE_MANAGER-rel), hogy a ranglistát csak 1-5 percenként kérje le az adatbázisból, ne minden egyes oldalletöltésnél.

Implementáció: Ha túl bonyolult most a cache modult behozni, akkor egyelőre hagyd ki, de tegyél be egy TODO kommentet a kódba.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: perf: add database indexes for leaderboard and search optimization.