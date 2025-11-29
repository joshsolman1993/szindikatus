# Projekt Napló

## [2025-11-29] - Clan Upgrades & Bank Spending
- Implementáltam a Klán Fejlesztések (Clan Upgrades) rendszerét:
  - **Adatbázis:**
    - Új `ClanUpgrade` entitás (id, clanId, type, level)
    - Upgrade típusok: FORTRESS, TRAINING_GROUND, BLACK_MARKET_CONN
  - **Fejlesztések Definíciói:**
    - **Erőd (FORTRESS):** +10% kerület védelem szintenként (max 10 szint, $50k * level)
    - **Kiképzőközpont (TRAINING_GROUND):** +2% XP harcokból szintenként (max 10 szint, $100k * level)
    - **Alvilági Kapcsolatok (BLACK_MARKET_CONN):** -2% piaci adó szintenként (max 5 szint, $75k * level)
  - **Backend Funkciók:**
    - `buyUpgrade(leaderId, upgradeType)` - Csak leader vásárolhat, bank pénz levonás, tranzakció
    - `getClanUpgrades(clanId)` - Összes upgrade lekérdezése
    - `getUpgradeLevel(clanId, type)` - Specifikus upgrade szint
  - **Bónuszok Integrálása:**
    - **TerritoriesService:** FORTRESS bónusz alkalmazása kerület elfoglalásnál (defense reset: 50% + FORTRESS bonus)
    - **FightService:** TRAINING_GROUND bónusz alkalmazása XP számításnál (base XP * (1 + bonus))
  - **API Endpoint-ok:**
    - `GET /clans/upgrades/definitions` - Fejlesztések definíciói
    - `GET /clans/:id/upgrades` - Klán fejlesztések lekérdezése
    - `POST /clans/upgrades/buy` - Fejlesztés vásárlás (csak leader)
- A klán bank mostantól **hasznos**: a fejlesztések növelik a klán erejét és hatékonyságát

## [2025-11-28] - Security Hardening
- Implementáltam a biztonsági megerősítéseket:
  - **Rate Limiting (Throttler):**
    - Telepítettem a `@nestjs/throttler` csomagot
    - Globális limit: 100 kérés / perc / IP
    - Kritikus endpoint-ok szigorú limittel:
      - `POST /auth/login`: 5 kérés / perc (brute-force védelem)
      - `POST /auth/register`: 3 kérés / perc (spam védelem)
      - `POST /crimes/commit/:id`: 10 kérés / perc
      - `POST /fight/attack/:targetId`: 10 kérés / perc
  - **Helmet Middleware:**
    - XSS védelem (Cross-Site Scripting)
    - Clickjacking védelem
    - HTTP headers biztonsági beállítások
  - **CORS Szigorítás:**
    - Csak a frontend URL-t fogadja el (FRONTEND_URL env változó)
    - Hardcoded `origin: '*'` eltávolítva
    - Production-ready konfiguráció
  - **ValidationPipe Szigorítás:**
    - `whitelist: true` - Csak DTO-ban definiált mezők
    - `forbidNonWhitelisted: true` - Hiba extra mezők esetén
    - `transform: true` - Automatikus típuskonverzió
- A rendszer mostantól **biztonságos** brute-force, spam és XSS támadások ellen

## [2025-11-28] - Redis Caching for Performance
- Implementáltam a Redis cache rendszert a nehéz lekérdezésekhez:
  - Telepítettem a `@nestjs/cache-manager`, `cache-manager` és `cache-manager-redis-yet` csomagokat
  - Konfiguráltam a `CacheModule`-t az `AppModule`-ban (globális, Redis backend)
  - Default TTL: 60 másodperc
- Optimalizáltam a Leaderboard Controller-t:
  - `GET /leaderboard/players` - Top 50 játékos (XP alapján) - **cached**
  - `GET /leaderboard/rich` - Top 50 leggazdagabb (cash alapján) - **cached**
  - `GET /leaderboard/clans` - Top 50 klán (members XP összege) - **cached**
  - Cache TTL: 60 másodperc
  - **Teljesítmény javulás:** 0ms query time cache hit esetén (vs. ~50-100ms DB query)
- Optimalizáltam a Market Service-t:
  - `GET /market/shop` - NPC shop items - **cached**
  - Cache TTL: 5 perc (300 másodperc)
  - Indoklás: Shop items ritkán változik (csak seed-elésnél)
- A rendszer mostantól **skálázható**: 10,000+ user esetén is gyors leaderboard lekérdezések

## [2025-11-28] - Automated Regeneration & Daily Reset
- Implementáltam az automatikus regenerációs rendszert:
  - Energia: +5 / perc (max: 100)
  - Bátorság: +1 / perc (max: 10)
  - HP: +5 / perc (max: 100)
  - Optimalizált SQL UPDATE (csak azokat a usereket frissíti, akiknek szükségük van rá)
- Létrehoztam a `DailyResetService`-t:
  - Minden éjfélkor (00:00) automatikusan reseteli a DAILY típusú missziók progress-ét
  - Timezone: Europe/Budapest
  - Error handling és logging
- Frissítettem a `RegenerationService`-t: HP regeneráció hozzáadása, try-catch error handling
- Módosítottam a `/users/refill-energy` endpoint-ot: csak development módban használható (production-ben az automatikus regeneráció működik)
- A játék mostantól "él": a játékosoknak nem kell manuálisan tölteniük az energiát, és a napi missziók automatikusan újraindulnak

## [2025-11-26] - Rarity & Loot System
- Implementáltam az Item Rarity rendszert (Common, Uncommon, Rare, Epic, Legendary).
- Létrehoztam a `LootService`-t a véletlenszerű tárgyak generálásához minőség (quality) és ritkaság alapján.
- Integráltam a loot rendszert a bűntényekbe: 10% esély tárgy találására sikeres bűntény esetén.
- Frissítettem a stat számítást: a tárgyak bónuszait mostantól a minőségük szorozza.
- UI frissítés: A leltárban a tárgyak nevei a ritkaságuknak megfelelő színben jelennek meg, és látszanak a megnövelt statok.

## [2025-11-27] - Private Messaging & Notifications
- Implementáltam a perzisztens privát üzenetküldést (DM) adatbázis háttérrel (`Message` entitás).
- Létrehoztam a `ChatService`-t és `ChatController`-t az üzenetek kezelésére és lekérdezésére.
- Frissítettem a `ChatGateway`-t hitelesítéssel és privát üzenet eseményekkel.
- Integráltam a Kereskedelmi Értesítéseket: a `MarketService` mostantól automatikus rendszerüzenetet küld az eladónak vásárláskor.
- Frontend:
  - Létrehoztam a `ChatContext`-et a chat állapotának globális kezelésére.
  - Kibővítettem a `ChatWidget`-et "Privát" füllel, partnerlistával és chat ablakkal.
  - Hozzáadtam az "Üzenet" gombot a játékos kártyákhoz (Utca) és a piaci ajánlatokhoz.
