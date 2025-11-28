# 🏗️ Szindikátus: Jelenlegi Rendszerállapot (v0.3.1)

> **Utolsó frissítés:** 2025-11-28  
> **Dokumentum típusa:** Technikai Audit & Helyzetjelentés

---

## 1. Technikai Stack

### Backend
- **Framework:** NestJS 11.0.1
- **Nyelv:** TypeScript 5.7.3
- **Runtime:** Node.js
- **ORM:** TypeORM 0.3.27
- **Adatbázis:** PostgreSQL (pg 8.16.3)
- **Autentikáció:** JWT (@nestjs/jwt 11.0.1) + Passport + Bcrypt 6.0.0
- **WebSocket:** Socket.io 4.8.1 (@nestjs/websockets, @nestjs/platform-socket.io)
- **Validáció:** class-validator 0.14.2, class-transformer 0.5.1
- **Ütemezés:** @nestjs/schedule 6.0.1
- **Konténerizáció:** Docker Compose

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Nyelv:** TypeScript 5.9.3
- **Routing:** React Router DOM 7.9.6
- **Styling:** Tailwind CSS 4.1.17 (Vanilla CSS, Glassmorphism design)
- **HTTP Client:** Axios 1.13.2
- **Animációk:** Framer Motion 12.23.24
- **WebSocket:** Socket.io-client 4.8.1
- **Ikonok:** Lucide React 0.554.0
- **Toast Notifications:** React Hot Toast 2.6.0
- **Hangeffektek:** use-sound 5.0.0
- **Egyéb:** React Confetti 6.4.0, clsx, tailwind-merge

### Infrastruktúra
- **Docker Compose:** PostgreSQL + Backend + Frontend konténerek
- **Port-ok:** Backend (3000), Frontend (5173), PostgreSQL (5432)

---

## 2. Adatbázis Séma (Tényleges)

### Entitások és Kapcsolatok

#### **User** (users)
- **Mezők:**
  - `id` (UUID, PK) - Index
  - `username` (string, unique) - Index
  - `email` (string, unique)
  - `password_hash` (string)
  - `cash` (bigint, default: 1000) - Index
  - `energy` (int, default: 100)
  - `nerve` (int, default: 10)
  - `hp` (int, default: 100)
  - `xp` (int, default: 0) - Index
  - `level` (int, default: 1)
  - `talentPoints` (int, default: 0)
  - `learnedTalents` (jsonb, default: [])
  - `stats` (jsonb: {str, tol, int, spd}, default: {10,10,10,10})
  - `clanId` (string, nullable, FK → Clan) - Index
  - `clanRank` (enum: LEADER|MEMBER, nullable)
  - `bio` (text, nullable)
  - `settings` (jsonb: {soundEnabled: boolean}, default: {soundEnabled: true})
  - `avatarUrl` (text, nullable)
  - `createdAt`, `updatedAt` (timestamp)

- **Kapcsolatok:**
  - `User (N:1) → Clan` (ManyToOne)
  - `User (1:N) → Inventory`
  - `User (1:N) → MarketListing`
  - `User (1:N) → Message` (sender/receiver)
  - `User (1:N) → UserMission`
  - `User (1:N) → UserProperty`

#### **Clan** (clans)
- **Mezők:**
  - `id` (UUID, PK)
  - `name` (string, unique)
  - `tag` (string, max 4 char)
  - `description` (string, nullable)
  - `leaderId` (string, FK → User) - Index
  - `bank` (bigint, default: 0)
  - `createdAt` (timestamp)

- **Kapcsolatok:**
  - `Clan (1:1) → User` (leader, OneToOne)
  - `Clan (1:N) → User` (members, OneToMany)
  - `Clan (1:N) → District` (districts, OneToMany)

#### **Item** (items)
- **Mezők:**
  - `id` (UUID, PK)
  - `name` (string)
  - `type` (enum: WEAPON|ARMOR|VEHICLE)
  - `cost` (int)
  - `bonusStr` (int, default: 0)
  - `bonusDef` (int, default: 0)
  - `bonusSpd` (int, default: 0)
  - `image` (string, nullable)
  - `createdAt` (timestamp)

#### **Inventory** (inventory)
- **Mezők:**
  - `id` (UUID, PK)
  - `userId` (string, FK → User)
  - `itemId` (string, FK → Item)
  - `isEquipped` (boolean, default: false)
  - `isListed` (boolean, default: false)
  - `rarity` (enum: COMMON|UNCOMMON|RARE|EPIC|LEGENDARY, default: COMMON)
  - `quality` (float, default: 1.0) - Szorzó a statokra (0.8-1.5)
  - `createdAt` (timestamp)

- **Kapcsolatok:**
  - `Inventory (N:1) → User`
  - `Inventory (N:1) → Item`

#### **MarketListing** (market_listings)
- **Mezők:**
  - `id` (UUID, PK)
  - `sellerId` (string, FK → User)
  - `inventoryId` (string, FK → Inventory, eager)
  - `price` (bigint)
  - `isActive` (boolean, default: true)
  - `createdAt` (timestamp)

- **Kapcsolatok:**
  - `MarketListing (N:1) → User` (seller)
  - `MarketListing (N:1) → Inventory` (eager loading)

#### **Crime** (crimes)
- **Mezők:**
  - `id` (int, PK)
  - `name` (string)
  - `description` (string)
  - `energyCost` (int)
  - `difficulty` (int)
  - `minMoney` (int)
  - `maxMoney` (int)
  - `xpReward` (int)
  - `districtId` (int, nullable, FK → District)

- **Kapcsolatok:**
  - `Crime (N:1) → District` (nullable)

#### **District** (districts)
- **Mezők:**
  - `id` (int, PK)
  - `name` (string)
  - `description` (string)
  - `ownerClanId` (string, nullable, FK → Clan)
  - `defense` (int, default: 1000)
  - `maxDefense` (int, default: 1000)
  - `taxRate` (float, default: 0.05)
  - `image` (string, nullable)

- **Kapcsolatok:**
  - `District (N:1) → Clan` (ownerClan, nullable)

#### **Message** (messages)
- **Mezők:**
  - `id` (UUID, PK)
  - `senderId` (string, FK → User)
  - `receiverId` (string, FK → User)
  - `content` (text)
  - `isRead` (boolean, default: false)
  - `createdAt` (timestamp)

- **Kapcsolatok:**
  - `Message (N:1) → User` (sender)
  - `Message (N:1) → User` (receiver)

#### **Mission** (missions)
- **Mezők:**
  - `id` (int, PK)
  - `title` (string)
  - `description` (string)
  - `type` (enum: DAILY|STORY)
  - `requirementType` (enum: CRIME|FIGHT_WIN|GYM_TRAIN|LEVEL_UP)
  - `requirementValue` (int)
  - `rewardCash` (int, default: 0)
  - `rewardXp` (int, default: 0)
  - `rewardDiamonds` (int, default: 0)

#### **UserMission** (user_missions)
- **Mezők:**
  - `id` (int, PK)
  - `userId` (string, FK → User)
  - `missionId` (int, FK → Mission)
  - `progress` (int, default: 0)
  - `isCompleted` (boolean, default: false)
  - `isClaimed` (boolean, default: false)

- **Kapcsolatok:**
  - `UserMission (N:1) → User`
  - `UserMission (N:1) → Mission`

#### **Property** (properties)
- **Mezők:**
  - `id` (int, PK)
  - `name` (string)
  - `cost` (int)
  - `incomePerHour` (int)
  - `description` (string)
  - `imageUrl` (string, nullable)

#### **UserProperty** (user_properties)
- **Mezők:**
  - `id` (UUID, PK)
  - `userId` (string, FK → User)
  - `propertyId` (int, FK → Property)
  - `level` (int, default: 1)
  - `lastCollectedAt` (timestamp, default: CURRENT_TIMESTAMP)

- **Kapcsolatok:**
  - `UserProperty (N:1) → User`
  - `UserProperty (N:1) → Property`

### Indexek
- `User`: id, username, cash, xp, clanId
- `Clan`: id, leaderId

---

## 3. Implementált Funkciók (Modulonként)

### 🔐 **Auth Module**
**Fájlok:** `auth/auth.controller.ts`, `auth/auth.service.ts`, `auth/jwt-auth.guard.ts`, `auth/jwt.strategy.ts`

**Funkciók:**
- ✅ **POST /auth/register** - Új felhasználó regisztráció (bcrypt hash)
- ✅ **POST /auth/login** - Bejelentkezés (JWT token generálás)
- ✅ **JwtAuthGuard** - Védett végpontok autentikációja
- ✅ **JwtStrategy** - Passport JWT stratégia (userId kinyerése tokenből)

**Technológia:**
- JWT token alapú autentikáció
- Bcrypt jelszó hashelés
- Passport.js integráció

---

### 👤 **Users Module**
**Fájlok:** `users/users.controller.ts`, `users/users.service.ts`, `users/entities/user.entity.ts`

**Funkciók:**
- ✅ **GET /users/profile** - Saját profil lekérése (+ combat stats, max értékek)
- ✅ **PATCH /users/profile** - Profil frissítése (bio, settings)
- ✅ **POST /users/refill-energy** - Energia és HP feltöltés (pénzért)
- ✅ **POST /users/train** - Edzés a Gym-ben (stat növelés, energia költség)
- ✅ **GET /users** - Összes játékos listázása (kivéve saját magad, combat stats-szal)

**Szolgáltatások (UsersService):**
- `create()` - Új user létrehozása (regisztráció)
- `findByUsername()`, `findById()` - User keresés
- `findAllExcept()` - Játékosok listázása (PvP célra)
- `updateProfile()` - Bio és beállítások mentése
- `refillEnergy()` - Energia/HP feltöltés (költség: GameBalance alapján)
- `train()` - Stat növelés (str/tol/int/spd)
- `calculateCombatStats()` - Felszerelt itemek bónuszainak számítása (quality szorzóval)
- `getTopPlayers()` - Top 50 játékos XP alapján (Leaderboard)
- `getRichestPlayers()` - Top 50 játékos cash alapján

**Regeneráció:**
- Nincs automatikus regeneráció implementálva (csak manuális refill)

---

### 🔫 **Crimes Module**
**Fájlok:** `crimes/crimes.controller.ts`, `crimes/crimes.service.ts`, `crimes/entities/crime.entity.ts`

**Funkciók:**
- ✅ **GET /crimes** - Összes bűntény listázása
- ✅ **POST /crimes/commit/:id** - Bűntény elkövetése

**Logika (CrimesService.commitCrime):**
1. User és Crime betöltése
2. Energia ellenőrzés (energyCost)
3. Siker számítás: `successChance = 100 - crime.difficulty + user.stats.int`
4. RNG alapú döntés
5. **Siker esetén:**
   - Random pénz (minMoney-maxMoney)
   - XP jutalom
   - **5-10% esély loot dropra** (LootService.generateLoot)
   - Energia levonás
6. **Kudarc esetén:**
   - Energia levonás, nincs jutalom
7. Mission progress frissítés (CRIME típusú missziók)
8. Visszatérés: `{success, message, reward?, foundItem?}`

**Loot System:**
- `LootService.generateLoot()` - Random item generálás ritkaság és quality alapján
- Ritkaság súlyozás: COMMON (50%), UNCOMMON (30%), RARE (15%), EPIC (4%), LEGENDARY (1%)
- Quality: 0.8-1.5 közötti random float (stat szorzó)

---

### ⚔️ **Fight Module (PvP)**
**Fájlok:** `fight/fight.controller.ts`, `fight/fight.service.ts`

**Funkciók:**
- ✅ **POST /fight/attack/:targetId** - Támadás másik játékos ellen

**Logika (FightService.executeFight):**
1. Attacker és Defender betöltése
2. **Validációk:**
   - Nem támadhatod saját magad
   - Minimum HP ellenőrzés (FIGHT_MIN_HP_TO_ATTACK = 10)
   - Nerve ellenőrzés (FIGHT_NERVE_COST = 2)
3. **Lockolás:** `SELECT ... FOR UPDATE` (race condition védelem)
4. **Combat Stats számítás:** Felszerelt itemek + quality szorzó
5. **Harc szimuláció:**
   - Attacker Power = str + bonusStr
   - Defender Power = tol + bonusDef
   - Speed modifier (spd + bonusSpd)
   - RNG (0-100) + speed modifier
   - Győztes meghatározása
6. **Győzelem (Attacker):**
   - Defender cash 10%-ának ellopása
   - XP jutalom (+20)
   - HP veszteség: Attacker -5, Defender -30
   - Nerve levonás (-2)
7. **Vereség (Attacker):**
   - HP veszteség: Attacker -20
   - Nerve levonás (-2)
8. **Tranzakció:** User update-ek mentése
9. **Értesítés:** EventsGateway.sendNotificationToUser() (WebSocket)
10. Mission progress frissítés (FIGHT_WIN típusú missziók)
11. Visszatérés: `{winner, loser, cashStolen, xpGained, attackerStats, defenderStats}`

---

### 🛒 **Market Module**
**Fájlok:** `market/market.controller.ts`, `market/market.service.ts`, `market/entities/market-listing.entity.ts`

**Funkciók:**

**NPC Shop:**
- ✅ **GET /market/shop** - Összes Item listázása (NPC bolt)
- ✅ **POST /market/buy/:itemId** - Item vásárlás NPC-től
  - Cash ellenőrzés
  - Inventory létrehozás (rarity: COMMON, quality: 1.0)
  - Cash levonás

**Player-to-Player Marketplace:**
- ✅ **GET /market/listings** - Aktív hirdetések listázása (eager load: inventory + item)
- ✅ **GET /market/my-listings** - Saját hirdetések
- ✅ **POST /market/create-listing** - Új hirdetés létrehozása
  - Inventory validáció (tulajdonos, nincs felszerelve, nincs már listázva)
  - `isListed = true` flag beállítása
- ✅ **POST /market/buy-listing/:listingId** - Hirdetés megvásárlása
  - Cash ellenőrzés
  - Tranzakció: Vevő fizet, eladó kap pénzt
  - Inventory tulajdonos váltás
  - Listing inaktiválás
  - **WebSocket értesítés az eladónak** (EventsGateway)
  - **Privát üzenet az eladónak** (ChatService.sendSystemMessage)
- ✅ **POST /market/cancel-listing/:listingId** - Hirdetés visszavonása
  - `isListed = false`, `isActive = false`

---

### 🏰 **Clans Module**
**Fájlok:** `clans/clans.controller.ts`, `clans/clans.service.ts`, `clans/entities/clan.entity.ts`

**Funkciók:**
- ✅ **POST /clans** - Klán alapítás
  - Költség: 10,000 cash (CLAN_CREATION_COST)
  - Leader rang beállítása
- ✅ **POST /clans/:id/join** - Csatlakozás klánhoz
  - Validáció: nincs már klánod
  - MEMBER rang beállítása
- ✅ **POST /clans/leave** - Kilépés klánból
  - Leader nem léphet ki (először át kell adnia a vezetést)
- ✅ **GET /clans** - Összes klán listázása (members count-tal)
- ✅ **GET /clans/:id** - Klán részletek (members eager load)

**ClansService további funkciók:**
- `getTopClans()` - Top 50 klán (members XP összege alapján)

---

### 🗺️ **Territories Module**
**Fájlok:** `territories/territories.controller.ts`, `territories/territories.service.ts`, `territories/entities/district.entity.ts`

**Funkciók:**
- ✅ **GET /territories** - Térkép (összes district)
- ✅ **POST /territories/attack/:id** - District megtámadása
  - Validáció: Van klánod, klán nem birtokolja már
  - Damage számítás: User combat stats alapján
  - Defense csökkentés
  - **Ha defense <= 0:** Tulajdonos váltás, defense reset
  - Visszatérés: `{success, newDefense, conquered, district}`

**Adórendszer:**
- Nincs automatikus adóbeszedés implementálva (csak a taxRate mező létezik)

---

### 💬 **Chat Module (Private Messages)**
**Fájlok:** `chat/chat.controller.ts`, `chat/chat.service.ts`, `chat/entities/message.entity.ts`

**Funkciók:**
- ✅ **GET /chat/conversations** - Beszélgetések listája (utolsó üzenet + olvasatlan count)
- ✅ **GET /chat/conversation/:partnerId** - Beszélgetés részletei (összes üzenet)
- ✅ **POST /chat/read/:senderId** - Üzenetek olvasottnak jelölése

**WebSocket (ChatGateway):**
- ✅ **sendPrivateMessage** - Privát üzenet küldése (socket event)
  - Message mentése DB-be
  - Címzett értesítése (socket.to(`user:${receiverId}`).emit('privateMessage'))

**Rendszer üzenetek:**
- `sendSystemMessage()` - Automatikus üzenetek (pl. market vásárlás értesítés)

---

### 🎰 **Casino Module**
**Fájlok:** `casino/casino.controller.ts`, `casino/casino.service.ts`

**Funkciók:**
- ✅ **POST /casino/coinflip** - Pénzfeldobás
  - Body: `{amount, choice: 'heads'|'tails'}`
  - 50/50 esély
  - Győzelem: 2x pénz, Vereség: 0
- ✅ **POST /casino/spin** - Slots (nyerőgép)
  - Body: `{amount}`
  - 3 random szimbólum (🍒, 🍋, 🍊, 🍇, 💎, 7️⃣)
  - Paytable:
    - 3x 7️⃣: 50x (Jackpot)
    - 3x 💎: 20x
    - 3x 🍇: 10x
    - 3x 🍊: 5x
    - 3x 🍋: 3x
    - 3x 🍒: 2x
    - 2x azonos: 1x (visszafizetés)

---

### 🏠 **Properties Module**
**Fájlok:** `properties/properties.controller.ts`, `properties/properties.service.ts`

**Funkciók:**
- ✅ **GET /properties** - Összes ingatlan listázása
- ✅ **GET /properties/my** - Saját ingatlanok
- ✅ **POST /properties/buy/:id** - Ingatlan vásárlás
  - Cash ellenőrzés
  - UserProperty létrehozás (level: 1)
- ✅ **POST /properties/collect** - Jövedelem beszedése
  - Időalapú számítás: `income = incomePerHour * level * (eltelt órák)`
  - `lastCollectedAt` frissítése

---

### 🎯 **Missions Module**
**Fájlok:** `missions/missions.controller.ts`, `missions/missions.service.ts`

**Funkciók:**
- ✅ **GET /missions** - Missziók listázása (user progress-szel)
- ✅ **POST /missions/claim/:id** - Jutalom átvétele
  - Validáció: completed && !claimed
  - Jutalmak: cash, xp, diamonds (ha van)
  - `isClaimed = true`

**MissionsService:**
- `trackProgress()` - Progress frissítés (CRIME, FIGHT_WIN, GYM_TRAIN, LEVEL_UP)
  - Automatikusan hívódik a megfelelő service-ekből
  - `isCompleted = true` ha progress >= requirementValue

**Mission típusok:**
- DAILY: Napi missziók (nincs automatikus reset implementálva)
- STORY: Story missziók

---

### 🌟 **Talents Module**
**Fájlok:** `talents/talents.controller.ts`, `talents/talents.service.ts`, `talents/talents.constants.ts`

**Funkciók:**
- ✅ **GET /users/talents** - Talent tree lekérése
- ✅ **POST /users/talents/learn** - Talent tanulás
  - Body: `{talentId}`
  - Validáció: van elég talent point, nincs már megtanulva, tier követelmény
  - Talent point levonás
  - `learnedTalents` frissítése

**Talent Tree (talents.constants.ts):**
- **Tier 1:**
  - `iron_fist` - +5 Strength
  - `thick_skin` - +5 Defense
  - `quick_feet` - +5 Speed
  - `sharp_mind` - +5 Intelligence
- **Tier 2:**
  - `berserker` - +10 Strength (req: iron_fist)
  - `fortress` - +10 Defense (req: thick_skin)
  - `lightning` - +10 Speed (req: quick_feet)
  - `genius` - +10 Intelligence (req: sharp_mind)

**Talent bónuszok alkalmazása:**
- `TalentsService.applyTalentBonuses()` - Stat módosítók számítása
- Integrálva: CrimesService, FightService (combat stats-ba)

---

### 🏆 **Leaderboard Module**
**Fájlok:** `leaderboard/leaderboard.controller.ts`

**Funkciók:**
- ✅ **GET /leaderboard/players** - Top 50 játékos (XP alapján)
- ✅ **GET /leaderboard/rich** - Top 50 leggazdagabb (cash alapján)
- ✅ **GET /leaderboard/clans** - Top 50 klán (members XP összege)

**TODO:**
- Redis cache implementálás (TTL: 60s) - jelenleg minden hívás DB query

---

### 📡 **Events Module (WebSocket)**
**Fájlok:** `events/events.gateway.ts`

**Funkciók:**
- ✅ **WebSocketGateway** - Socket.io szerver (CORS: *)
- ✅ `sendNotificationToUser(userId, data)` - Értesítés küldése user-nek
  - Room: `user:${userId}`
  - Event: `notification`

**Használat:**
- Fight eredmények (támadás értesítés)
- Market vásárlás értesítés

---

### 🧮 **Common Module (Shared Services)**
**Fájlok:** `common/services/leveling.service.ts`, `common/services/loot.service.ts`

**LevelingService:**
- ✅ `checkLevelUp(user)` - Szintlépés ellenőrzés
  - XP curve: `requiredXP = 100 * level^1.5`
  - Level up esetén:
    - Talent point +1
    - HP/Energy/Nerve teljes feltöltés
    - Mission progress (LEVEL_UP)
- ✅ `calculateRequiredXP(level)` - Következő szinthez szükséges XP

**TODO:**
- Max stats számítás talent alapján (pl. Adrenaline: +5 Max Energy)

**LootService:**
- ✅ `generateLoot(userId)` - Random item generálás
  - Random item kiválasztás (Item táblából)
  - Ritkaság súlyozás (COMMON 50% → LEGENDARY 1%)
  - Quality random (0.8-1.5)
  - Inventory létrehozás

---

### 📦 **Inventory Module**
**Fájlok:** `inventory/inventory.controller.ts`, `inventory/inventory.service.ts`

**Funkciók:**
- ✅ **GET /inventory** - Saját inventory (eager load: item)
- ✅ **POST /inventory/equip/:id** - Item felszerelés
  - Validáció: tulajdonos, nincs listázva
  - Típus alapú slot: csak 1 WEAPON/ARMOR/VEHICLE lehet felszerelve
  - Előző item levetése (ha van)
- ✅ **POST /inventory/unequip/:id** - Item levetése

---

## 4. API Végpontok Térképe

### Publikus végpontok
```
POST   /auth/register
POST   /auth/login
GET    /crimes
```

### Védett végpontok (JwtAuthGuard)

#### Users
```
GET    /users/profile
PATCH  /users/profile
POST   /users/refill-energy
POST   /users/train
GET    /users
```

#### Talents
```
GET    /users/talents
POST   /users/talents/learn
```

#### Crimes
```
POST   /crimes/commit/:id
```

#### Fight
```
POST   /fight/attack/:targetId
```

#### Market
```
GET    /market/shop
POST   /market/buy/:itemId
GET    /market/listings
GET    /market/my-listings
POST   /market/create-listing
POST   /market/buy-listing/:listingId
POST   /market/cancel-listing/:listingId
```

#### Inventory
```
GET    /inventory
POST   /inventory/equip/:id
POST   /inventory/unequip/:id
```

#### Clans
```
POST   /clans
POST   /clans/:id/join
POST   /clans/leave
GET    /clans
GET    /clans/:id
```

#### Territories
```
GET    /territories
POST   /territories/attack/:id
```

#### Chat
```
GET    /chat/conversations
GET    /chat/conversation/:partnerId
POST   /chat/read/:senderId
```

#### Casino
```
POST   /casino/coinflip
POST   /casino/spin
```

#### Properties
```
GET    /properties
GET    /properties/my
POST   /properties/buy/:id
POST   /properties/collect
```

#### Missions
```
GET    /missions
POST   /missions/claim/:id
```

#### Leaderboard
```
GET    /leaderboard/players
GET    /leaderboard/rich
GET    /leaderboard/clans
```

### WebSocket Events
```
EMIT   notification (server → client)
EMIT   privateMessage (server → client)
ON     sendPrivateMessage (client → server)
```

---

## 5. Frontend Állapot

### Oldalak (Pages)
A következő oldalak vannak implementálva (`frontend/src/pages/`):

1. **LandingPage.tsx** - Nyitóoldal (publikus)
2. **LoginPage.tsx** - Bejelentkezés
3. **RegisterPage.tsx** - Regisztráció
4. **DashboardPage.tsx** - Főoldal (védett)
5. **CrimesPage.tsx** - Bűntények
6. **GymPage.tsx** - Edzőterem (stat training)
7. **TheStreetsPage.tsx** - PvP (játékosok listája, támadás)
8. **BlackMarketPage.tsx** - NPC Shop (item vásárlás)
9. **InventoryPage.tsx** - Inventory (felszerelés, levetés)
10. **PlayerMarketPage.tsx** - P2P Marketplace (hirdetések, vásárlás, listázás)
11. **ClansPage.tsx** - Klánok (alapítás, csatlakozás, kilépés)
12. **CityMap.tsx** - Térkép (territories, district támadás)
13. **LeaderboardPage.tsx** - Ranglisták (players, rich, clans)
14. **ProfilePage.tsx** - Profil (bio szerkesztés, beállítások, kijelentkezés)
15. **CasinoPage.tsx** - Kaszinó (Coinflip, Slots)
16. **PropertiesPage.tsx** - Ingatlanok (vásárlás, jövedelem beszedés)
17. **TalentsPage.tsx** - Talent Tree (tanulás)
18. **MissionsPage.tsx** - Missziók (progress, jutalom átvétel)

### Design System (index.css)

**Színpaletta:**
- Primary: `#dc2626` (piros, neon glow)
- Secondary: `#eab308` (sárga)
- Success: `#22c55e` (zöld)
- Dark: `#0f1115` (background), `#1f2937` (surface)

**Fontok:**
- Sans: `Inter` (body text)
- Display/Tech: `Orbitron` (headings, neon text)

**Komponens osztályok:**
- `.btn-primary` - Neon piros gomb (hover glow)
- `.btn-secondary` - Szürke outline gomb
- `.btn-ghost` - Átlátszó gomb
- `.glass-panel` - Glassmorphism kártya (backdrop-blur, border glow)
- `.neon-text` - Neon szöveg effekt (piros)
- `.neon-text-secondary` - Neon szöveg (sárga)
- `.stat-card-strength` - Piros glow kártya (STR)
- `.stat-card-defense` - Zöld glow kártya (DEF)
- `.stat-card-speed` - Sárga glow kártya (SPD)
- `.stat-card-intelligence` - Lila glow kártya (INT)

**Animációk:**
- `.animate-fade-in` - Fade in (0.5s)
- `.animate-slide-in-up` - Slide up + fade (0.6s)
- `.animate-pulse-slow` - Lassú pulse (3s infinite)
- Stagger delays: `.delay-100` - `.delay-500`

**Egyéb:**
- Custom scrollbar (dark theme)
- Radial gradient background (fixed)

### Hooks

**useAuth (AuthContext):**
- `user` - Bejelentkezett user adatok
- `login(username, password)` - Bejelentkezés
- `register(username, email, password)` - Regisztráció
- `logout()` - Kijelentkezés
- `refreshProfile()` - Profil frissítés (pl. fight után)

**useSocket (hooks/useSocket.ts):**
- `socket` - Socket.io client instance
- `isConnected` - Kapcsolat állapot
- Automatikus reconnect
- User room join (`user:${userId}`)
- Event listeners: `notification`, `privateMessage`

**useGameSound (hooks/useGameSound.ts):**
- `playSound(type)` - Hangeffekt lejátszás
- Típusok: `success`, `error`, `click`, `coin`, `fight`, `levelup`
- User settings alapján be/ki kapcsolható

**useToast (hooks/useToast.ts):**
- `toast.success(message)` - Sikeres toast
- `toast.error(message)` - Hiba toast
- React Hot Toast wrapper

### Komponensek (components/)

**Layout:**
- `DashboardLayout.tsx` - Főoldal layout (header, sidebar, main content)
- `ProtectedRoute.tsx` - Route védelem (redirect login-ra)

**Dashboard:**
- `ResourceHexagon.tsx` - Hexagon alakú resource display (cash, energy, HP, nerve)
- `BottomNavigation.tsx` - Mobil navigáció (alsó sáv)
- `FloatingText.tsx` - Animált szöveg effekt (pl. +100 cash)

**UI:**
- `AnimatedCard.tsx` - Hover/tap animációval ellátott kártya
- `CountUp.tsx` - Számláló animáció (framer-motion)
- `CombatResultModal.tsx` - Fight eredmény modal
- `TalentNode.tsx` - Talent tree node (locked/unlocked/learned)
- `ChatWidget.tsx` - Chat widget (Global/Private tabok, beszélgetések)

### Context Providers

**AuthContext:**
- JWT token kezelés (localStorage)
- User state management
- Axios interceptor (Authorization header)

**ChatContext:**
- WebSocket kapcsolat kezelés
- Conversations state
- Unread count tracking
- Message küldés/fogadás

---

## 6. Hiányosságok és TODO (Audit eredménye)

### Backend TODO-k (kódban kommentezve)

1. **Leaderboard caching** (`leaderboard/leaderboard.controller.ts:15`)
   - Redis cache implementálás (TTL: 60s) a DB terhelés csökkentésére
   - Jelenleg minden hívás DB query

2. **Max stats talent bónusz** (`common/services/leveling.service.ts:28`)
   - Max Energy/HP/Nerve növelés talent alapján (pl. Adrenaline: +5 Max Energy)
   - Jelenleg csak a GameBalance konstansok vannak használva

### Hiányzó funkciók (nem implementált)

#### Backend:
- ❌ **Automatikus regeneráció** - Energy/HP/Nerve időalapú regeneráció (cron job)
- ❌ **Klán adórendszer** - Automatikus adóbeszedés (district tax → clan bank)
- ❌ **Daily mission reset** - Napi missziók automatikus újragenerálása
- ❌ **Email verifikáció** - Regisztráció után email megerősítés
- ❌ **Password reset** - Elfelejtett jelszó funkció
- ❌ **Admin panel** - Admin jogosultságok, moderáció
- ❌ **Rate limiting** - API rate limit védelem (pl. express-rate-limit)
- ❌ **Logging** - Strukturált logging (pl. Winston, Pino)
- ❌ **Error tracking** - Sentry integráció
- ❌ **Database migrations** - TypeORM migration fájlok (jelenleg synchronize: true)

#### Frontend:
- ❌ **Loading states** - Globális loading indicator (API hívások alatt)
- ❌ **Error boundaries** - React error boundary komponensek
- ❌ **Offline mode** - Service worker, offline cache
- ❌ **PWA** - Progressive Web App manifest
- ❌ **Dark/Light mode toggle** - Jelenleg csak dark theme
- ❌ **Nyelv váltás** - i18n (jelenleg csak magyar)
- ❌ **Accessibility** - ARIA labels, keyboard navigation
- ❌ **Analytics** - Google Analytics / Mixpanel integráció

### Potenciális optimalizálási lehetőségek

#### Teljesítmény:
1. **Database:**
   - Composite indexek hozzáadása (pl. `userId + isEquipped` az Inventory-n)
   - Query optimization (N+1 probléma ellenőrzés)
   - Connection pooling finomhangolás

2. **Caching:**
   - Redis cache réteg (leaderboards, user profiles, items)
   - Frontend: React Query / SWR használata (cache + revalidation)

3. **WebSocket:**
   - Room-based broadcasting optimalizálás
   - Socket.io adapter (Redis) multi-instance környezethez

#### Biztonság:
1. **Input validáció:**
   - DTO validáció szigorítása (pl. max string length, regex)
   - SQL injection védelem (TypeORM query builder használata)

2. **Rate limiting:**
   - Endpoint-specifikus rate limitek (pl. /auth/login: 5/min)
   - IP-based throttling

3. **CORS:**
   - Jelenleg `origin: '*'` (WebSocket) - production-ben szigorítani!

4. **JWT:**
   - Refresh token implementálás (jelenleg csak access token)
   - Token blacklist (logout után)

#### Kód minőség:
1. **Testing:**
   - Unit tesztek (jelenleg 0% coverage)
   - Integration tesztek (E2E)
   - Load testing (K6, Artillery)

2. **Documentation:**
   - OpenAPI/Swagger dokumentáció
   - JSDoc kommentek
   - Architecture Decision Records (ADR)

3. **CI/CD:**
   - GitHub Actions pipeline (lint, test, build, deploy)
   - Automated deployment (Docker registry, Kubernetes)

#### UX:
1. **Feedback:**
   - Több vizuális feedback (pl. button loading state)
   - Optimistic UI updates (pl. inventory equip azonnal frissül)

2. **Mobile:**
   - Touch gestures (swipe, long-press)
   - Responsive táblázatok (horizontal scroll)

3. **Accessibility:**
   - Screen reader support
   - Keyboard shortcuts

---

## 7. Összegzés

### Implementált rendszerek (✅)
- ✅ Autentikáció (JWT)
- ✅ User management (profil, stats, training)
- ✅ Bűntények (loot system-mel)
- ✅ PvP Combat (race condition védelem)
- ✅ Item rendszer (rarity, quality)
- ✅ NPC Shop + P2P Marketplace
- ✅ Klánok (alapítás, csatlakozás)
- ✅ Territories (district támadás)
- ✅ Privát üzenetek (WebSocket)
- ✅ Kaszinó (Coinflip, Slots)
- ✅ Ingatlanok (jövedelem generálás)
- ✅ Talent Tree (2 tier)
- ✅ Missziók (progress tracking)
- ✅ Leaderboards (XP, Cash, Clans)
- ✅ Leveling rendszer (XP curve)
- ✅ Real-time értesítések (WebSocket)

### Következő lépések (prioritás szerint)
1. **P1 (Kritikus):**
   - Automatikus regeneráció (Energy/HP/Nerve)
   - Redis cache (leaderboards)
   - Rate limiting
   - CORS szigorítás (production)

2. **P2 (Fontos):**
   - Database migrations
   - Unit tesztek
   - Error tracking (Sentry)
   - Refresh token

3. **P3 (Nice-to-have):**
   - Admin panel
   - Email verifikáció
   - PWA
   - i18n

---

**Dokumentum vége** - Utolsó frissítés: 2025-11-28
