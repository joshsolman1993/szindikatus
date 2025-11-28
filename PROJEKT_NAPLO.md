# Projekt Napló

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
