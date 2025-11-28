Szia! A szerver most már "ketyeg", de az Audit szerint a Ranglista (Leaderboard) minden egyes megtekintéskor ("Full Table Scan") terheli az adatbázist. Ez nem skálázható.

A feladatod a Redis Caching implementálása a nehéz lekérdezésekhez.

Feladatok:

Redis Konfiguráció (Backend):

Telepítsd a cache-manager és cache-manager-redis-store csomagokat (vagy a NestJS beépített megoldását).

Konfiguráld a CacheModule-t az AppModule-ban, hogy a Dockerben futó Redis-t használja (REDIS_HOST, REDIS_PORT a .env-ből).

Leaderboard Service Optimalizálás:

Injektáld a CACHE_MANAGER-t.

Módosítsd a getTopPlayers és getTopClans metódusokat:

Lépés 1: Nézd meg, van-e adat a cache-ben (leaderboard_players).

Lépés 2: Ha van, add vissza azonnal (0ms query time!).

Lépés 3: Ha nincs, kérd le az adatbázisból, és mentsd el a cache-be TTL: 60 másodpercre.

Cache Ürítés (Invalidation - Opcionális):

Nem szükséges minden pontszerzésnél üríteni a cache-t (elég, ha 1 percig "régi" az adat), de ha azonnali frissítést akarsz, akkor a LevelingService-ben (szintlépéskor) törölheted a cache kulcsot. (Javaslat: Maradjunk a fix 60mp TTL-nél a teljesítmény miatt).

Egyéb Cache Lehetőségek:

A MarketService-ben a getShopItems (NPC bolt) is gyorsítótárazható, mivel ritkán változik.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: perf: implement redis caching for leaderboards and heavy queries.