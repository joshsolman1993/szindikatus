# Projekt Napló

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
